import { PaymentStatusChip } from '../../components/booking/PaymentStatusChip'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { RentalBookingDetail } from '../../lib/types'

/** When the job is, how big it is estimated to be, what it costs, and whether it is paid. */
export function BookingFacts({ booking }: { booking: RentalBookingDetail }) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <dl className="grid grid-cols-2 gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="col-span-2 flex flex-col">
        <dt className="font-label-sm text-label-sm text-on-surface-variant">{t.bookings.detail.slot}</dt>
        <dd className="font-body-md text-body-md text-on-surface">{booking.slotLabel}</dd>
      </div>
      <div className="flex flex-col">
        <dt className="font-label-sm text-label-sm text-on-surface-variant">{t.bookings.detail.estimate}</dt>
        <dd className="font-body-md text-body-md text-on-surface">
          {t.bookings.units[booking.rateUnit](booking.estimatedUnits)}
        </dd>
      </div>
      <div className="flex flex-col">
        <dt className="font-label-sm text-label-sm text-on-surface-variant">{t.bookings.detail.amount}</dt>
        <dd className="font-title-md text-title-md font-bold text-primary">{format.inr(booking.amount)}</dd>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-space-sm">
        <dt className="font-label-sm text-label-sm text-on-surface-variant">{t.bookings.detail.payment}</dt>
        <dd>
          <PaymentStatusChip status={booking.paymentStatus} />
        </dd>
      </div>
    </dl>
  )
}
