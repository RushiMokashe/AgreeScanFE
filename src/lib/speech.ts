import type { Language } from '../i18n/languages'

/**
 * Chrome's network voices stop a long utterance after about 15 seconds without firing `end`, so text is
 * queued sentence by sentence. Hindi and Marathi end a sentence with a danda (।).
 */
const SENTENCE_BREAK = /(?<=[.!?।])\s+/

/** Whether this browser can read text aloud. */
export function canSpeak(): boolean {
  return 'speechSynthesis' in window
}

/**
 * Asks for the installed voices once, early: Chrome loads them in the background and returns none on the
 * first call, which would leave the first clip without its language's voice.
 */
export function prepareVoices(): void {
  if (canSpeak()) window.speechSynthesis.getVoices()
}

/** Language tag in one spelling: lower case with hyphens (Android reports "hi_IN"). */
function normalizeTag(tag: string): string {
  return tag.replaceAll('_', '-').toLowerCase()
}

function primarySubtag(tag: string): string {
  return normalizeTag(tag).split('-')[0]
}

/**
 * The installed voice that reads `language` best: its exact locale, then any voice of the language, then the
 * same for its fallback (a Hindi voice reads Marathi when no Marathi voice is installed). Undefined leaves
 * the choice to the browser.
 */
export function pickVoice(
  language: Language,
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  const tags = language.fallbackSpeechTag ? [language.speechTag, language.fallbackSpeechTag] : [language.speechTag]
  for (const tag of tags) {
    const voice =
      voices.find((candidate) => normalizeTag(candidate.lang) === normalizeTag(tag)) ??
      voices.find((candidate) => primarySubtag(candidate.lang) === primarySubtag(tag))
    if (voice) return voice
  }
  return undefined
}

/**
 * Reads `text` aloud in `language`, interrupting whatever is being read. `onDone` runs once, when reading
 * ends: finished, failed, or interrupted by another clip or stopSpeaking(). Check canSpeak() first.
 */
export function speak(text: string, language: Language, onDone: () => void): void {
  const synthesis = window.speechSynthesis
  synthesis.cancel()

  let done = false
  const finish = () => {
    if (done) return
    done = true
    onDone()
  }

  const sentences = text.split(SENTENCE_BREAK).filter((sentence) => sentence.trim())
  if (sentences.length === 0) {
    finish()
    return
  }
  const voice = pickVoice(language, synthesis.getVoices())
  sentences.forEach((sentence, index) => {
    const utterance = new SpeechSynthesisUtterance(sentence)
    utterance.lang = voice ? normalizeTag(voice.lang) : language.speechTag
    if (voice) utterance.voice = voice
    utterance.onerror = finish
    if (index === sentences.length - 1) utterance.onend = finish
    synthesis.speak(utterance)
  })
}

/** Stops reading aloud. */
export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel()
}

/** The part of the Web Speech API's SpeechRecognition the app uses (lib.dom declares only its events). */
export interface SpeechRecognizer {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognizerConstructor = new () => SpeechRecognizer

/** Chrome and Safari ship the recognizer under its `webkit` prefix; undefined where it is missing. */
function recognizerConstructor(): SpeechRecognizerConstructor | undefined {
  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognizerConstructor
    webkitSpeechRecognition?: SpeechRecognizerConstructor
  }
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
}

/** Whether this browser can turn speech into text. */
export function canRecognizeSpeech(): boolean {
  return recognizerConstructor() !== undefined
}

/**
 * A recognizer that listens for one phrase in `language` (final results only, best guess only), or
 * undefined where the browser cannot recognize speech. Set its handlers, then call start().
 */
export function createSpeechRecognizer(language: Language): SpeechRecognizer | undefined {
  const Recognizer = recognizerConstructor()
  if (!Recognizer) return undefined
  const recognizer = new Recognizer()
  recognizer.lang = language.speechTag
  recognizer.continuous = false
  recognizer.interimResults = false
  recognizer.maxAlternatives = 1
  return recognizer
}
