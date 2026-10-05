import { useI18n } from '../../i18n/i18n-context'
import { formatCountdown } from '../../lib/format'
import { useCountdown } from './useCountdown'

interface FlashDealCountdownProps {
  /** ISO instant the deals end. */
  endsAt: string
}

/** "Ends in 08:42:15", ticking every second. Only this pill re-renders on each tick. */
export function FlashDealCountdown({ endsAt }: FlashDealCountdownProps) {
  const { t } = useI18n()
  const remaining = useCountdown(endsAt)

  return (
    <span
      role="timer"
      className="font-label-sm text-label-sm px-2.5 py-1 rounded bg-error-container text-on-error-container font-bold whitespace-nowrap tabular-nums"
    >
      {t.store.flashDeals.endsIn(formatCountdown(remaining))}
    </span>
  )
}
