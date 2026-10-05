import { useState } from 'react'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { BookingStatus } from './rentals-utils'

/**
 * Books rentals and remembers each listing's booking status for this visit, so the spotlight hero and
 * the list cards agree when they show the same listing. Bookings touch no loaded data, so different
 * listings can be booked at the same time.
 */
export function useRentalBookings() {
  const { t } = useI18n()
  const toast = useToast()
  const [statuses, setStatuses] = useState<ReadonlyMap<number, BookingStatus>>(() => new Map())

  const setStatus = (listingId: number, status: BookingStatus) =>
    setStatuses((current) => new Map(current).set(listingId, status))

  const book = async (listingId: number) => {
    setStatus(listingId, 'pending')
    try {
      const booking = await api.bookRental(listingId)
      setStatus(listingId, 'booked')
      toast.show(booking.message)
    } catch (error) {
      setStatus(listingId, 'idle')
      toast.show(describeError(error, t.rentals.booking.failed), 'error')
    }
  }

  return {
    bookingStatus: (listingId: number): BookingStatus => statuses.get(listingId) ?? 'idle',
    book,
  }
}
