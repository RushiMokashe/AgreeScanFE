import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (lead): the rentals agent builds the farmer's booking tracking screen here (/bookings/:id) with
 * GET /api/rentals/bookings/{id} — status timeline, owner contact, cancel and pay.
 */
export default function BookingDetailPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="local_shipping" title={t.nav.screens.bookingDetail} />
}
