import { useState } from 'react'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { OwnerBookingDetail } from '../../lib/types'
import { DeclineSheet } from './DeclineSheet'
import { useOwnerBookingMoves, type OwnerMove } from './useOwnerBookingMoves'

interface OwnerBookingActionsProps {
  booking: OwnerBookingDetail
  onChange: (booking: OwnerBookingDetail) => void
}

const PRIMARY =
  'flex min-h-[52px] w-full items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg font-label-lg text-label-lg text-on-primary shadow-md active:scale-[0.99] disabled:opacity-60'

/** The moves the owner can make now: accept or decline a request, start an accepted job, complete one under way. */
export function OwnerBookingActions({ booking, onChange }: OwnerBookingActionsProps) {
  const { t } = useI18n()
  const moves = useOwnerBookingMoves()
  const [declining, setDeclining] = useState(false)
  const busy = moves.pendingId !== null

  const run = async (move: OwnerMove) => {
    const updated = await moves.run(booking, move)
    if (updated) onChange(updated)
  }

  const decline = async (reason: string | null) => {
    onChange(await moves.decline(booking, reason))
    setDeclining(false)
  }

  const primary = (move: OwnerMove, icon: string, label: string) => (
    <button type="button" disabled={busy} aria-busy={busy} onClick={() => void run(move)} className={PRIMARY}>
      <Icon name={busy ? 'progress_activity' : icon} className={`text-[20px] ${busy ? 'animate-spin' : ''}`} />
      {label}
    </button>
  )

  if (!booking.canAccept && !booking.canDecline && !booking.canStart && !booking.canComplete) return null

  return (
    <section className="flex flex-col gap-space-sm">
      {booking.canAccept && primary('accept', 'check_circle', t.owner.bookings.accept)}
      {booking.canStart && primary('start', 'local_shipping', t.owner.bookings.start)}
      {booking.canComplete && primary('complete', 'task_alt', t.owner.bookings.complete)}
      {booking.canDecline && (
        <button
          type="button"
          disabled={busy}
          onClick={() => setDeclining(true)}
          className="flex min-h-[48px] w-full items-center justify-center gap-space-xs rounded-xl border border-error/40 font-label-lg text-label-lg text-error active:bg-error-container disabled:opacity-50"
        >
          <Icon name="event_busy" className="text-[20px]" />
          {t.owner.bookings.decline}
        </button>
      )}
      {declining && <DeclineSheet onDecline={decline} onClose={() => setDeclining(false)} />}
    </section>
  )
}
