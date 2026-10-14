import type { BookingPaymentStatus, BookingStatus } from '../../lib/types'

/** The longest decline or cancel reason the server keeps. */
export const BOOKING_REASON_MAX_LENGTH = 200

/** Material Symbol and colours of each booking status, the same for farmers and owners. */
export const BOOKING_STATUS_STYLES: Record<BookingStatus, { icon: string; tone: string }> = {
  REQUESTED: { icon: 'hourglass_top', tone: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  ACCEPTED: { icon: 'event_available', tone: 'bg-secondary-container text-on-secondary-container' },
  DECLINED: { icon: 'event_busy', tone: 'bg-error-container text-on-error-container' },
  IN_PROGRESS: { icon: 'local_shipping', tone: 'bg-primary-fixed text-on-primary-fixed' },
  COMPLETED: { icon: 'task_alt', tone: 'bg-primary text-on-primary' },
  CANCELLED: { icon: 'cancel', tone: 'bg-surface-container-highest text-on-surface-variant' },
}

export const PAYMENT_STATUS_STYLES: Record<BookingPaymentStatus, { icon: string; tone: string }> = {
  UNPAID: { icon: 'schedule', tone: 'bg-surface-container-high text-on-surface-variant' },
  VERIFYING: { icon: 'hourglass_top', tone: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  PAID: { icon: 'verified', tone: 'bg-secondary-container text-on-secondary-container' },
}
