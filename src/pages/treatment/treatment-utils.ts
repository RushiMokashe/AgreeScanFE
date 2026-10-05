import type { Messages } from '../../i18n/translation'
import type { AgroDealer, DealerCertification, StepStatus, TreatmentStep } from '../../lib/types'

interface StepStatusStyle {
  /** Circle on the timeline guide line. */
  marker: string
  markerIcon: string
  markerIconSize: string
  /** "Day 4 • In 3 Days" */
  dayLabel: string
  /** Colours of the chip beside the day: the completion time, or the step's badge. */
  chip: string
  /** Note under the step detail, with its leading icon. */
  note: string
  noteIcon: string | null
}

/** The design's three timeline variants: done, next up, and later in the course. */
export const STEP_STATUS_STYLES = {
  COMPLETED: {
    marker: 'bg-primary text-on-primary shadow-sm',
    markerIcon: 'check',
    markerIconSize: 'text-[16px]',
    dayLabel: 'text-primary',
    chip: 'bg-secondary-container text-on-secondary-container',
    note: 'mt-1 flex items-center gap-space-xs text-on-secondary-container',
    noteIcon: 'verified',
  },
  UPCOMING: {
    marker: 'bg-surface-container-lowest text-primary ring-2 ring-primary shadow-sm',
    markerIcon: 'schedule',
    markerIconSize: 'text-[14px]',
    dayLabel: 'text-on-surface',
    chip: 'bg-surface-container-high text-on-surface-variant',
    note: 'text-error',
    noteIcon: null,
  },
  SCHEDULED: {
    marker: 'bg-surface-container-high text-outline',
    markerIcon: 'radio_button_unchecked',
    markerIconSize: 'text-[14px]',
    dayLabel: 'text-outline',
    chip: 'bg-error-container text-on-error-container',
    note: 'text-error',
    noteIcon: null,
  },
} as const satisfies Record<StepStatus, StepStatusStyle>

type ReminderTexts = Messages['treatment']['reminder']

/** "Set Alarm Reminder (07:00 AM)" or, once set, "Reminder Set for 07:00 AM ✓". */
export function reminderButtonLabel({ reminderSet, reminderTime }: TreatmentStep, texts: ReminderTexts): string {
  if (reminderSet) return reminderTime ? texts.activeAt(reminderTime) : texts.active
  return reminderTime ? texts.addAt(reminderTime) : texts.add
}

/** Confirmation after toggling a reminder; `step` is the step as it was before the toggle. */
export function reminderToggledMessage({ reminderSet, reminderTime }: TreatmentStep, texts: ReminderTexts): string {
  if (reminderSet) return texts.cancelled
  return reminderTime ? texts.addedAt(reminderTime) : texts.added
}

interface CertificationStyle {
  icon: string
  iconColor: string
  labelColor: string
  ratingBox: string
  ratingColor: string
}

/** Government-certified dealers are called out in green; other retailers stay neutral. */
export const CERTIFICATION_STYLES = {
  GOVT_CERTIFIED: {
    icon: 'verified',
    iconColor: 'text-primary',
    labelColor: 'text-primary',
    ratingBox: 'bg-secondary-container/30',
    ratingColor: 'text-on-secondary-container',
  },
  AUTHORIZED_RETAILER: {
    icon: 'storefront',
    iconColor: 'text-outline',
    labelColor: 'text-on-surface-variant',
    ratingBox: 'bg-surface-container',
    ratingColor: 'text-on-surface',
  },
} as const satisfies Record<DealerCertification, CertificationStyle>

/** From this many reviews on, the count reads "140+ reviews". */
const REVIEW_COUNT_PLUS_FROM = 100

export function reviewCountLabel(count: number, texts: Messages['treatment']['dealer']): string {
  return count >= REVIEW_COUNT_PLUS_FROM ? texts.reviewsPlus(count) : texts.reviews(count)
}

const PRICE_UNIT_SEPARATOR = ' / '

/**
 * Splits "₹280 / 500g" into the amount ("₹280") and the unit ("/ 500g"), which the design sets in a
 * lighter weight. Labels without a unit, such as "Spares Avail.", are all amount.
 */
export function splitPriceLabel(label: string): { amount: string; unit: string | null } {
  const at = label.indexOf(PRICE_UNIT_SEPARATOR)
  if (at === -1) return { amount: label, unit: null }
  return { amount: label.slice(0, at), unit: label.slice(at).trimStart() }
}

const GOOGLE_MAPS_DIRECTIONS_URL = 'https://www.google.com/maps/dir/'

/** Google Maps directions from the farmer's current location to the dealer's shop. */
export function directionsUrl({ name, address }: AgroDealer): string {
  const query = new URLSearchParams({ api: '1', destination: `${name}, ${address}` })
  return `${GOOGLE_MAPS_DIRECTIONS_URL}?${query}`
}

/** The closest dealer, whose "Get Route" is the list's primary action. */
export function nearestDealerId(dealers: readonly AgroDealer[]): number | undefined {
  let nearest: AgroDealer | undefined
  for (const dealer of dealers) {
    if (!nearest || dealer.distanceKm < nearest.distanceKm) nearest = dealer
  }
  return nearest?.id
}
