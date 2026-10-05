import { useEffect, useEffectEvent, useState } from 'react'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import type { MessageSelector } from '../../i18n/translation'

/** The part of the Web Speech API's SpeechRecognition used here; lib.dom only declares its events. */
interface SpeechRecognizer {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  abort: () => void
}

type SpeechRecognizerConstructor = new () => SpeechRecognizer

/** Chrome and Safari ship the recognizer under its `webkit` prefix; undefined where it is missing. */
function speechRecognizer(): SpeechRecognizerConstructor | undefined {
  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognizerConstructor
    webkitSpeechRecognition?: SpeechRecognizerConstructor
  }
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
}

/** Errors the farmer can act on; any other error gets the generic "type your search" message. */
const SPEECH_ERRORS: Partial<Record<SpeechRecognitionErrorCode, MessageSelector>> = {
  'no-speech': (t) => t.store.voice.errors.noSpeech,
  'audio-capture': (t) => t.store.voice.errors.noMicrophone,
  'not-allowed': (t) => t.store.voice.errors.micBlocked,
  'service-not-allowed': (t) => t.store.voice.errors.micBlocked,
  network: (t) => t.store.voice.errors.offline,
}

export interface SpeechSearch {
  listening: boolean
  /** Starts listening, or stops if already listening; explains when the browser cannot listen. */
  toggle: () => void
  cancel: () => void
}

/**
 * Voice search with the Web Speech API, listening in the app language. A recognizer runs while `listening`;
 * the phrase it hears is passed to `onTranscript`. It stops after one phrase, on `cancel()`, or when the
 * component unmounts.
 */
export function useSpeechSearch(onTranscript: (transcript: string) => void): SpeechSearch {
  const { t, language } = useI18n()
  const toast = useToast()
  const [listening, setListening] = useState(false)
  const deliverTranscript = useEffectEvent(onTranscript)
  const reportError = useEffectEvent((error: SpeechRecognitionErrorCode) => {
    if (error === 'aborted') return
    const message = SPEECH_ERRORS[error]?.(t) ?? t.store.voice.errors.failed
    toast.show(message, error === 'no-speech' ? 'info' : 'error')
  })
  const speechTag = language.speechTag

  useEffect(() => {
    const Recognizer = speechRecognizer()
    if (!listening || !Recognizer) return

    const recognizer = new Recognizer()
    recognizer.lang = speechTag
    recognizer.interimResults = false
    recognizer.maxAlternatives = 1
    recognizer.onresult = (event) => {
      const transcript = Array.from(event.results, (result) => result[0].transcript)
        .join(' ')
        .trim()
      if (transcript) deliverTranscript(transcript)
    }
    recognizer.onerror = (event) => reportError(event.error)
    recognizer.onend = () => setListening(false)
    recognizer.start()

    return () => {
      recognizer.onresult = null
      recognizer.onerror = null
      recognizer.onend = null
      recognizer.abort()
    }
  }, [listening, speechTag])

  const toggle = () => {
    if (listening) setListening(false)
    else if (speechRecognizer()) setListening(true)
    else toast.show(t.store.voice.unsupported, 'info')
  }

  return { listening, toggle, cancel: () => setListening(false) }
}
