import { useRef, useState, type FormEvent } from 'react'
import { FormError } from '../../components/form/FormError'
import { SubmitButton } from '../../components/form/SubmitButton'
import { TextField } from '../../components/form/TextField'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import { formatPhone } from '../../lib/phone'
import type { CurrentUser } from '../../lib/types'
import { ProfileSection } from './ProfileSection'

/** Deliberately loose (something@something.something): the server has the final word. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface DetailsErrors {
  name?: string
  email?: string
  form?: string
}

/** Name and email. The mobile number is the sign-in ID, which only an administrator changes. */
export function AccountDetailsForm({ user }: { user: CurrentUser }) {
  const { t } = useI18n()
  const toast = useToast()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email ?? '')
  const [errors, setErrors] = useState<DetailsErrors>({})
  const [saving, setSaving] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const trimmedName = name.trim()
  const trimmedEmail = email.trim()
  const changed = trimmedName !== user.name || trimmedEmail !== (user.email ?? '')

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const invalid: DetailsErrors = {
      name: trimmedName ? undefined : t.profile.details.nameRequired,
      email: !trimmedEmail || EMAIL.test(trimmedEmail) ? undefined : t.profile.details.emailInvalid,
    }
    setErrors(invalid)
    const firstInvalid = invalid.name ? nameRef : invalid.email ? emailRef : undefined
    if (firstInvalid) {
      firstInvalid.current?.focus()
      return
    }

    setSaving(true)
    try {
      await api.auth.updateMe({ name: trimmedName, email: trimmedEmail || null })
      toast.show(t.profile.details.saved)
    } catch (error) {
      setErrors({ form: describeError(error, t.common.errors.unexpected) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProfileSection title={t.profile.details.title}>
      <form noValidate onSubmit={save} className="flex flex-col gap-space-md">
        <TextField
          ref={nameRef}
          label={t.profile.details.name}
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
        />
        <TextField
          ref={emailRef}
          label={t.profile.details.email}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <div className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-on-surface">{t.profile.details.phone}</span>
          <span className="font-body-md text-body-md text-on-surface">{formatPhone(user.phone)}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">{t.profile.details.phoneHint}</span>
        </div>
        {errors.form && <FormError message={errors.form} />}
        <SubmitButton busy={saving} busyLabel={t.profile.details.saving} icon="save" disabled={!changed}>
          {t.profile.details.save}
        </SubmitButton>
      </form>
    </ProfileSection>
  )
}
