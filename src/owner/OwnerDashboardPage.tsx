import { PlaceholderPage } from '../components/PlaceholderPage'
import { useI18n } from '../i18n/i18n-context'

/** PLACEHOLDER (platform): the owner portal agent builds the partner dashboard here (/owner) with GET /api/owner/dashboard. */
export default function OwnerDashboardPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="space_dashboard" title={t.nav.screens.ownerDashboard} />
}
