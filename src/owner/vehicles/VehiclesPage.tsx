import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the owner portal agent builds the vehicle list here (/owner/vehicles) with
 * GET /api/owner/listings and PATCH /api/owner/listings/{id}/online.
 */
export default function VehiclesPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="agriculture" title={t.nav.screens.vehicles} />
}
