import { PlaceholderPage } from '../components/PlaceholderPage'
import { useI18n } from '../i18n/i18n-context'

/**
 * PLACEHOLDER (lead): the notifications agent builds the notification list here — /notifications in the farmer
 * app and /owner/notifications in the partner portal — with GET /api/notifications.
 */
export default function NotificationsPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="notifications" title={t.nav.screens.notifications} />
}
