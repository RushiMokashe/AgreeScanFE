import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { BookingTarget } from './rentals-utils'

interface AmountPreviewProps {
  target: BookingTarget
  units: number
  amount: number
}

/** What the estimate comes to, and how: "₹650/hr × 3 = ₹1,950", plus the base fare of fare-based transport. */
export function AmountPreview({ target, units, amount }: AmountPreviewProps) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <div aria-live="polite" className="flex items-center justify-between gap-space-sm rounded-xl bg-secondary-container/50 px-space-md py-space-sm">
      <div className="flex flex-col">
        <span className="font-label-md text-label-md text-on-surface-variant">{t.rentals.booking.estimate}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {format.inr(target.rate)}
          {t.rentals.rateUnits[target.rateUnit]} × {format.number(units)}
          {target.baseFare > 0 && ` ${t.rentals.booking.baseFare(format.inr(target.baseFare))}`}
        </span>
      </div>
      <span className="font-headline-sm text-headline-sm font-bold text-primary">{format.inr(amount)}</span>
    </div>
  )
}
