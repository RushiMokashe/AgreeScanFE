import { useEffect, useRef, useState } from 'react'
import { useToast } from '../components/toast/toast-context'
import { useI18n } from '../i18n/i18n-context'
import { canSpeak, prepareVoices, speak, stopSpeaking } from '../lib/speech'

export interface SpeechPlayer {
  /** Id of the clip being read aloud, or null while silent. */
  playing: string | null
  /**
   * Reads `text` (written in the active language) aloud as clip `id` with that language's voice, interrupting
   * any other clip; stops instead if `id` is already playing.
   */
  toggle: (id: string, text: string) => void
}

/** Read-aloud clips via the Web Speech API; a clip still playing stops when the component unmounts. */
export function useSpeech(): SpeechPlayer {
  const { language, t } = useI18n()
  const toast = useToast()
  const [playing, setPlaying] = useState<string | null>(null)
  const clipsStarted = useRef(0)
  // Number of this player's clip being read, or null; reports from its earlier clips are ignored.
  const activeClip = useRef<number | null>(null)

  useEffect(() => {
    prepareVoices()
    return () => {
      if (activeClip.current !== null) stopSpeaking()
    }
  }, [])

  const toggle = (id: string, text: string) => {
    if (!canSpeak()) {
      toast.show(t.common.speech.unsupported, 'info')
      return
    }
    if (playing === id) {
      activeClip.current = null
      stopSpeaking()
      setPlaying(null)
      return
    }
    const clip = ++clipsStarted.current
    activeClip.current = clip
    setPlaying(id)
    speak(text, language, () => {
      if (activeClip.current !== clip) return
      activeClip.current = null
      setPlaying(null)
    })
  }

  return { playing, toggle }
}
