import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the admin & assistant agent builds product prices here (/admin/rates/products) with
 * GET /api/admin/products and PATCH /api/admin/products/{id}.
 */
export default function ProductPricesPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="sell" title={t.nav.screens.productPrices} />
}
