import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the rentals & owners agent builds the farmer's bookings here (/bookings) with
 * GET /api/rentals/bookings and POST /api/rentals/bookings/{id}/cancel.
 */
export default function BookingsPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="event_available" title={t.nav.screens.bookings} />
}
