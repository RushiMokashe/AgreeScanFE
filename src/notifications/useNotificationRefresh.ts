import { useEffect, useEffectEvent } from 'react'
import { useNotifications } from './notifications-context'

/**
 * Calls `refresh` whenever a live notification links to a route `concerns` accepts, e.g. the booking screen
 * reloads the booking the owner just accepted:
 * `useNotificationRefresh((route) => route === `/bookings/${id}`, reload)`.
 */
export function useNotificationRefresh(concerns: (route: string) => boolean, refresh: () => void) {
  const { subscribe } = useNotifications()
  const onNotification = useEffectEvent((route: string) => {
    if (concerns(route)) refresh()
  })

  useEffect(() => subscribe((notification) => onNotification(notification.route)), [subscribe])
}

/** Whether a route opens one of the owner's bookings: every booking notification an owner receives does. */
export function isOwnerBookingRoute(route: string): boolean {
  return route.startsWith('/owner/bookings/')
}
