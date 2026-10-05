import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the farm & crop health agent builds plot management here (/plots) with
 * GET/POST /api/plots, PUT/DELETE /api/plots/{id} and the crops of GET /api/crops.
 */
export default function PlotsPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="grass" title={t.nav.screens.plots} />
}
