import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Icon } from '../../components/Icon'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api } from '../../lib/api'
import type { BookingStatus, OwnerBooking, OwnerBookingDetail } from '../../lib/types'
import { isOwnerBookingRoute, useNotificationRefresh } from '../../notifications/useNotificationRefresh'
import { BOOKING_FILTERS, STATUS_PARAM, parseStatusFilter, withBooking } from '../owner-utils'
import { DeclineSheet } from './DeclineSheet'
import { OwnerBookingCard } from './OwnerBookingCard'
import { useOwnerBookingMoves } from './useOwnerBookingMoves'

/** Booking requests (/owner/bookings), filtered by status, newest first; requests are answered right here. */
export default function OwnerBookingsPage() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const status = parseStatusFilter(searchParams.get(STATUS_PARAM))
  const { data: bookings, error, reload, setData } = useApi(() => api.owner.bookings(status ?? undefined), [status])
  const moves = useOwnerBookingMoves()
  const [declining, setDeclining] = useState<OwnerBooking | null>(null)
  // A new request or a cancel arrives as a notification: show it at once.
  useNotificationRefresh(isOwnerBookingRoute, reload)

  if (error) return <ErrorState error={error} onRetry={reload} />

  const choose = (filter: BookingStatus | null) =>
    setSearchParams(filter ? { [STATUS_PARAM]: filter } : {}, { replace: true, preventScrollReset: true })

  /** The list with the answered booking updated, or left out when it no longer matches the filter. */
  const update = (updated: OwnerBookingDetail) =>
    setData((list) =>
      status && updated.status !== status ? list.filter((booking) => booking.id !== updated.id) : withBooking(list, updated),
    )

  const accept = async (booking: OwnerBooking) => {
    const updated = await moves.run(booking, 'accept')
    if (updated) update(updated)
  }

  const decline = async (booking: OwnerBooking, reason: string | null) => {
    update(await moves.decline(booking, reason))
    setDeclining(null)
  }

  return (
    <div className="flex flex-col gap-space-sm py-space-sm">
      <div role="group" aria-label={t.owner.bookings.filter} className="flex gap-space-xs overflow-x-auto px-margin pb-1">
        {BOOKING_FILTERS.map((filter) => (
          <button
            key={filter ?? 'ALL'}
            type="button"
            aria-pressed={filter === status}
            onClick={() => choose(filter)}
            className={`min-h-[40px] flex-shrink-0 rounded-full px-space-md font-label-md text-label-md transition-colors ${
              filter === status
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant'
            }`}
          >
            {filter ? t.bookings.status[filter] : t.owner.bookings.all}
          </button>
        ))}
      </div>
      {!bookings && <LoadingState label={t.owner.bookings.loading} />}
      {bookings?.length === 0 && (
        <p className="mx-margin flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-md font-body-md text-body-md text-on-surface-variant shadow-sm">
          <Icon name="event_note" className="text-[24px]" />
          {status ? t.owner.bookings.emptyFiltered : t.owner.bookings.empty}
        </p>
      )}
      {bookings && bookings.length > 0 && (
        <ul className="flex flex-col gap-space-sm px-margin">
          {bookings.map((booking) => (
            <OwnerBookingCard
              key={booking.id}
              booking={booking}
              busy={moves.pendingId !== null}
              pending={moves.pendingId === booking.id}
              onAccept={() => void accept(booking)}
              onDecline={() => setDeclining(booking)}
            />
          ))}
        </ul>
      )}
      {declining && (
        <DeclineSheet onDecline={(reason) => decline(declining, reason)} onClose={() => setDeclining(null)} />
      )}
    </div>
  )
}
