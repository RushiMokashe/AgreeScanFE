import { useI18n } from '../../i18n/i18n-context'
import type { RentalListing } from '../../lib/types'
import { rentalPanelId, rentalTabId, type BookingStatus } from './rentals-utils'
import { TransportCard } from './TransportCard'

interface TransportSectionProps {
  listings: RentalListing[]
  /** Another tab is selected. */
  hidden: boolean
  bookingStatus: (listingId: number) => BookingStatus
  onBook: (listingId: number) => void
}

/** Tab panel of tempos and trucks for taking the harvest to the mandi. */
export function TransportSection({ listings, hidden, bookingStatus, onBook }: TransportSectionProps) {
  const { t } = useI18n()

  return (
    <section
      id={rentalPanelId('transport')}
      role="tabpanel"
      aria-labelledby={rentalTabId('transport')}
      hidden={hidden}
      className="flex flex-col gap-space-md px-margin mb-space-md"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">{t.rentals.transport.title}</h2>
        <span className="font-label-sm text-label-sm text-secondary font-bold bg-secondary-container px-2 py-0.5 rounded-full flex-shrink-0">
          {t.rentals.transport.gatePass}
        </span>
      </div>
      {listings.map((listing, index) => (
        <TransportCard
          key={listing.id}
          listing={listing}
          toneIndex={index}
          bookingStatus={bookingStatus(listing.id)}
          onBook={onBook}
        />
      ))}
    </section>
  )
}
