import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the owner portal agent builds booking requests here (/owner/bookings) with
 * GET /api/owner/bookings?status= and POST /api/owner/bookings/{id}/accept|decline|complete.
 */
export default function OwnerBookingsPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="event_note" title={t.nav.screens.ownerBookings} />
}
