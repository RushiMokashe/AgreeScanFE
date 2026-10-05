import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { RentalListing } from '../../lib/types'

interface FavoriteButtonProps {
  listing: RentalListing
  /** A favourite toggle is in flight on some card. */
  busy: boolean
  /** The toggle in flight is this card's. */
  pending: boolean
  onToggle: (listing: RentalListing) => void
}

/** Heart on a machine's photo, filled red once the listing is saved. */
export function FavoriteButton({ listing, busy, pending, onToggle }: FavoriteButtonProps) {
  const { t } = useI18n()

  return (
    // ::after widens the 36px circle's tap target to 44px
    <button
      type="button"
      aria-label={t.rentals.favorite.save(listing.name)}
      aria-pressed={listing.favorite}
      aria-busy={pending}
      disabled={busy}
      onClick={() => onToggle(listing)}
      className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center shadow-sm after:absolute after:-inset-1 ${
        pending ? 'opacity-60' : ''
      }`}
    >
      <Icon
        name="favorite"
        fill={listing.favorite}
        className={`text-[20px] ${listing.favorite ? 'text-error' : 'text-outline'}`}
      />
    </button>
  )
}
