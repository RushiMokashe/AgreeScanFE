import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { BottomSheet } from '../../components/BottomSheet'
import { FormError } from '../../components/form/FormError'
import { SubmitButton } from '../../components/form/SubmitButton'
import { TextField } from '../../components/form/TextField'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import { AmountPreview } from './AmountPreview'
import { EstimateStepper } from './EstimateStepper'
import { DEFAULT_UNITS, MAX_SLOT_LENGTH, bookingAmount, parseUnits, type BookingTarget } from './rentals-utils'

interface BookingSheetProps {
  target: BookingTarget
  onClose: () => void
}

/**
 * Asks the owner for a booking (D9): when, and roughly how many hours, km or days, with the amount the estimate comes
 * to. The request opens the booking's tracking screen, where the owner's answer arrives.
 */
export function BookingSheet({ target, onClose }: BookingSheetProps) {
  const { t } = useI18n()
  const toast = useToast()
  const navigate = useNavigate()
  const [slot, setSlot] = useState(target.slot)
  const [unitsText, setUnitsText] = useState(String(DEFAULT_UNITS[target.rateUnit]))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const units = parseUnits(unitsText)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (units === null) return
    setBusy(true)
    setError(undefined)
    try {
      const booking = await api.bookRental(target.listingId, { slotLabel: slot.trim() || undefined, estimatedUnits: units })
      toast.show(booking.message)
      navigate(`/bookings/${booking.id}`)
    } catch (reason) {
      setError(describeError(reason, t.rentals.booking.failed))
      setBusy(false)
    }
  }

  return (
    <BottomSheet title={t.rentals.booking.title} subtitle={target.name} onClose={onClose}>
      <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-space-md pt-space-xs">
        <TextField
          label={t.rentals.booking.slot}
          hint={t.rentals.booking.slotHint}
          value={slot}
          maxLength={MAX_SLOT_LENGTH}
          onChange={(event) => setSlot(event.target.value)}
        />
        <EstimateStepper rateUnit={target.rateUnit} value={unitsText} onChange={setUnitsText} />
        {units !== null && <AmountPreview target={target} units={units} amount={bookingAmount(target, units)} />}
        <p className="font-body-sm text-body-sm text-on-surface-variant">{t.rentals.booking.payLater}</p>
        {error && <FormError message={error} />}
        <SubmitButton busy={busy} busyLabel={t.rentals.booking.submitting} icon="send" disabled={units === null}>
          {t.rentals.booking.submit}
        </SubmitButton>
      </form>
    </BottomSheet>
  )
}
