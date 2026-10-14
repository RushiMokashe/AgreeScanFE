import { BOOKING_STATUS_STYLES } from '../../components/booking/booking-styles'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { RentalBookingDetail } from '../../lib/types'

/** Where the booking stands, in one line the farmer can read at a glance, with the server's explanation. */
export function BookingStatusHeader({ booking }: { booking: RentalBookingDetail }) {
  const { t } = useI18n()
  const { icon, tone } = BOOKING_STATUS_STYLES[booking.status]

  return (
    <section className="flex items-start gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <span className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${tone}`}>
        <Icon name={icon} fill className="text-[26px]" />
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {t.bookings.detail.headline[booking.status](booking.operatorName)}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{booking.message}</p>
      </div>
    </section>
  )
}
