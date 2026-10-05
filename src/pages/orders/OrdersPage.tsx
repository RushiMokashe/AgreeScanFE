import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the store & payments agent builds the farmer's orders here (/orders) with
 * GET /api/orders and GET /api/orders/{id}.
 */
export default function OrdersPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="receipt_long" title={t.nav.screens.orders} />
}
