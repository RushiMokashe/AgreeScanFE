import type { Formatter } from '../../lib/format'
import type { DemandLevel } from '../../lib/types'

interface DemandStyle {
  badge: string
  price: string
}

const RISING_DEMAND = { badge: 'bg-secondary-container text-on-secondary-container', price: 'text-primary' }
const SETTLED_DEMAND = { badge: 'bg-surface-container text-on-surface-variant', price: 'text-on-surface' }

/** Commodities in demand get a green badge and price; settled markets stay neutral. */
export const DEMAND_STYLES = {
  HIGH_DEMAND: RISING_DEMAND,
  HOT: RISING_DEMAND,
  STABLE: SETTLED_DEMAND,
  STEADY: SETTLED_DEMAND,
} as const satisfies Record<DemandLevel, DemandStyle>

/** "₹1,850 - 2,400" */
export function priceRangeLabel(format: Formatter, minPrice: number, maxPrice: number): string {
  return `${format.inr(minPrice)} - ${format.number(maxPrice)}`
}

const MINUS_SIGN = '−'

interface PriceChange {
  icon: string
  label: string
  className: string
}

/** Change since the previous session: "+₹180" (up), "0%" (unchanged) or "−₹60" (down). */
export function priceChange(format: Formatter, amount: number): PriceChange {
  if (amount > 0) {
    return { icon: 'arrow_upward', label: `+${format.inr(amount)}`, className: 'text-secondary font-bold' }
  }
  if (amount < 0) {
    return { icon: 'arrow_downward', label: `${MINUS_SIGN}${format.inr(-amount)}`, className: 'text-error font-bold' }
  }
  return { icon: 'horizontal_rule', label: '0%', className: 'text-outline font-medium' }
}

export type GradingTipTone = 'warning' | 'advice'

interface GradingTipToneStyle {
  icon: string
  emphasis: string
}

/** Grading tips either warn about a loss or advise a gain. */
export const GRADING_TIP_TONES = {
  warning: { icon: 'bg-error-container text-on-error-container', emphasis: 'text-error font-bold' },
  advice: { icon: 'bg-secondary-container text-on-secondary-container', emphasis: 'text-primary font-bold' },
} as const satisfies Record<GradingTipTone, GradingTipToneStyle>
