import { Link, useParams } from 'react-router'
import { BOOKING_STATUS_STYLES } from '../../components/booking/booking-styles'
import { BookingTimeline } from '../../components/booking/BookingTimeline'
import { PaymentStatusChip } from '../../components/booking/PaymentStatusChip'
import { Icon } from '../../components/Icon'
import { ErrorState, LoadingState } from '../../components/PageState'
import { PaymentsToConfirm } from '../../components/payments/PaymentsToConfirm'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { api } from '../../lib/api'
import { COUNTRY_CODE, formatPhone } from '../../lib/phone'
import { useNotificationRefresh } from '../../notifications/useNotificationRefresh'
import { OwnerBookingActions } from './OwnerBookingActions'

/**
 * A booking request as its owner handles it (/owner/bookings/:id): the farmer to call, the job, the moves allowed
 * now, and the timeline the farmer sees too. It reloads when a notification about it arrives, e.g. a cancel.
 */
export default function OwnerBookingDetailPage() {
  const { t } = useI18n()
  const format = useFormat()
  const id = Number(useParams().id)
  const { data: booking, error, reload, setData } = useApi(() => api.owner.booking(id), [id])
  useNotificationRefresh((route) => route === `/owner/bookings/${id}`, reload)

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!booking) return <LoadingState label={t.owner.bookings.detailLoading} />

  const { icon, tone } = BOOKING_STATUS_STYLES[booking.status]

  return (
    <div className="flex flex-col gap-space-sm px-margin py-space-sm">
      <section className="flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
        <span className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${tone}`}>
          <Icon name={icon} fill className="text-[26px]" />
        </span>
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {t.owner.bookings.headline[booking.status](booking.farmerName)}
        </h1>
      </section>

      <section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="flex items-center gap-space-sm">
          <span className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
            <Icon name="person" className="text-[24px]" />
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-title-md text-title-md font-bold text-on-surface">{booking.farmerName}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{booking.farmerLocation}</span>
          </div>
        </div>
        <a
          href={`tel:${COUNTRY_CODE}${booking.farmerPhone}`}
          className="min-h-[48px] rounded-lg bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1.5 active:bg-secondary-container"
        >
          <Icon name="call" className="text-[18px]" />
          <span>{t.owner.bookings.callFarmer(booking.farmerName)}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">{formatPhone(booking.farmerPhone)}</span>
        </a>
      </section>

      <dl className="grid grid-cols-2 gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="col-span-2 flex flex-col">
          <dt className="font-label-sm text-label-sm text-on-surface-variant">{t.owner.bookings.vehicle}</dt>
          <dd className="font-body-md text-body-md text-on-surface">{booking.listingName}</dd>
        </div>
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

      {booking.paymentStatus === 'VERIFYING' && (
        <PaymentsToConfirm purpose="RENTAL_BOOKING" referenceId={booking.id} onDecided={reload} />
      )}
      <OwnerBookingActions booking={booking} onChange={setData} />
      <BookingTimeline timeline={booking.timeline} viewer="OWNER" />
      <Link
        to="/owner/bookings"
        className="self-center flex min-h-[44px] items-center gap-1 px-space-sm font-label-md text-label-md text-primary"
      >
        <Icon name="list" className="text-[18px]" />
        {t.owner.bookings.allRequests}
      </Link>
    </div>
  )
}
