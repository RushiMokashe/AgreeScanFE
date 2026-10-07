import { Icon } from '../components/Icon'
import { useI18n } from '../i18n/i18n-context'
import { useFormat } from '../i18n/useFormat'
import type { AppNotification } from '../lib/types'
import { NOTIFICATION_STYLES } from './notifications-utils'

interface NotificationItemProps {
  notification: AppNotification
  onOpen: (notification: AppNotification) => void
}

/** One notification in the list; unread ones stand out until opened. */
export function NotificationItem({ notification, onOpen }: NotificationItemProps) {
  const { t } = useI18n()
  const format = useFormat()
  const { icon, tone } = NOTIFICATION_STYLES[notification.type]
  const unread = !notification.read

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className={`w-full min-h-[64px] flex items-start gap-space-sm rounded-xl p-space-sm text-left transition-colors active:bg-surface-container-high ${
          unread ? 'bg-surface-container-lowest shadow-sm' : 'bg-transparent'
        }`}
      >
        <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${tone}`}>
          <Icon name={icon} className="text-[20px]" />
        </span>
        <span className="flex flex-col min-w-0 flex-1 gap-0.5">
          <span className="flex items-center justify-between gap-space-xs">
            <span className={`font-label-lg text-label-lg text-on-surface ${unread ? 'font-bold' : ''}`}>
              {notification.title}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant flex-shrink-0">
              {format.timeAgo(notification.createdAt)}
            </span>
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">{notification.body}</span>
        </span>
        {unread && (
          <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0">
            <span className="sr-only">{t.notifications.unread}</span>
          </span>
        )}
      </button>
    </li>
  )
}
