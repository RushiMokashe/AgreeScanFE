import { createContext, useContext } from 'react'
import type { AppNotification } from '../lib/types'

export type NotificationListener = (notification: AppNotification) => void

/** What NotificationsProvider shares with the bell, the notifications page and screens that follow live updates. */
export interface Notifications {
  /** The number on the bell's badge. */
  unreadCount: number
  /** Marks one notification read; resolves to the updated notification, rejects with an ApiError. */
  markRead: (notification: AppNotification) => Promise<AppNotification>
  /** Marks every notification read; rejects with an ApiError. */
  markAllRead: () => Promise<void>
  /**
   * Calls `listener` with every live notification until the returned function is called, e.g. to reload a
   * booking when a notification for it arrives:
   * `useEffect(() => notifications.subscribe((n) => { if (n.route === route) reload() }), [...])`.
   */
  subscribe: (listener: NotificationListener) => () => void
}

export const NotificationsContext = createContext<Notifications | null>(null)

/** The signed-in user's notifications; for components inside the farmer app or the owner portal. */
export function useNotifications(): Notifications {
  const notifications = useContext(NotificationsContext)
  if (!notifications) throw new Error('useNotifications() must be used inside <NotificationsProvider>')
  return notifications
}
