import { useState } from 'react'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { OwnerBooking, OwnerBookingDetail } from '../../lib/types'

/** The owner's moves that need no reason; declining asks for one (see `decline`). */
export type OwnerMove = 'accept' | 'start' | 'complete'

const MOVES: Record<OwnerMove, (id: number) => Promise<OwnerBookingDetail>> = {
  accept: api.owner.acceptBooking,
  start: api.owner.startBooking,
  complete: api.owner.completeBooking,
}

/**
 * The owner's moves of the booking lifecycle (D9), each confirmed with a toast. One move is in flight at a time:
 * `pendingId` names its booking, and callers disable the other buttons meanwhile.
 */
export function useOwnerBookingMoves() {
  const { t } = useI18n()
  const toast = useToast()
  const [pendingId, setPendingId] = useState<number | null>(null)

  /** Makes the move; resolves to the updated booking, or undefined after telling the owner why it failed. */
  const run = async (booking: OwnerBooking, move: OwnerMove): Promise<OwnerBookingDetail | undefined> => {
    setPendingId(booking.id)
    try {
      const updated = await MOVES[move](booking.id)
      toast.show(t.owner.bookings.done[move])
      return updated
    } catch (error) {
      toast.show(describeError(error, t.common.errors.unexpected), 'error')
      return undefined
    } finally {
      setPendingId(null)
    }
  }

  /** Declines with the owner's reason; rejects with an ApiError, which the reason sheet shows. */
  const decline = async (booking: OwnerBooking, reason: string | null): Promise<OwnerBookingDetail> => {
    const updated = await api.owner.declineBooking(booking.id, reason)
    toast.show(t.owner.bookings.done.decline, 'info')
    return updated
  }

  return { pendingId, run, decline }
}
