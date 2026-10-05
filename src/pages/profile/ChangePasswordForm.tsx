import { useId, useRef, useState, type FormEvent } from 'react'
import { PASSWORD_MAX_LENGTH, checkPassword, isValidPassword } from '../../auth/password-policy'
import { PasswordRules } from '../../auth/PasswordRules'
import { FormError } from '../../components/form/FormError'
import { PasswordField } from '../../components/form/PasswordField'
import { SubmitButton } from '../../components/form/SubmitButton'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import { ProfileSection } from './ProfileSection'

interface PasswordErrors {
  currentPassword?: string
  newPassword?: string
  form?: string
}

/** The current password and a new one; the policy shows as a checklist that ticks off while typing. */
export function ChangePasswordForm() {
  const { t } = useI18n()
  const toast = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [errors, setErrors] = useState<PasswordErrors>({})
  const [saving, setSaving] = useState(false)
  const currentRef = useRef<HTMLInputElement>(null)
  const newRef = useRef<HTMLInputElement>(null)
  const rulesId = useId()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const invalid: PasswordErrors = {
      currentPassword: currentPassword ? undefined : t.profile.password.currentRequired,
      newPassword: isValidPassword(newPassword) ? undefined : t.profile.password.newInvalid,
    }
    setErrors(invalid)
    const firstInvalid = invalid.currentPassword ? currentRef : invalid.newPassword ? newRef : undefined
    if (firstInvalid) {
      firstInvalid.current?.focus()
      return
    }

    setSaving(true)
    try {
      await api.auth.changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      toast.show(t.profile.password.changed)
    } catch (error) {
      setErrors({ form: describeError(error, t.common.errors.unexpected) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProfileSection title={t.profile.password.title}>
      <form noValidate onSubmit={submit} className="flex flex-col gap-space-md">
        <PasswordField
          ref={currentRef}
          label={t.profile.password.current}
          name="current-password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          error={errors.currentPassword}
        />
        <PasswordField
          ref={newRef}
          label={t.profile.password.new}
          name="new-password"
          autoComplete="new-password"
          maxLength={PASSWORD_MAX_LENGTH}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          error={errors.newPassword}
          describedBy={rulesId}
        />
        <PasswordRules id={rulesId} check={checkPassword(newPassword)} />
        {errors.form && <FormError message={errors.form} />}
        <SubmitButton busy={saving} busyLabel={t.profile.password.submitting} icon="lock_reset">
          {t.profile.password.submit}
        </SubmitButton>
      </form>
    </ProfileSection>
  )
}
