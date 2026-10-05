import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the admin & assistant agent builds rental rates here (/admin/rates/rentals) with
 * GET /api/admin/rentals and PATCH /api/admin/rentals/{id}.
 */
export default function RentalRatesPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="agriculture" title={t.nav.screens.rentalRates} />
}
