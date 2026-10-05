import { useCallback, useEffect, useEffectEvent, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { SplashScreen } from '../components/SplashScreen'
import { useToast } from '../components/toast/toast-context'
import { api, getSession, setApiLanguage, subscribeSession } from '../lib/api'
import type { CurrentUser, LanguageCode } from '../lib/types'
import { I18nContext, type I18n } from './i18n-context'
import { DEFAULT_LANGUAGE, LANGUAGES, isLanguageCode, matchLanguage } from './languages'
import { en } from './messages/en'
import type { Messages } from './translation'

/** This device's language; a signed-in account keeps its own in CurrentUser.preferredLanguage. */
const STORAGE_KEY = 'agriscan.lang'

/** English ships with the app; Marathi and Hindi are fetched the first time they are needed. */
const LOADERS: Readonly<Record<LanguageCode, () => Promise<Messages>>> = {
  en: () => Promise.resolve(en),
  mr: () => import('./messages/mr').then((module) => module.mr),
  hi: () => import('./messages/hi').then((module) => module.hi),
}

const loadedMessages = new Map<LanguageCode, Messages>([['en', en]])

async function loadMessages(lang: LanguageCode): Promise<Messages> {
  const cached = loadedMessages.get(lang)
  if (cached) return cached
  const messages = await LOADERS[lang]()
  loadedMessages.set(lang, messages)
  return messages
}

function storedLanguage(): LanguageCode | undefined {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return isLanguageCode(value) ? value : undefined
  } catch {
    return undefined // storage blocked (private mode, disabled site data)
  }
}

function storeLanguage(lang: LanguageCode): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // storage blocked: the language then lasts for this visit only
  }
}

/** The language chosen last on this device, else the browser's when the app speaks it, else English. */
function deviceLanguage(): LanguageCode {
  return storedLanguage() ?? matchLanguage(navigator.languages) ?? DEFAULT_LANGUAGE
}

/** Saves the language to the signed-in account; if that fails, the choice still applies on this device. */
function saveToAccount(lang: LanguageCode): void {
  api.auth.updateMe({ preferredLanguage: lang }).catch(() => undefined)
}

/** The language on screen and its texts. */
interface Shown {
  lang: LanguageCode
  t: Messages
}

function shownFromCache(lang: LanguageCode): Shown | undefined {
  const t = loadedMessages.get(lang)
  return t && { lang, t }
}

/**
 * Provides the active language (useI18n) and keeps the rest of the app in step with it: `<html lang>`, the
 * Accept-Language of every request, this device's storage, and the signed-in account.
 *
 * A signed-in user's account language wins when their session starts, except that a language picked on the
 * sign-in screen just before is saved to the account instead. Until the first language has loaded, a splash
 * screen shows; after that, a switch keeps the current language on screen until the new one is ready.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [requested, setRequested] = useState(deviceLanguage)
  const [shown, setShown] = useState(() => shownFromCache(requested))
  // A language picked while signed out, for the account that signs in next.
  const [choiceWhileSignedOut, setChoiceWhileSignedOut] = useState<LanguageCode | null>(null)

  const failToLoad = useEffectEvent((lang: LanguageCode) => {
    if (!shown) {
      // Nothing on screen yet: start in English, which ships with the app.
      setShown({ lang: DEFAULT_LANGUAGE, t: en })
      setRequested(DEFAULT_LANGUAGE)
      return
    }
    setRequested(shown.lang)
    toast.show(shown.t.common.language.loadFailed(LANGUAGES[lang].nativeName), 'error')
  })

  useEffect(() => {
    if (shown?.lang === requested) return
    let current = true
    loadMessages(requested).then(
      (t) => {
        if (current) setShown({ lang: requested, t })
      },
      () => {
        if (current) failToLoad(requested)
      },
    )
    return () => {
      current = false
    }
  }, [requested, shown?.lang])

  // Before any child effect runs, so requests fired for the new language carry it.
  useLayoutEffect(() => {
    if (!shown) return
    document.documentElement.lang = shown.lang
    setApiLanguage(shown.lang, shown.t.common.errors)
    storeLanguage(shown.lang)
  }, [shown])

  const adoptAccountLanguage = useEffectEvent((user: CurrentUser) => {
    setChoiceWhileSignedOut(null)
    if (choiceWhileSignedOut && choiceWhileSignedOut !== user.preferredLanguage) saveToAccount(choiceWhileSignedOut)
    else setRequested(user.preferredLanguage)
  })

  // Whenever a session starts (sign-in, or a session restored after a reload), its account's language applies.
  useEffect(() => {
    let signedInId = getSession()?.user.id
    return subscribeSession(() => {
      const user = getSession()?.user
      if (user?.id === signedInId) return
      signedInId = user?.id
      if (user) adoptAccountLanguage(user)
    })
  }, [])

  const setLanguage = useCallback((lang: LanguageCode) => {
    setRequested(lang)
    const user = getSession()?.user
    if (!user) setChoiceWhileSignedOut(lang)
    else if (user.preferredLanguage !== lang) saveToAccount(lang)
  }, [])

  const i18n = useMemo<I18n | undefined>(
    () =>
      shown && {
        lang: shown.lang,
        language: LANGUAGES[shown.lang],
        t: shown.t,
        setLanguage,
        pendingLang: requested === shown.lang ? null : requested,
      },
    [shown, requested, setLanguage],
  )

  if (!i18n) return <SplashScreen />
  return <I18nContext value={i18n}>{children}</I18nContext>
}
