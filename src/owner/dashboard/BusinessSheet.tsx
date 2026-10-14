import { useRef, useState, type FormEvent } from 'react'
import { BottomSheet } from '../../components/BottomSheet'
import { Field } from '../../components/form/Field'
import { FormError } from '../../components/form/FormError'
import { SubmitButton } from '../../components/form/SubmitButton'
import { TextField } from '../../components/form/TextField'
import { INPUT_CLASSES } from '../../components/form/field-styles'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { VehicleOwnerProfile } from '../../lib/types'

interface BusinessSheetProps {
  profile: VehicleOwnerProfile
  onSaved: (profile: VehicleOwnerProfile) => void
  onClose: () => void
}

/** The name farmers see, the business name and the hub the owner serves. */
export function BusinessSheet({ profile, onSaved, onClose }: BusinessSheetProps) {
  const { t } = useI18n()
  const { data: hubs } = useApi(() => api.rentalHubs())
  const [name, setName] = useState(profile.name)
  const [businessName, setBusinessName] = useState(profile.businessName ?? '')
  const [hubId, setHubId] = useState(profile.hubId)
  const [nameError, setNameError] = useState<string>()
  const [formError, setFormError] = useState<string>()
  const [saving, setSaving] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setNameError(t.owner.business.nameRequired)
      nameRef.current?.focus()
      return
    }
    setNameError(undefined)
    setSaving(true)
    try {
      onSaved(
        await api.owner.updateMe({
          name: name.trim(),
          businessName: businessName.trim() || null,
          hubId,
          upiId: profile.upiId, // set apart, in the Scan & Pay card
        }),
      )
    } catch (error) {
      setFormError(describeError(error, t.common.errors.unexpected))
      setSaving(false)
    }
  }

  return (
    <BottomSheet title={t.owner.business.editTitle} onClose={onClose}>
      <form noValidate onSubmit={(event) => void save(event)} className="flex flex-col gap-space-md pt-space-xs">
        <TextField
          ref={nameRef}
          label={t.owner.business.name}
          hint={t.owner.business.nameHint}
          error={nameError}
          value={name}
          maxLength={80}
          autoComplete="name"
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          label={t.owner.business.businessName}
          hint={t.owner.business.businessNameHint}
          value={businessName}
          maxLength={80}
          autoComplete="organization"
          onChange={(event) => setBusinessName(event.target.value)}
        />
        <Field label={t.owner.business.hub}>
          {(control) => (
            <select
              {...control}
              value={hubId}
              disabled={!hubs}
              onChange={(event) => setHubId(Number(event.target.value))}
              className={INPUT_CLASSES}
            >
              {(hubs ?? [{ id: profile.hubId, name: profile.hubName }]).map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name}
                </option>
              ))}
            </select>
          )}
        </Field>
        {formError && <FormError message={formError} />}
        <SubmitButton busy={saving} busyLabel={t.owner.business.saving} icon="save">
          {t.owner.business.save}
        </SubmitButton>
      </form>
    </BottomSheet>
  )
}
