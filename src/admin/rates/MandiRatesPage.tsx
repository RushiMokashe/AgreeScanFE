import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the admin & assistant agent builds mandi rates here (/admin/rates/mandi) with
 * GET /api/admin/markets, GET /api/admin/markets/{id}/prices and the price endpoints.
 */
export default function MandiRatesPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="monitoring" title={t.nav.screens.mandiRates} />
}
