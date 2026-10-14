import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '../components/toast/toast-context'
import { useI18n } from '../i18n/i18n-context'
import { api } from '../lib/api'
import type { AppNotification } from '../lib/types'
import { openNotificationStream } from './notification-stream'
import { NotificationsContext, type NotificationListener } from './notifications-context'
import { showSystemAlert } from './system-notifications'

/**
 * The signed-in user's notifications (docs/architecture/phase-2.md, D10), mounted by the farmer and owner layouts:
 * keeps the unread count, listens to the live stream, and tells the user about every new notification with a
 * toast, or with a system alert while the tab is in the background.
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { t, lang } = useI18n()
  const toast = useToast()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)
  const listeners = useRef(new Set<NotificationListener>())

  const refreshUnreadCount = useCallback(() => {
    // A failed refresh keeps the badge as it is; the next live notification or resync corrects it.
    api.notifications.unreadCount().then(({ count }) => setUnreadCount(count), () => undefined)
  }, [])

  const receive = useEffectEvent((notification: AppNotification) => {
    setUnreadCount((count) => count + 1)
    listeners.current.forEach((listener) => listener(notification))
    const open = () => navigate(notification.route)
    toast.show(notification.title, 'info', { label: t.notifications.view, onSelect: open })
    showSystemAlert(notification, open)
  })

  useEffect(() => {
    const stream = openNotificationStream(lang, {
      onNotification: (notification) => receive(notification),
      onResync: refreshUnreadCount,
    })
    return () => stream.close()
  }, [lang, refreshUnreadCount])

  const markRead = useCallback(async (notification: AppNotification) => {
    const updated = await api.notifications.markRead(notification.id)
    if (!notification.read) setUnreadCount((count) => Math.max(0, count - 1))
    return updated
  }, [])

  const markAllRead = useCallback(async () => {
    await api.notifications.markAllRead()
    setUnreadCount(0)
  }, [])

  const subscribe = useCallback((listener: NotificationListener) => {
    listeners.current.add(listener)
    return () => {
      listeners.current.delete(listener)
    }
  }, [])

  const value = useMemo(
    () => ({ unreadCount, markRead, markAllRead, subscribe }),
    [unreadCount, markRead, markAllRead, subscribe],
  )

  return <NotificationsContext value={value}>{children}</NotificationsContext>
}
