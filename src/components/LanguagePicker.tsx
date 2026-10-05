import { useI18n } from '../i18n/i18n-context'
import { LANGUAGE_LIST } from '../i18n/languages'
import { Icon } from './Icon'
import { Menu, MenuItemRadio } from './menu/Menu'

/**
 * The language switch of every header and the sign-in page: the current language's short name, opening the
 * three languages, each written in its own script.
 */
export function LanguagePicker() {
  const { t, lang, language, setLanguage, pendingLang } = useI18n()
  const selected = pendingLang ?? lang

  return (
    <Menu
      label={t.common.language.label}
      buttonClassName="flex min-h-[44px] items-center gap-1 rounded-full bg-surface-container-high px-space-sm font-label-md text-label-md text-primary transition-colors active:bg-secondary-container"
      button={
        <>
          <Icon name="translate" className="text-[18px]" />
          <span className="sr-only">{t.common.language.label}: </span>
          <span lang={language.code}>{language.shortLabel}</span>
        </>
      }
      panelClassName="w-52"
    >
      {LANGUAGE_LIST.map((option) => (
        <MenuItemRadio
          key={option.code}
          lang={option.code}
          checked={option.code === selected}
          busy={option.code === pendingLang}
          onSelect={() => setLanguage(option.code)}
        >
          {option.nativeName}
        </MenuItemRadio>
      ))}
    </Menu>
  )
}
