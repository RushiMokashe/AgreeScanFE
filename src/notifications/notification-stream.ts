import { api, getSession, subscribeSession } from '../lib/api'
import type { AppNotification, LanguageCode } from '../lib/types'
import { apiUrl } from '../platform/api-base'

/** The server pings every 25 s; a stream silent for longer than this has died without telling us. */
const SILENCE_LIMIT_MS = 60_000
const FIRST_RETRY_MS = 1_000
const MAX_RETRY_MS = 60_000
/** After this many failed connections in a row the unread count is also polled, until streaming works again. */
const FAILURES_BEFORE_POLLING = 3
const POLL_INTERVAL_MS = 30_000
/** A tab hidden this long closes its stream, freeing the connection; it reconnects when shown again. */
const HIDDEN_GRACE_MS = 5 * 60_000

const STREAM_PATH = '/api/notifications/stream'
const NOTIFICATION_EVENT = 'notification'
const EVENT_SEPARATOR = /\r?\n\r?\n/
const LINE_SEPARATOR = /\r?\n/

export interface StreamListener {
  onNotification: (notification: AppNotification) => void
  /** The stream (re)opened or a poll is due: whatever was missed meanwhile should be fetched again. */
  onResync: () => void
}

export interface NotificationStream {
  close: () => void
}

/** One Server-Sent Event: its name and its data lines joined. */
interface StreamEvent {
  name: string
  data: string
}

function parseEvent(block: string): StreamEvent {
  let name = 'message'
  const data: string[] = []
  for (const line of block.split(LINE_SEPARATOR)) {
    const colon = line.indexOf(':')
    if (colon <= 0) continue // a comment (":...") or a line without a field
    const field = line.slice(0, colon)
    const value = line.slice(colon + 1).replace(/^ /, '')
    if (field === 'event') name = value
    else if (field === 'data') data.push(value)
  }
  return { name, data: data.join('\n') }
}

/** Waiting time before the next attempt: doubling per failure, capped, with jitter so tabs do not reconnect together. */
function retryDelay(failures: number): number {
  const base = Math.min(MAX_RETRY_MS, FIRST_RETRY_MS * 2 ** Math.max(0, failures - 1))
  return base * (0.5 + Math.random())
}

/**
 * Reads the signed-in user's live notifications (docs/architecture/phase-2.md, D10) from
 * GET /api/notifications/stream. It uses fetch rather than EventSource so the bearer token and the language go
 * with the request. The stream reconnects with back-off after failures, at once after the server ends it (every
 * 30 minutes) or the access token changes, and stops when the user signs out. It closes while the tab stays
 * hidden, and polls through `onResync` while connecting keeps failing. Start a new one when the language changes.
 */
export function openNotificationStream(language: LanguageCode, listener: StreamListener): NotificationStream {
  let closed = false
  let pausedWhileHidden = false
  let failures = 0
  let connection: AbortController | null = null
  let connectedToken: string | null = null
  let retryTimer: ReturnType<typeof setTimeout> | undefined
  let silenceTimer: ReturnType<typeof setTimeout> | undefined
  let hiddenTimer: ReturnType<typeof setTimeout> | undefined
  let pollTimer: ReturnType<typeof setInterval> | undefined

  const disconnect = () => {
    connection?.abort()
    connection = null
    connectedToken = null
    clearTimeout(retryTimer)
    clearTimeout(silenceTimer)
  }

  const startPolling = () => {
    pollTimer ??= setInterval(listener.onResync, POLL_INTERVAL_MS)
  }

  const stopPolling = () => {
    clearInterval(pollTimer)
    pollTimer = undefined
  }

  const scheduleConnect = (delay: number) => {
    clearTimeout(retryTimer)
    retryTimer = setTimeout(() => void connect(), delay)
  }

  const fail = () => {
    failures += 1
    if (failures >= FAILURES_BEFORE_POLLING) startPolling()
    scheduleConnect(retryDelay(failures))
  }

  /** A stream that stays silent past the server's heartbeat is reopened. */
  const watchSilence = (current: AbortController) => {
    clearTimeout(silenceTimer)
    silenceTimer = setTimeout(() => current.abort(), SILENCE_LIMIT_MS)
  }

  const connect = async () => {
    if (closed || pausedWhileHidden) return
    const session = getSession()
    if (!session) return // signed out: the session listener reconnects after the next sign-in
    disconnect()
    const current = new AbortController()
    connection = current
    connectedToken = session.accessToken
    try {
      const response = await fetch(apiUrl(STREAM_PATH), {
        headers: {
          Accept: 'text/event-stream',
          'Accept-Language': language,
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: 'no-store',
        signal: current.signal,
      })
      if (response.status === 401) {
        // The access token expired: renewing the session changes it, and the session listener reconnects.
        await api.auth.refresh().catch(() => undefined)
        if (getSession()?.accessToken === session.accessToken) fail()
        return
      }
      if (!response.ok || !response.body) {
        fail()
        return
      }
      failures = 0
      stopPolling()
      listener.onResync()
      watchSilence(current)
      await readEvents(response.body, current)
      if (!current.signal.aborted) scheduleConnect(FIRST_RETRY_MS) // the server ended the stream: reopen it
    } catch {
      if (connection === current && !closed) fail()
    }
  }

  const readEvents = async (body: ReadableStream<Uint8Array>, current: AbortController) => {
    const reader = body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    for (;;) {
      const { value, done } = await reader.read()
      if (done) return
      watchSilence(current)
      buffer += decoder.decode(value, { stream: true })
      const blocks = buffer.split(EVENT_SEPARATOR)
      buffer = blocks.pop() ?? ''
      for (const block of blocks) {
        const event = parseEvent(block)
        if (event.name === NOTIFICATION_EVENT && event.data) {
          listener.onNotification(JSON.parse(event.data) as AppNotification)
        }
      }
    }
  }

  const unsubscribeSession = subscribeSession(() => {
    const token = getSession()?.accessToken ?? null
    if (token === null) disconnect()
    else if (token !== connectedToken) void connect()
  })

  const onVisibilityChange = () => {
    clearTimeout(hiddenTimer)
    if (document.visibilityState === 'hidden') {
      hiddenTimer = setTimeout(() => {
        pausedWhileHidden = true
        disconnect()
      }, HIDDEN_GRACE_MS)
    } else if (pausedWhileHidden) {
      pausedWhileHidden = false
      void connect()
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  void connect()

  return {
    close: () => {
      closed = true
      disconnect()
      stopPolling()
      clearTimeout(hiddenTimer)
      unsubscribeSession()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    },
  }
}
