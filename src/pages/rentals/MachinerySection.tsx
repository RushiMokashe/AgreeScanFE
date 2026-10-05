import { useI18n } from '../../i18n/i18n-context'
import type { RentalListing } from '../../lib/types'
import { MachineryCard } from './MachineryCard'
import { rentalPanelId, rentalTabId, type BookingStatus } from './rentals-utils'

interface MachinerySectionProps {
  listings: RentalListing[]
  onlineCount: number
  /** Another tab is selected. */
  hidden: boolean
  bookingStatus: (listingId: number) => BookingStatus
  onBook: (listingId: number) => void
  favoritePendingId: number | null
  onToggleFavorite: (listing: RentalListing) => void
}

/** Tab panel of tractors and implements for hire near the farmer. */
export function MachinerySection({
  listings,
  onlineCount,
  hidden,
  bookingStatus,
  onBook,
  favoritePendingId,
  onToggleFavorite,
}: MachinerySectionProps) {
  const { t } = useI18n()

  return (
    <section
      id={rentalPanelId('machinery')}
      role="tabpanel"
      aria-labelledby={rentalTabId('machinery')}
      hidden={hidden}
      className="flex flex-col gap-space-md px-margin mb-space-md"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">{t.rentals.machinery.title}</h2>
        <span className="font-label-sm text-label-sm text-primary font-semibold bg-primary-fixed px-2 py-0.5 rounded-full flex-shrink-0">
          {t.rentals.machinery.online(onlineCount)}
        </span>
      </div>
      {listings.map((listing, index) => (
        <MachineryCard
          key={listing.id}
          listing={listing}
          toneIndex={index}
          bookingStatus={bookingStatus(listing.id)}
          onBook={onBook}
          favoritePendingId={favoritePendingId}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  )
}
