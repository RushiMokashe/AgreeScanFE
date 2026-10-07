import { useState } from 'react'
import { ReasonSheet } from '../../components/booking/ReasonSheet'
import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { api } from '../../lib/api'
import type { RentalBookingDetail } from '../../lib/types'
import { usePayNow } from '../payments/usePayNow'

interface BookingActionsProps {
  booking: RentalBookingDetail
  onChange: (booking: RentalBookingDetail) => void
}

/** What the farmer can do now: pay online once the owner accepted, or cancel while it is requested or accepted. */
export function BookingActions({ booking, onChange }: BookingActionsProps) {
  const { t } = useI18n()
  const format = useFormat()
  const toast = useToast()
  const { paying, payNow } = usePayNow()
  const [cancelling, setCancelling] = useState(false)

  if (!booking.canPay && !booking.canCancel) return null

  const cancel = async (reason: string | null) => {
    onChange(await api.cancelBooking(booking.id, reason))
    setCancelling(false)
    toast.show(t.bookings.detail.cancelled, 'info')
  }

  const quickReasons = t.bookings.detail.quickReasons

  return (
    <section className="flex flex-col gap-space-sm">
      {booking.canPay && (
        <>
          <button
            type="button"
            disabled={paying !== null}
            aria-busy={paying !== null}
            onClick={() => void payNow({ purpose: 'RENTAL_BOOKING', referenceId: booking.id })}
            className="flex min-h-[52px] w-full items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg font-label-lg text-label-lg text-on-primary shadow-md active:scale-[0.99] disabled:opacity-60"
          >
            <Icon name={paying ? 'progress_activity' : 'payments'} className={`text-[20px] ${paying ? 'animate-spin' : ''}`} />
            {paying ? t.bookings.detail.paying : t.bookings.detail.pay(format.inr(booking.amount))}
          </button>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">{t.bookings.detail.payLater}</p>
        </>
      )}
      {booking.canCancel && (
        <button
          type="button"
          onClick={() => setCancelling(true)}
          className="flex min-h-[48px] w-full items-center justify-center gap-space-xs rounded-xl border border-error/40 font-label-lg text-label-lg text-error active:bg-error-container"
        >
          <Icon name="event_busy" className="text-[20px]" />
          {t.bookings.detail.cancel}
        </button>
      )}
      {cancelling && (
        <ReasonSheet
          title={t.bookings.detail.cancelTitle}
          message={t.bookings.detail.cancelMessage}
          quickReasons={[quickReasons.plansChanged, quickReasons.otherVehicle, quickReasons.weather]}
          confirmLabel={t.bookings.detail.cancelConfirm}
          busyLabel={t.bookings.detail.cancelling}
          onConfirm={cancel}
          onClose={() => setCancelling(false)}
        />
      )}
    </section>
  )
}
