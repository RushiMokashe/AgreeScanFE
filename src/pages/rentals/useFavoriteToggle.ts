import { useState } from 'react'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { RentalListing } from '../../lib/types'

/**
 * Saves or un-saves a listing. The endpoint returns the updated listing, which is handed to
 * `onListingChange`. Callers disable every favourite button while `pendingId` is set, so only one
 * toggle is in flight and an older overview can never overwrite a newer one.
 */
export function useFavoriteToggle(onListingChange: (listing: RentalListing) => void) {
  const { t } = useI18n()
  const toast = useToast()
  const [pendingId, setPendingId] = useState<number | null>(null)

  const toggleFavorite = async (listing: RentalListing) => {
    setPendingId(listing.id)
    try {
      const updated = await api.toggleRentalFavorite(listing.id)
      onListingChange(updated)
      if (updated.favorite) toast.show(t.rentals.favorite.saved)
      else toast.show(t.rentals.favorite.removed, 'info')
    } catch (error) {
      toast.show(describeError(error, t.rentals.favorite.failed), 'error')
    } finally {
      setPendingId(null)
    }
  }

  return { pendingId, toggleFavorite }
}
