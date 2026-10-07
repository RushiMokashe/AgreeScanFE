import { useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useToast } from '../../components/toast/toast-context'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import { inLanguage } from '../../lib/localized-draft'
import type { OwnerListing } from '../../lib/types'
import { VehicleCard } from './VehicleCard'

/** The owner's vehicles (/owner/vehicles): switch each on or off for bookings, edit it, or add another. */
export default function VehiclesPage() {
  const { t, lang } = useI18n()
  const toast = useToast()
  const { data: listings, error, reload, setData } = useApi(() => api.owner.listings())
  const [switchingId, setSwitchingId] = useState<number | null>(null)

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!listings) return <LoadingState label={t.owner.vehicles.loading} />

  const toggleOnline = async (listing: OwnerListing) => {
    setSwitchingId(listing.id)
    try {
      const updated = await api.owner.setListingOnline(listing.id, !listing.online)
      setData((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      const name = inLanguage(updated.name, lang)
      toast.show(updated.online ? t.owner.vehicles.switchedOn(name) : t.owner.vehicles.switchedOff(name), 'info')
    } catch (failure) {
      toast.show(describeError(failure, t.common.errors.unexpected), 'error')
    } finally {
      setSwitchingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-space-sm px-margin py-space-sm">
      <Link
        to="/owner/vehicles/new"
        className="flex min-h-[52px] items-center justify-center gap-space-xs rounded-xl bg-primary font-label-lg text-label-lg text-on-primary shadow-sm"
      >
        <Icon name="add_circle" className="text-[20px]" />
        {t.owner.vehicles.add}
      </Link>
      {listings.length === 0 ? (
        <section className="flex flex-col items-center gap-space-sm rounded-2xl bg-surface-container-lowest px-space-md py-space-xl text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
            <Icon name="agriculture" className="text-[32px]" />
          </div>
          <h1 className="font-title-md text-title-md font-bold text-on-surface">{t.owner.vehicles.empty.title}</h1>
          <p className="max-w-sm font-body-sm text-body-sm text-on-surface-variant">{t.owner.vehicles.empty.message}</p>
        </section>
      ) : (
        <ul className="flex flex-col gap-space-sm">
          {listings.map((listing) => (
            <VehicleCard
              key={listing.id}
              listing={listing}
              switching={switchingId === listing.id}
              onToggleOnline={(item) => void toggleOnline(item)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
