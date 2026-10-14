import type { BookingStatus, OwnerBooking, OwnerBookingDetail } from '../lib/types'

/** The booking-request filters, in the order the chips show them; null shows every booking. */
export const BOOKING_FILTERS: readonly (BookingStatus | null)[] = [
  null,
  'REQUESTED',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'DECLINED',
  'CANCELLED',
]

/** Search param holding the bookings filter; the dashboard links to `/owner/bookings?status=REQUESTED`. */
export const STATUS_PARAM = 'status'

const STATUSES: ReadonlySet<string> = new Set(BOOKING_FILTERS.filter((status) => status !== null))

/** `?status=` as a booking status, or null (show all) for anything else. */
export function parseStatusFilter(value: string | null): BookingStatus | null {
  return value !== null && STATUSES.has(value) ? (value as BookingStatus) : null
}

/** `bookings` with `updated` in place of the booking it updates. */
export function withBooking(bookings: readonly OwnerBooking[], updated: OwnerBookingDetail): OwnerBooking[] {
  return bookings.map((booking) => (booking.id === updated.id ? updated : booking))
}

