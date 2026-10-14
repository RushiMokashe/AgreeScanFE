import { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'
import { api } from '../lib/api'
import type { AppNotification } from '../lib/types'
import { useNotifications } from './notifications-context'
import { withNewest, withUpdated } from './notifications-utils'

/** Notifications per page of the list. */
const PAGE_SIZE = 20

interface Feed {
  items: AppNotification[]
  /** The page "Show older" loads next. */
  nextPage: number
  hasMore: boolean
}

async function firstPage(): Promise<Feed> {
  const page = await api.notifications.list(0, PAGE_SIZE)
  return { items: page.items, nextPage: 1, hasMore: page.totalPages > 1 }
}

/**
 * The notifications list, newest first: the first page on open, older pages on request, and live notifications
 * added on top as they arrive. Older pages are joined by id, so notifications that arrived meanwhile (and pushed
 * the pages back) never show twice.
 */
export function useNotificationFeed() {
  const notifications = useNotifications()
  const { data, error, reload, setData } = useApi(firstPage)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(
    () => notifications.subscribe((notification) => setData((feed) => ({ ...feed, items: withNewest(feed.items, notification) }))),
    [notifications, setData],
  )

  /** Loads the next older page; rejects with an ApiError. */
  const loadMore = async () => {
    if (!data?.hasMore) return
    setLoadingMore(true)
    try {
      const page = await api.notifications.list(data.nextPage, PAGE_SIZE)
      setData((feed) => {
        const known = new Set(feed.items.map((item) => item.id))
        return {
          items: [...feed.items, ...page.items.filter((item) => !known.has(item.id))],
          nextPage: page.page + 1,
          hasMore: page.page + 1 < page.totalPages,
        }
      })
    } finally {
      setLoadingMore(false)
    }
  }

  /** Marks a notification read, here and on the bell; rejects with an ApiError. */
  const markRead = async (notification: AppNotification) => {
    const updated = await notifications.markRead(notification)
    setData((feed) => ({ ...feed, items: withUpdated(feed.items, updated) }))
  }

  /** Marks every notification read; rejects with an ApiError. */
  const markAllRead = async () => {
    await notifications.markAllRead()
    setData((feed) => ({ ...feed, items: feed.items.map((item) => ({ ...item, read: true })) }))
  }

  return { feed: data, error, reload, loadingMore, loadMore, markRead, markAllRead }
}
