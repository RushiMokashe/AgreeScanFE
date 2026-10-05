import { useSearchParams } from 'react-router'
import { ErrorState, LoadingState } from '../components/PageState'
import { useApi } from '../hooks/useApi'
import { useI18n } from '../i18n/i18n-context'
import { api } from '../lib/api'
import { KisanProtectionCard } from './rentals/KisanProtectionCard'
import { LocationStrip } from './rentals/LocationStrip'
import { MachinerySection } from './rentals/MachinerySection'
import { MandiDeskCard } from './rentals/MandiDeskCard'
import { RentalTabs } from './rentals/RentalTabs'
import { RENTAL_TAB_PARAM, parseRentalTab, withListing, type RentalTab } from './rentals/rentals-utils'
import { SpotlightHero } from './rentals/SpotlightHero'
import { TransportSection } from './rentals/TransportSection'
import { useFavoriteToggle } from './rentals/useFavoriteToggle'
import { useRentalBookings } from './rentals/useRentalBookings'

/**
 * Stitch screen "Farm Rentals & Mandi Transport": tractors and implements for hire, or mandi tempos
 * (`?tab=transport`), under a spotlight harvest-transport offer.
 */
export default function RentalsPage() {
  const { t } = useI18n()
  const { data, error, reload, setData } = useApi(() => api.rentals())
  const [searchParams, setSearchParams] = useSearchParams()
  const { bookingStatus, book } = useRentalBookings()
  const favorites = useFavoriteToggle((listing) => {
    if (data) setData(withListing(data, listing))
  })

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!data) return <LoadingState label={t.rentals.loading} />

  const selectedTab = parseRentalTab(searchParams.get(RENTAL_TAB_PARAM))
  // Switching tabs rewrites the URL in place, keeping the scroll position.
  const selectTab = (tab: RentalTab) =>
    setSearchParams({ [RENTAL_TAB_PARAM]: tab }, { replace: true, preventScrollReset: true })

  return (
    <div className="flex flex-col w-full">
      <div className="px-margin pt-space-sm pb-space-xs flex flex-col gap-space-sm">
        <LocationStrip hubName={data.hubName} radiusKm={data.radiusKm} routes={data.routes} />
        <RentalTabs selected={selectedTab} onSelect={selectTab} />
      </div>
      {data.spotlight && (
        <SpotlightHero
          spotlight={data.spotlight}
          bookingStatus={bookingStatus(data.spotlight.listingId)}
          onBook={book}
        />
      )}
      <MachinerySection
        listings={data.listings.filter((listing) => listing.category === 'MACHINERY')}
        onlineCount={data.onlineCount}
        hidden={selectedTab !== 'machinery'}
        bookingStatus={bookingStatus}
        onBook={book}
        favoritePendingId={favorites.pendingId}
        onToggleFavorite={favorites.toggleFavorite}
      />
      <TransportSection
        listings={data.listings.filter((listing) => listing.category === 'TRANSPORT')}
        hidden={selectedTab !== 'transport'}
        bookingStatus={bookingStatus}
        onBook={book}
      />
      <KisanProtectionCard />
      <MandiDeskCard />
    </div>
  )
}
