import { useRef, useState, type FormEvent } from 'react'
import { useFieldErrors } from '../../hooks/useFieldErrors'
import { useI18n } from '../../i18n/i18n-context'
import { describeError } from '../../lib/api'
import { checkUpiId } from '../../lib/payment-checks'
import { FormError } from '../form/FormError'
import { PhotoPicker } from '../form/PhotoPicker'
import { SubmitButton } from '../form/SubmitButton'
import { TextField } from '../form/TextField'
import { Icon } from '../Icon'
import { useToast } from '../toast/toast-context'

interface ScanAndPaySettingsProps {
  upiId: string | null
  upiQrUrl: string | null
  /** Saves the UPI ID, null removing it; rejects with an ApiError. */
  onSaveUpiId: (upiId: string | null) => Promise<void>
  onUploadQr: (image: File) => Promise<void>
  onRemoveQr: () => Promise<void>
  /** Called once everything is saved, e.g. to close a sheet. */
  onSaved?: () => void
}

/**
 * Setting up Scan & Pay, for shops and vehicle owners alike: the UPI ID farmers' UPI apps pay (they fill in the
 * amount), and optionally the QR the seller already has from PhonePe, Google Pay or their bank, shown uncropped so it
 * stays scannable. One of the two turns Scan & Pay on.
 */
export function ScanAndPaySettings(props: ScanAndPaySettingsProps) {
  const { upiId: savedUpiId, upiQrUrl, onSaveUpiId, onUploadQr, onRemoveQr, onSaved } = props
  const { t } = useI18n()
  const toast = useToast()
  const texts = t.payments.setup
  const [upiId, setUpiId] = useState(savedUpiId ?? '')
  const [qr, setQr] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [failure, setFailure] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)
  // A blank UPI ID is allowed: it turns Scan & Pay by UPI ID off.
  const fields = useFieldErrors({ upiId: upiId && checkUpiId(upiId) ? texts.upiIdInvalid : undefined })

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!fields.submit()) {
      inputRef.current?.focus()
      return
    }
    setBusy(true)
    setFailure(undefined)
    try {
      const trimmed = upiId.trim()
      if (trimmed !== (savedUpiId ?? '')) await onSaveUpiId(trimmed || null)
      if (qr) await onUploadQr(qr)
      setQr(null)
      toast.show(texts.saved)
      onSaved?.()
    } catch (error) {
      setFailure(describeError(error, texts.failed))
    } finally {
      setBusy(false)
    }
  }

  const removeQr = async () => {
    setRemoving(true)
    setFailure(undefined)
    try {
      await onRemoveQr()
    } catch (error) {
      setFailure(describeError(error, texts.failed))
    } finally {
      setRemoving(false)
    }
  }

  return (
    <form noValidate onSubmit={(event) => void save(event)} className="flex flex-col gap-space-md">
      <p className="font-body-sm text-body-sm text-on-surface-variant">{texts.intro}</p>
      <TextField
        ref={inputRef}
        label={texts.upiId}
        hint={texts.upiIdHint}
        error={fields.errorOf('upiId')}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="name@okbank"
        value={upiId}
        onChange={(event) => setUpiId(event.target.value.trim())}
        onBlur={() => fields.touch('upiId')}
      />
      <div className="flex flex-col gap-space-xs">
        <PhotoPicker label={texts.qr} previewAlt={texts.qrAlt} currentUrl={upiQrUrl} onChange={setQr} contain />
        <p className="font-body-sm text-body-sm text-on-surface-variant">{texts.qrHint}</p>
        {upiQrUrl && !qr && (
          <button
            type="button"
            disabled={removing || busy}
            onClick={() => void removeQr()}
            className="self-start flex min-h-[44px] items-center gap-1 px-space-xs font-label-md text-label-md text-error disabled:opacity-60"
          >
            <Icon name={removing ? 'progress_activity' : 'delete'} className={`text-[18px] ${removing ? 'animate-spin' : ''}`} />
            {texts.removeQr}
          </button>
        )}
      </div>
      {failure && <FormError message={failure} />}
      <SubmitButton busy={busy} busyLabel={texts.saving} icon="save" disabled={removing}>
        {texts.save}
      </SubmitButton>
    </form>
  )
}
