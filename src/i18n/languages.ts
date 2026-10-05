import type { LanguageCode } from '../lib/types'

export interface Language {
  code: LanguageCode
  /** The language's own name, as the language menu lists it. */
  nativeName: string
  /** What the header's language button shows. */
  shortLabel: string
  /** Intl locale: Indian conventions (12,34,567) with Latin digits in every language. */
  locale: string
  /** BCP 47 tag for speech synthesis and recognition. */
  speechTag: string
  /** Voice used when none speaks the language itself (Marathi text is read by a Hindi voice: same script). */
  fallbackSpeechTag?: string
}

export const LANGUAGES: Readonly<Record<LanguageCode, Language>> = {
  en: { code: 'en', nativeName: 'English', shortLabel: 'EN', locale: 'en-IN-u-nu-latn', speechTag: 'en-IN' },
  mr: {
    code: 'mr',
    nativeName: 'मराठी',
    shortLabel: 'मराठी',
    locale: 'mr-IN-u-nu-latn',
    speechTag: 'mr-IN',
    fallbackSpeechTag: 'hi-IN',
  },
  hi: { code: 'hi', nativeName: 'हिन्दी', shortLabel: 'हिन्दी', locale: 'hi-IN-u-nu-latn', speechTag: 'hi-IN' },
}

/** In menu order. */
export const LANGUAGE_LIST: readonly Language[] = Object.values(LANGUAGES)

/** English is the source of every text and ships with the app. */
export const DEFAULT_LANGUAGE: LanguageCode = 'en'

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === 'string' && Object.hasOwn(LANGUAGES, value)
}

/** The first of the browser's preferred languages ("mr-IN", "hi") the app speaks. */
export function matchLanguage(tags: readonly string[]): LanguageCode | undefined {
  return tags.map((tag) => tag.split('-')[0].toLowerCase()).find(isLanguageCode)
}
