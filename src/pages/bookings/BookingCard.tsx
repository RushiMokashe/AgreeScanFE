import { Link } from 'react-router'
import { BookingStatusChip } from '../../components/booking/BookingStatusChip'
import { PaymentStatusChip } from '../../components/booking/PaymentStatusChip'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { RentalBooking } from '../../lib/types'

/** One booking in the farmer's list; opens its tracking screen. */
export function BookingCard({ booking }: { booking: RentalBooking }) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <li>
      <Link
        to={`/bookings/${booking.id}`}
        className="flex flex-col gap-space-xs rounded-xl bg-surface-container-lowest p-space-md shadow-sm active:bg-surface-container"
      >
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col min-w-0">
            <span className="font-title-md text-title-md font-bold text-on-surface">{booking.listingName}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{booking.operatorName}</span>
          </div>
          <Icon name="chevron_right" className="text-[24px] text-on-surface-variant flex-shrink-0" />
        </div>
        <div className="flex flex-wrap items-center gap-space-xs">
          <BookingStatusChip status={booking.status} />
          <PaymentStatusChip status={booking.paymentStatus} />
        </div>
        <div className="flex items-end justify-between gap-space-sm pt-1">
          <div className="flex flex-col min-w-0 font-body-sm text-body-sm text-on-surface-variant">
            <span className="truncate">{booking.slotLabel}</span>
            <span>
              {t.bookings.units[booking.rateUnit](booking.estimatedUnits)} •{' '}
              {t.bookings.booked(format.timeAgo(booking.createdAt))}
            </span>
          </div>
          <span className="font-headline-sm text-headline-sm font-bold text-primary flex-shrink-0">
            {format.inr(booking.amount)}
          </span>
        </div>
      </Link>
    </li>
  )
}
