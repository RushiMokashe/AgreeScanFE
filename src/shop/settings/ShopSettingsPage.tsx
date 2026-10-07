import { useRef, useState, type FormEvent } from 'react'
import { FormError } from '../../components/form/FormError'
import { SubmitButton } from '../../components/form/SubmitButton'
import { TextField } from '../../components/form/TextField'
import { ErrorState, LoadingState } from '../../components/PageState'
import { ScanAndPaySettings } from '../../components/payments/ScanAndPaySettings'
import { useToast } from '../../components/toast/toast-context'
import { useFieldErrors } from '../../hooks/useFieldErrors'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import { formatPhone } from '../../lib/phone'
import type { ShopProfile } from '../../lib/types'

/** The shop's settings (/shop/settings): its name and place as farmers see them, and Scan & Pay. */
export default function ShopSettingsPage() {
  const { t } = useI18n()
  const { data: shop, error, reload, setData } = useApi(() => api.shop.me())

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!shop) return <LoadingState label={t.shop.settings.loading} />

  const updateMe = async (upiId: string | null) => {
    setData(await api.shop.updateMe({ name: shop.name, place: shop.place, upiId }))
  }

  return (
    <div className="flex flex-col gap-space-md px-margin py-space-sm">
      <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
        <h2 className="font-title-md text-title-md font-bold text-on-surface">{t.shop.settings.details}</h2>
        <ShopDetailsForm shop={shop} onSaved={setData} />
      </section>
      <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
        <h2 className="font-title-md text-title-md font-bold text-on-surface">{t.payments.setup.title}</h2>
        <ScanAndPaySettings
          upiId={shop.upiId}
          upiQrUrl={shop.upiQrUrl}
          onSaveUpiId={updateMe}
          onUploadQr={async (image) => setData(await api.shop.uploadUpiQr(image))}
          onRemoveQr={async () => setData(await api.shop.removeUpiQr())}
        />
      </section>
    </div>
  )
}

function ShopDetailsForm({ shop, onSaved }: { shop: ShopProfile; onSaved: (shop: ShopProfile) => void }) {
  const { t } = useI18n()
  const toast = useToast()
  const texts = t.shop.settings
  const [name, setName] = useState(shop.name)
  const [place, setPlace] = useState(shop.place)
  const [saving, setSaving] = useState(false)
  const [failure, setFailure] = useState<string>()
  const formRef = useRef<HTMLFormElement>(null)
  const fields = useFieldErrors({
    name: name.trim() ? undefined : texts.nameRequired,
    place: place.trim() ? undefined : texts.placeRequired,
  })

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!fields.submit()) {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setSaving(true)
    setFailure(undefined)
    try {
      onSaved(await api.shop.updateMe({ name: name.trim(), place: place.trim(), upiId: shop.upiId }))
      toast.show(texts.saved)
    } catch (error) {
      setFailure(describeError(error, texts.failed))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form ref={formRef} noValidate onSubmit={(event) => void save(event)} className="flex flex-col gap-space-md">
      <TextField
        label={texts.name}
        error={fields.errorOf('name')}
        maxLength={80}
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={() => fields.touch('name')}
      />
      <TextField
        label={texts.place}
        error={fields.errorOf('place')}
        placeholder={texts.placePlaceholder}
        maxLength={80}
        value={place}
        onChange={(event) => setPlace(event.target.value)}
        onBlur={() => fields.touch('place')}
      />
      <TextField label={texts.phone} hint={texts.phoneHint} value={formatPhone(shop.phone)} readOnly />
      {failure && <FormError message={failure} />}
      <SubmitButton busy={saving} busyLabel={texts.saving} icon="save">
        {texts.save}
      </SubmitButton>
    </form>
  )
}
