import { Icon } from '../../components/Icon'
import type { RentalListing } from '../../lib/types'
import { BookButton } from './BookButton'
import type { BookingStatus } from './rentals-utils'

interface RentalActionsProps {
  listing: RentalListing
  bookingStatus: BookingStatus
  onBook: (listingId: number) => void
}

/** Call the operator, or book the listing. */
export function RentalActions({ listing, bookingStatus, onBook }: RentalActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-space-sm pt-1">
      <a
        href={`tel:${listing.phone}`}
        className="min-h-[48px] rounded-lg bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1.5 active:bg-secondary-container"
      >
        <Icon name="call" className="text-[18px]" />
        <span>{listing.callLabel}</span>
      </a>
      <BookButton
        label={listing.bookLabel}
        icon={listing.bookIcon}
        status={bookingStatus}
        onBook={() => onBook(listing.id)}
        className="gap-1.5"
      />
    </div>
  )
}
