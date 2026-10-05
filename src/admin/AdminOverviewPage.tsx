import { PlaceholderPage } from '../components/PlaceholderPage'
import { useI18n } from '../i18n/i18n-context'

/** PLACEHOLDER (platform): the admin & assistant agent builds the overview here (/admin) with GET /api/admin/overview. */
export default function AdminOverviewPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="dashboard" title={t.nav.screens.adminOverview} />
}
