import { Icon } from '../components/Icon'
import { useI18n } from '../i18n/i18n-context'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, type PasswordCheck } from './password-policy'

interface PasswordRulesProps {
  /** Lets the password input point at this list with aria-describedby. */
  id: string
  check: PasswordCheck
}

/** The password policy as a checklist that ticks off while the user types a new password. */
export function PasswordRules({ id, check }: PasswordRulesProps) {
  const { t } = useI18n()
  const rules = [
    { met: check.length, text: t.auth.passwordRules.length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH) },
    { met: check.letter, text: t.auth.passwordRules.letter },
    { met: check.digit, text: t.auth.passwordRules.digit },
  ]

  return (
    <div id={id} className="flex flex-col gap-1">
      <p className="font-label-md text-label-md text-on-surface-variant">{t.auth.passwordRules.title}</p>
      <ul className="flex flex-col gap-1">
        {rules.map(({ met, text }) => (
          <li
            key={text}
            className={`flex items-center gap-space-xs font-body-sm text-body-sm ${met ? 'text-secondary' : 'text-on-surface-variant'}`}
          >
            <Icon name={met ? 'check_circle' : 'radio_button_unchecked'} fill={met} className="text-[18px]" />
            <span>{text}</span>
            <span className="sr-only">: {met ? t.auth.passwordRules.met : t.auth.passwordRules.unmet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
