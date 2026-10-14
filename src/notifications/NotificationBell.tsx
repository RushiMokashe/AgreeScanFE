import { Link } from 'react-router'
import { Icon } from '../components/Icon'
import { useI18n } from '../i18n/i18n-context'
import { useNotifications } from './notifications-context'
import { badgeLabel } from './notifications-utils'

/** The header's bell with the unread count, opening the portal's notifications page at `to`. */
export function NotificationBell({ to }: { to: string }) {
  const { t } = useI18n()
  const { unreadCount } = useNotifications()

  return (
    <Link
      to={to}
      aria-label={t.notifications.bell(unreadCount)}
      className="relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface-container-low text-primary flex items-center justify-center transition-colors active:bg-primary-container active:text-on-primary"
    >
      <Icon name="notifications" fill={unreadCount > 0} className="text-[22px]" />
      {unreadCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-on-error font-label-sm text-[10px] font-bold leading-none flex items-center justify-center ring-2 ring-surface"
        >
          {badgeLabel(unreadCount)}
        </span>
      )}
    </Link>
  )
}
