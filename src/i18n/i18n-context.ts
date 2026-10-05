import { createContext, useContext } from 'react'
import type { LanguageCode } from '../lib/types'
import type { Language } from './languages'
import type { Messages } from './translation'

export interface I18n {
  /** The language on screen, e.g. "mr". */
  lang: LanguageCode
  /** Its details: names, Intl locale, speech tag. */
  language: Language
  /** Every text in that language: `t.common.retry`, `t.nav.tabs.home`, `t.auth.phoneInvalid(10)`. */
  t: Messages
  /**
   * Switches the app to `lang` once its texts have loaded (the current language stays on screen until then),
   * remembers it on this device and, when signed in, in the account.
   */
  setLanguage: (lang: LanguageCode) => void
  /** The language being loaded after setLanguage(), or null. */
  pendingLang: LanguageCode | null
}

export const I18nContext = createContext<I18n | null>(null)

/** The active language and its texts; re-renders when the language changes. */
export function useI18n(): I18n {
  const i18n = useContext(I18nContext)
  if (!i18n) throw new Error('useI18n() must be used inside <I18nProvider>')
  return i18n
}
