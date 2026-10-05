import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/** PLACEHOLDER (platform): the admin & assistant agent builds the payment list here (/admin/payments) with GET /api/admin/payments. */
export default function AdminPaymentsPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="payments" title={t.nav.screens.payments} />
}
