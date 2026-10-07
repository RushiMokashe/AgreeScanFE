import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '../components/Icon'
import { ErrorState, LoadingState } from '../components/PageState'
import { useToast } from '../components/toast/toast-context'
import { useI18n } from '../i18n/i18n-context'
import { describeError } from '../lib/api'
import type { AppNotification } from '../lib/types'
import { AlertsCard } from './AlertsCard'
import { NotificationItem } from './NotificationItem'
import { useNotificationFeed } from './useNotificationFeed'

/** The signed-in user's notifications, newest first (/notifications and /owner/notifications). */
export default function NotificationsPage() {
  const { t } = useI18n()
  const toast = useToast()
  const navigate = useNavigate()
  const { feed, error, reload, loadingMore, loadMore, markRead, markAllRead } = useNotificationFeed()
  const [markingAll, setMarkingAll] = useState(false)

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!feed) return <LoadingState label={t.notifications.loading} />

  const failed = (reason: unknown) => toast.show(describeError(reason, t.common.errors.unexpected), 'error')

  const open = (notification: AppNotification) => {
    if (!notification.read) void markRead(notification).catch(failed)
    navigate(notification.route)
  }

  const readAll = async () => {
    setMarkingAll(true)
    try {
      await markAllRead()
    } catch (reason) {
      failed(reason)
    } finally {
      setMarkingAll(false)
    }
  }

  const anyUnread = feed.items.some((item) => !item.read)

  return (
    <div className="flex flex-col gap-space-sm px-margin py-space-sm">
      <AlertsCard />
      {feed.items.length === 0 ? (
        <section className="flex flex-col items-center gap-space-sm rounded-2xl bg-surface-container-lowest px-space-md py-space-xl text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
            <Icon name="notifications_off" className="text-[32px]" />
          </div>
          <h1 className="font-title-md text-title-md font-bold text-on-surface">{t.notifications.empty.title}</h1>
          <p className="max-w-sm font-body-sm text-body-sm text-on-surface-variant">{t.notifications.empty.message}</p>
        </section>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!anyUnread || markingAll}
              aria-busy={markingAll}
              onClick={() => void readAll()}
              className="min-h-[44px] flex items-center gap-1 rounded-lg px-space-sm font-label-md text-label-md font-bold text-primary disabled:text-on-surface-variant disabled:opacity-60"
            >
              <Icon name={markingAll ? 'progress_activity' : 'done_all'} className={`text-[18px] ${markingAll ? 'animate-spin' : ''}`} />
              {t.notifications.markAllRead}
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {feed.items.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onOpen={open} />
            ))}
          </ul>
          {feed.hasMore && (
            <button
              type="button"
              disabled={loadingMore}
              aria-busy={loadingMore}
              onClick={() => void loadMore().catch(failed)}
              className="self-center min-h-[44px] flex items-center gap-1 rounded-lg bg-surface-container px-space-md font-label-md text-label-md text-primary disabled:opacity-60"
            >
              {loadingMore && <Icon name="progress_activity" className="text-[18px] animate-spin" />}
              {t.notifications.loadMore}
            </button>
          )}
        </>
      )}
    </div>
  )
}
