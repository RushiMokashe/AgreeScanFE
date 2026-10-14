import { useParams } from 'react-router'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api } from '../../lib/api'
import { RemoveVehicleSection } from './RemoveVehicleSection'
import { VehicleEditor } from './VehicleEditor'
import { newVehicleForm, vehicleFormOf } from './vehicle-form'

/** Adds a vehicle (/owner/vehicles/new) or edits one (/owner/vehicles/:id). */
export default function VehicleFormPage() {
  const { id } = useParams()
  return id ? <EditVehicle listingId={Number(id)} /> : <NewVehicle />
}

/** A new vehicle starts at the owner's own hub. */
function NewVehicle() {
  const { t } = useI18n()
  const profile = useApi(() => api.owner.me())
  const hubs = useApi(() => api.rentalHubs())

  const error = profile.error ?? hubs.error
  if (error) return <ErrorState error={error} onRetry={() => (profile.error ? profile.reload() : hubs.reload())} />
  if (!profile.data || !hubs.data) return <LoadingState label={t.owner.form.loading} />

  return (
    <div className="px-margin py-space-sm">
      <VehicleEditor initial={newVehicleForm(profile.data.hubId)} hubs={hubs.data} imageUrl={null} />
    </div>
  )
}

function EditVehicle({ listingId }: { listingId: number }) {
  const { t } = useI18n()
  const listing = useApi(() => api.owner.listing(listingId), [listingId])
  const hubs = useApi(() => api.rentalHubs())

  const error = listing.error ?? hubs.error
  if (error) return <ErrorState error={error} onRetry={() => (listing.error ? listing.reload() : hubs.reload())} />
  if (!listing.data || !hubs.data) return <LoadingState label={t.owner.form.loading} />

  return (
    <div className="flex flex-col gap-space-lg px-margin py-space-sm">
      <VehicleEditor
        key={listing.data.id}
        initial={vehicleFormOf(listing.data)}
        hubs={hubs.data}
        imageUrl={listing.data.imageUrl}
        listingId={listing.data.id}
      />
      <RemoveVehicleSection listingId={listing.data.id} />
    </div>
  )
}
