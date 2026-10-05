import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (lead): the owner-portal agent builds one booking request here (/owner/bookings/:id) with
 * GET /api/owner/bookings/{id} — the timeline and the accept / decline / start / complete actions.
 */
export default function OwnerBookingDetailPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="assignment" title={t.nav.screens.ownerBookingDetail} />
}
