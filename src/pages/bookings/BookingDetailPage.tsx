import { Link, useParams } from 'react-router'
import { BookingTimeline } from '../../components/booking/BookingTimeline'
import { Icon } from '../../components/Icon'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api } from '../../lib/api'
import { useNotificationRefresh } from '../../notifications/useNotificationRefresh'
import { BookingActions } from './BookingActions'
import { BookingFacts } from './BookingFacts'
import { BookingStatusHeader } from './BookingStatusHeader'
import { BookingVehicleCard } from './BookingVehicleCard'

/**
 * Booking tracking (/bookings/:id, D9): whether the owner confirmed, the job's progress, payment and the timeline.
 * It reloads when a notification about this booking arrives, e.g. the moment the owner accepts.
 */
export default function BookingDetailPage() {
  const { t } = useI18n()
  const id = Number(useParams().id)
  const { data: booking, error, reload, setData } = useApi(() => api.booking(id), [id])
  useNotificationRefresh((route) => route === `/bookings/${id}`, reload)

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!booking) return <LoadingState label={t.bookings.detail.loading} />

  return (
    <div className="flex flex-col gap-space-sm px-margin py-space-sm">
      <BookingStatusHeader booking={booking} />
      <BookingVehicleCard booking={booking} />
      <BookingFacts booking={booking} />
      <BookingActions booking={booking} onChange={setData} />
      <BookingTimeline timeline={booking.timeline} viewer="FARMER" />
      <Link
        to="/bookings"
        className="self-center flex min-h-[44px] items-center gap-1 px-space-sm font-label-md text-label-md text-primary"
      >
        <Icon name="list" className="text-[18px]" />
        {t.bookings.detail.allBookings}
      </Link>
    </div>
  )
}
