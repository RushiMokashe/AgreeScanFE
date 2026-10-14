import { Link } from 'react-router'
import { BookingStatusChip } from '../../components/booking/BookingStatusChip'
import { PaymentStatusChip } from '../../components/booking/PaymentStatusChip'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { COUNTRY_CODE } from '../../lib/phone'
import type { OwnerBooking } from '../../lib/types'

interface OwnerBookingCardProps {
  booking: OwnerBooking
  /** With these, a requested booking can be answered right from the card. */
  onAccept?: () => void
  onDecline?: () => void
  /** A move is in flight: the answer buttons wait. */
  busy?: boolean
  /** This booking's move is in flight. */
  pending?: boolean
}

/** One booking as its owner sees it: who asked, for what and when, with a call button and quick answers. */
export function OwnerBookingCard({ booking, onAccept, onDecline, busy = false, pending = false }: OwnerBookingCardProps) {
  const { t } = useI18n()
  const format = useFormat()
  const answerable = booking.status === 'REQUESTED' && onAccept && onDecline

  return (
    <li className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <Link to={`/owner/bookings/${booking.id}`} className="flex flex-col gap-space-xs">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col min-w-0">
            <span className="font-title-md text-title-md font-bold text-on-surface">{booking.farmerName}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {booking.farmerLocation} • {format.timeAgo(booking.createdAt)}
            </span>
          </div>
          <span className="font-headline-sm text-headline-sm font-bold text-primary flex-shrink-0">
            {format.inr(booking.amount)}
          </span>
        </div>
        <span className="font-label-lg text-label-lg text-on-surface">{booking.listingName}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {booking.slotLabel} • {t.bookings.units[booking.rateUnit](booking.estimatedUnits)}
        </span>
        <div className="flex flex-wrap items-center gap-space-xs">
          <BookingStatusChip status={booking.status} />
          <PaymentStatusChip status={booking.paymentStatus} />
        </div>
      </Link>
      <div className={`grid gap-space-sm ${answerable ? 'grid-cols-3' : 'grid-cols-1'}`}>
        <a
          href={`tel:${COUNTRY_CODE}${booking.farmerPhone}`}
          aria-label={t.owner.bookings.callFarmer(booking.farmerName)}
          className="min-h-[48px] rounded-lg bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1 active:bg-secondary-container"
        >
          <Icon name="call" className="text-[18px]" />
          {!answerable && <span>{t.owner.bookings.callFarmer(booking.farmerName)}</span>}
        </a>
        {answerable && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={onDecline}
              className="min-h-[48px] rounded-lg border border-error/40 text-error font-label-md text-label-md active:bg-error-container disabled:opacity-50"
            >
              {t.owner.bookings.decline}
            </button>
            <button
              type="button"
              disabled={busy}
              aria-busy={pending}
              onClick={onAccept}
              className="min-h-[48px] rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1 shadow-sm active:bg-primary-container disabled:opacity-60"
            >
              {pending && <Icon name="progress_activity" className="text-[18px] animate-spin" />}
              {t.owner.bookings.accept}
            </button>
          </>
        )}
      </div>
    </li>
  )
}
