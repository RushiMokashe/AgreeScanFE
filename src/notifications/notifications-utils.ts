import type { AppNotification, NotificationType } from '../lib/types'

/** The badge shows counts up to this; more read "99+". */
const MAX_BADGE_COUNT = 99

/** Material Symbol and colours of each kind of notification in the list. */
export const NOTIFICATION_STYLES: Record<NotificationType, { icon: string; tone: string }> = {
  BOOKING_REQUESTED: { icon: 'event_upcoming', tone: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  BOOKING_ACCEPTED: { icon: 'event_available', tone: 'bg-secondary-container text-on-secondary-container' },
  BOOKING_DECLINED: { icon: 'event_busy', tone: 'bg-error-container text-on-error-container' },
  BOOKING_STARTED: { icon: 'local_shipping', tone: 'bg-primary-fixed text-on-primary-fixed' },
  BOOKING_COMPLETED: { icon: 'task_alt', tone: 'bg-secondary-container text-on-secondary-container' },
  BOOKING_CANCELLED: { icon: 'cancel', tone: 'bg-surface-container-highest text-on-surface-variant' },
  PAYMENT_SUCCEEDED: { icon: 'payments', tone: 'bg-secondary-container text-on-secondary-container' },
  PAYMENT_FAILED: { icon: 'credit_card_off', tone: 'bg-error-container text-on-error-container' },
}

export function badgeLabel(count: number): string {
  return count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(count)
}

/** `items` with `notification` first, replacing an older copy of it. */
export function withNewest(items: readonly AppNotification[], notification: AppNotification): AppNotification[] {
  return [notification, ...items.filter((item) => item.id !== notification.id)]
}

/** `items` with `updated` in place of the notification it updates. */
export function withUpdated(items: readonly AppNotification[], updated: AppNotification): AppNotification[] {
  return items.map((item) => (item.id === updated.id ? updated : item))
}
