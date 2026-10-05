import { useState, type Ref } from 'react'
import { useI18n } from '../../i18n/i18n-context'
import { Icon } from '../Icon'
import { Field } from './Field'
import { INPUT_CLASSES } from './field-styles'
import type { InputProps } from './TextField'

interface PasswordFieldProps extends Omit<InputProps, 'type'> {
  label: string
  hint?: string
  error?: string
  /** Id of more text describing the input, e.g. the password rules. */
  describedBy?: string
  ref?: Ref<HTMLInputElement>
}

/** A password input with a show/hide toggle, so people typing on small keyboards can check what they typed. */
export function PasswordField({ label, hint, error, describedBy, ref, ...input }: PasswordFieldProps) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  return (
    <Field label={label} hint={hint} error={error} describedBy={describedBy}>
      {(control) => (
        <div className="relative">
          <input
            ref={ref}
            {...input}
            {...control}
            type={visible ? 'text' : 'password'}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className={`${INPUT_CLASSES} pr-14`}
          />
          <button
            type="button"
            aria-label={t.auth.showPassword}
            aria-pressed={visible}
            aria-controls={control.id}
            onClick={() => setVisible((shown) => !shown)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Icon name={visible ? 'visibility_off' : 'visibility'} className="text-[22px]" />
          </button>
        </div>
      )}
    </Field>
  )
}
