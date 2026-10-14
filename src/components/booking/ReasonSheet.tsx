import { useId, useState, type FormEvent } from 'react'
import { useI18n } from '../../i18n/i18n-context'
import { describeError } from '../../lib/api'
import { BottomSheet } from '../BottomSheet'
import { FormError } from '../form/FormError'
import { SubmitButton } from '../form/SubmitButton'
import { INPUT_CLASSES } from '../form/field-styles'
import { BOOKING_REASON_MAX_LENGTH } from './booking-styles'

interface ReasonSheetProps {
  title: string
  message: string
  /** One tap fills the reason with one of these. */
  quickReasons: readonly string[]
  confirmLabel: string
  busyLabel: string
  /** Sends the move with the reason (null when left empty); rejects with an ApiError. */
  onConfirm: (reason: string | null) => Promise<void>
  onClose: () => void
}

/**
 * Confirms declining or cancelling a booking, with an optional reason the other side will read: a quick reason or
 * a few words of one's own.
 */
export function ReasonSheet({ title, message, quickReasons, confirmLabel, busyLabel, onConfirm, onClose }: ReasonSheetProps) {
  const { t } = useI18n()
  const reasonId = useId()
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    try {
      await onConfirm(reason.trim() || null)
    } catch (failure) {
      setError(describeError(failure, t.common.errors.unexpected))
      setBusy(false)
    }
  }

  return (
    <BottomSheet title={title} onClose={onClose}>
      <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-space-md pt-space-xs">
        <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>
        <div className="flex flex-wrap gap-space-xs">
          {quickReasons.map((quick) => (
            <button
              key={quick}
              type="button"
              aria-pressed={reason === quick}
              onClick={() => setReason(quick)}
              className={`min-h-[44px] rounded-full border px-space-md font-label-md text-label-md transition-colors ${
                reason === quick
                  ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                  : 'border-outline-variant bg-surface-container-lowest text-on-surface'
              }`}
            >
              {quick}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={reasonId} className="font-label-md text-label-md text-on-surface">
            {t.bookings.reason.label}
          </label>
          <textarea
            id={reasonId}
            rows={3}
            maxLength={BOOKING_REASON_MAX_LENGTH}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={`${INPUT_CLASSES} py-space-sm`}
          />
          <p className="text-right font-label-sm text-label-sm text-on-surface-variant">
            {reason.length}/{BOOKING_REASON_MAX_LENGTH}
          </p>
        </div>
        {error && <FormError message={error} />}
        <SubmitButton busy={busy} busyLabel={busyLabel}>
          {confirmLabel}
        </SubmitButton>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[48px] rounded-xl font-label-lg text-label-lg text-primary active:bg-surface-container"
        >
          {t.bookings.reason.keep}
        </button>
      </form>
    </BottomSheet>
  )
}
