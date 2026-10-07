import type { BookingEvent, BookingPaymentStatus, BookingStatus, RateUnit } from '../../../lib/types'

/**
 * The farmer's rental bookings (/bookings) and their tracking screen (/bookings/:id) (D9); the status, payment and
 * timeline texts are shared with the owner portal.
 */
export const bookings = {
  loading: 'Loading your bookings…',
  empty: {
    title: 'No bookings yet',
    message: 'Book a tractor or a mandi tempo, then follow every step here.',
    browse: 'Find a vehicle',
  },
  status: {
    REQUESTED: 'Requested',
    ACCEPTED: 'Accepted',
    DECLINED: 'Declined',
    IN_PROGRESS: 'On the way',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  } satisfies Record<BookingStatus, string>,
  payment: {
    UNPAID: 'Not paid yet',
    PAID: 'Paid online',
  } satisfies Record<BookingPaymentStatus, string>,
  /** An estimate: "3 hours", "15 km", "1 day". */
  units: {
    HOUR: (count: number) => `${count} ${count === 1 ? 'hour' : 'hours'}`,
    KM: (count: number) => `${count} km`,
    DAY: (count: number) => `${count} ${count === 1 ? 'day' : 'days'}`,
  } satisfies Record<RateUnit, (count: number) => string>,
  /** "Booked 3 hours ago". */
  booked: (ago: string) => `Booked ${ago}`,
  timeline: {
    title: 'Booking timeline',
    /** The reader's own steps. */
    you: 'You',
    actor: {
      FARMER: 'Farmer',
      OWNER: 'Owner',
      SYSTEM: 'AgriScan',
    } satisfies Record<BookingEvent['actor'], string>,
    event: {
      REQUESTED: 'Booking requested',
      ACCEPTED: 'Accepted',
      DECLINED: 'Declined',
      IN_PROGRESS: 'Job started – on the way',
      COMPLETED: 'Job completed',
      CANCELLED: 'Booking cancelled',
    } satisfies Record<BookingStatus, string>,
  },
  /** The sheet that asks why a booking is cancelled or declined. */
  reason: {
    label: 'Reason (optional)',
    keep: 'Go back',
  },
  detail: {
    loading: 'Loading booking…',
    headline: {
      REQUESTED: (owner: string) => `Waiting for ${owner} to confirm`,
      ACCEPTED: (owner: string) => `Confirmed by ${owner}`,
      DECLINED: (owner: string) => `${owner} could not take this job`,
      IN_PROGRESS: (owner: string) => `${owner} is on the way`,
      COMPLETED: (owner: string) => `${owner} completed the job`,
      CANCELLED: () => 'You cancelled this booking',
    } satisfies Record<BookingStatus, (owner: string) => string>,
    slot: 'When',
    estimate: 'Estimate',
    amount: 'Amount',
    hub: 'Rental hub',
    payment: 'Payment',
    callOwner: (owner: string) => `Call ${owner}`,
    pay: (amount: string) => `Pay ${amount} online`,
    paying: 'Opening payment…',
    payLater: 'Prefer cash? You can also pay the owner directly after the job.',
    cancel: 'Cancel booking',
    cancelTitle: 'Cancel this booking?',
    cancelMessage: 'We will tell the owner. A short reason helps them plan.',
    cancelConfirm: 'Yes, cancel booking',
    cancelling: 'Cancelling…',
    cancelled: 'Booking cancelled',
    quickReasons: {
      plansChanged: 'My plans changed',
      otherVehicle: 'Found another vehicle',
      weather: 'Weather is not suitable',
    },
    allBookings: 'All my bookings',
  },
}
