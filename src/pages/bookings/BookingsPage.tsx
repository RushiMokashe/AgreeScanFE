import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api } from '../../lib/api'
import { BookingCard } from './BookingCard'

/** The farmer's rental bookings, newest first (/bookings). */
export default function BookingsPage() {
  const { t } = useI18n()
  const { data: bookings, error, reload } = useApi(() => api.myBookings())

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!bookings) return <LoadingState label={t.bookings.loading} />

  if (bookings.length === 0) {
    return (
      <section className="mx-margin my-space-lg flex flex-col items-center gap-space-sm rounded-2xl bg-surface-container-lowest px-space-md py-space-xl text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <Icon name="event_note" className="text-[32px]" />
        </div>
        <h1 className="font-title-md text-title-md font-bold text-on-surface">{t.bookings.empty.title}</h1>
        <p className="max-w-sm font-body-sm text-body-sm text-on-surface-variant">{t.bookings.empty.message}</p>
        <Link
          to="/rentals"
          className="mt-space-xs flex min-h-[48px] items-center gap-space-xs rounded-xl bg-primary px-space-lg font-label-lg text-label-lg text-on-primary"
        >
          <Icon name="agriculture" className="text-[20px]" />
          {t.bookings.empty.browse}
        </Link>
      </section>
    )
  }

  return (
    <ul className="flex flex-col gap-space-sm px-margin py-space-sm">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </ul>
  )
}
