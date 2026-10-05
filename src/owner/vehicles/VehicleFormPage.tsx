import { useParams } from 'react-router'
import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the owner portal agent builds the vehicle form here, for /owner/vehicles/new
 * (POST /api/owner/listings) and /owner/vehicles/:id (GET/PUT/DELETE /api/owner/listings/{id}, photo upload).
 */
export default function VehicleFormPage() {
  const { t } = useI18n()
  const { id } = useParams()
  return (
    <PlaceholderPage
      icon={id ? 'edit_note' : 'add_circle'}
      title={id ? t.nav.screens.editVehicle : t.nav.screens.newVehicle}
    />
  )
}
