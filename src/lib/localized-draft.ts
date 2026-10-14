import type { LanguageCode, LocalizedText } from './types'

/** A text being edited in three languages; blank translations are sent as null. */
export interface LocalizedDraft {
  en: string
  mr: string
  hi: string
}

export const EMPTY_DRAFT: LocalizedDraft = { en: '', mr: '', hi: '' }

export function toDraft(text: LocalizedText | null): LocalizedDraft {
  return { en: text?.en ?? '', mr: text?.mr ?? '', hi: text?.hi ?? '' }
}

/** The draft as the API takes it: trimmed, with blank translations as null. */
export function fromDraft(draft: LocalizedDraft): LocalizedText {
  return { en: draft.en.trim(), mr: draft.mr.trim() || null, hi: draft.hi.trim() || null }
}

/** An optional text: null when even its English is blank. */
export function fromOptionalDraft(draft: LocalizedDraft): LocalizedText | null {
  return draft.en.trim() ? fromDraft(draft) : null
}

/** A text someone typed in up to three languages, in the active language, or in English without a translation. */
export function inLanguage(text: LocalizedText, lang: LanguageCode): string {
  return (lang === 'en' ? null : text[lang]) ?? text.en
}
