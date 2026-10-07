import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { ErrorState, LoadingState } from '../components/PageState'
import { useToast } from '../components/toast/toast-context'
import { useApi } from '../hooks/useApi'
import { useI18n } from '../i18n/i18n-context'
import { api } from '../lib/api'
import type { RentalHubOption } from '../lib/types'
import { BookingSheet } from './rentals/BookingSheet'
import { HubPickerSheet } from './rentals/HubPickerSheet'
import { KisanProtectionCard } from './rentals/KisanProtectionCard'
import { LocationStrip } from './rentals/LocationStrip'
import { MachinerySection } from './rentals/MachinerySection'
import { MandiDeskCard } from './rentals/MandiDeskCard'
import { RentalTabs } from './rentals/RentalTabs'
import {
  RENTAL_TAB_PARAM,
  listingTarget,
  parseRentalTab,
  spotlightTarget,
  withListing,
  type BookingTarget,
  type RentalTab,
} from './rentals/rentals-utils'
import { SpotlightHero } from './rentals/SpotlightHero'
import { TransportSection } from './rentals/TransportSection'
import { useFavoriteToggle } from './rentals/useFavoriteToggle'

/**
 * Stitch screen "Farm Rentals & Mandi Transport": tractors and implements for hire, or mandi tempos
 * (`?tab=transport`), under a spotlight harvest-transport offer, at the farmer's preferred hub. Booking opens a
 * sheet that sends the owner a request (D9).
 */
export default function RentalsPage() {
  const { t } = useI18n()
  const toast = useToast()
  const { data, error, reload, setData } = useApi(() => api.rentals())
  const [searchParams, setSearchParams] = useSearchParams()
  const [bookingTarget, setBookingTarget] = useState<BookingTarget | null>(null)
  const [pickingHub, setPickingHub] = useState(false)
  const favorites = useFavoriteToggle((listing) => setData((overview) => withListing(overview, listing)))

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!data) return <LoadingState label={t.rentals.loading} />

  const selectedTab = parseRentalTab(searchParams.get(RENTAL_TAB_PARAM))
  // Switching tabs rewrites the URL in place, keeping the scroll position.
  const selectTab = (tab: RentalTab) =>
    setSearchParams({ [RENTAL_TAB_PARAM]: tab }, { replace: true, preventScrollReset: true })

  const hubChosen = (hub: RentalHubOption) => {
    setPickingHub(false)
    reload()
    toast.show(t.rentals.location.changed(hub.name), 'info')
  }

  return (
    <div className="flex flex-col w-full">
      <div className="px-margin pt-space-sm pb-space-xs flex flex-col gap-space-sm">
        <LocationStrip
          hubName={data.hubName}
          radiusKm={data.radiusKm}
          routes={data.routes}
          onChange={() => setPickingHub(true)}
        />
        <RentalTabs selected={selectedTab} onSelect={selectTab} />
      </div>
      {data.spotlight && (
        <SpotlightHero
          spotlight={data.spotlight}
          onBook={(spotlight) =>
            setBookingTarget(spotlightTarget(spotlight, t.rentals.booking.asap(spotlight.dispatchMinutes)))
          }
        />
      )}
      <MachinerySection
        listings={data.listings.filter((listing) => listing.category === 'MACHINERY')}
        onlineCount={data.onlineCount}
        hidden={selectedTab !== 'machinery'}
        onBook={(listing) => setBookingTarget(listingTarget(listing))}
        favoritePendingId={favorites.pendingId}
        onToggleFavorite={favorites.toggleFavorite}
      />
      <TransportSection
        listings={data.listings.filter((listing) => listing.category === 'TRANSPORT')}
        hidden={selectedTab !== 'transport'}
        onBook={(listing) => setBookingTarget(listingTarget(listing))}
      />
      <KisanProtectionCard />
      <MandiDeskCard />
      {bookingTarget && <BookingSheet target={bookingTarget} onClose={() => setBookingTarget(null)} />}
      {pickingHub && (
        <HubPickerSheet currentHubId={data.hubId} onChosen={hubChosen} onClose={() => setPickingHub(false)} />
      )}
    </div>
  )
}
