import { useId } from 'react'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { LANGUAGE_LIST } from '../../i18n/languages'
import { ProfileSection } from './ProfileSection'

/** The app language as three large choices, each in its own script; a choice applies right away. */
export function LanguageSection() {
  const { t, lang, pendingLang, setLanguage } = useI18n()
  const groupName = useId()
  const selected = pendingLang ?? lang

  return (
    <ProfileSection title={t.profile.language.title} hint={t.profile.language.hint}>
      <div role="radiogroup" aria-label={t.profile.language.title} className="grid grid-cols-3 gap-space-sm">
        {LANGUAGE_LIST.map((language) => {
          const checked = language.code === selected
          return (
            <label
              key={language.code}
              className={`flex min-h-[56px] cursor-pointer items-center justify-center gap-1 rounded-xl border-2 px-space-xs font-label-lg text-label-lg transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40 ${
                checked ? 'border-primary bg-secondary-container/40 text-primary' : 'border-outline-variant text-on-surface'
              }`}
            >
              <input
                type="radio"
                name={groupName}
                value={language.code}
                checked={checked}
                onChange={() => setLanguage(language.code)}
                className="sr-only"
              />
              <span lang={language.code}>{language.nativeName}</span>
              {language.code === pendingLang ? (
                <Icon name="progress_activity" className="animate-spin text-[18px]" />
              ) : (
                checked && <Icon name="check_circle" fill className="text-[18px]" />
              )}
            </label>
          )
        })}
      </div>
    </ProfileSection>
  )
}
