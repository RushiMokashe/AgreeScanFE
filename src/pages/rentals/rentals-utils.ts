import type { Messages } from '../../i18n/translation'
import type { RateUnit, RentalCategory, RentalListing, RentalSpotlight, RentalsOverview } from '../../lib/types'

/** The two lists behind the segment switcher. */
export type RentalTab = 'machinery' | 'transport'

/** Search param holding the open tab; the Mandi screen links to `/rentals?tab=transport`. */
export const RENTAL_TAB_PARAM = 'tab'

/** `?tab=transport` opens the transport list; anything else (or nothing) opens machinery. */
export function parseRentalTab(value: string | null): RentalTab {
  return value === 'transport' ? 'transport' : 'machinery'
}

export function rentalTabId(tab: RentalTab): string {
  return `rental-tab-${tab}`
}

export function rentalPanelId(tab: RentalTab): string {
  return `rental-panel-${tab}`
}

/** What the booking sheet books: a listing card's vehicle or the spotlight's. */
export interface BookingTarget {
  listingId: number
  name: string
  rate: number
  rateUnit: RateUnit
  /** Charged once per trip by fare-based transport (the spotlight's pickup); 0 for everything else. */
  baseFare: number
  /** The slot the sheet starts with: the vehicle's next available one. */
  slot: string
}

/** A booking's estimate when the farmer does not change it: the same defaults the server applies. */
export const DEFAULT_UNITS = { HOUR: 2, KM: 15, DAY: 1 } as const satisfies Record<RateUnit, number>

/** The largest estimate and the longest slot text a booking may have. */
export const MAX_UNITS = 500
export const MAX_SLOT_LENGTH = 80

export function listingTarget(listing: RentalListing): BookingTarget {
  return {
    listingId: listing.id,
    name: listing.name,
    rate: listing.rate,
    rateUnit: listing.rateUnit,
    baseFare: 0,
    slot: listing.availability,
  }
}

export function spotlightTarget(spotlight: RentalSpotlight, slot: string): BookingTarget {
  return {
    listingId: spotlight.listingId,
    name: spotlight.title,
    rate: spotlight.perKmRate,
    rateUnit: 'KM',
    baseFare: spotlight.baseFare,
    slot,
  }
}

/** What a booking of `units` comes to, as the server prices it: rate × units, plus any base fare. */
export function bookingAmount(target: BookingTarget, units: number): number {
  return target.rate * units + target.baseFare
}

/** The typed estimate as a whole number of units, or null when it is not one the server accepts. */
export function parseUnits(text: string): number | null {
  const units = Number(text)
  return Number.isInteger(units) && units >= 1 && units <= MAX_UNITS ? units : null
}

interface OperatorStripStyle {
  avatar: string
  /** Avatar colours, alternating down the list. */
  avatarTones: readonly string[]
  stats: string
  /** Availability pill: classes it always has, plus its colours when highlighted or not. */
  availability: { base: string; highlighted: string; plain: string }
}

/** The design styles the operator strip slightly differently on machinery and transport cards. */
export const OPERATOR_STRIP_STYLES = {
  MACHINERY: {
    avatar: 'w-8 h-8',
    avatarTones: ['bg-primary text-on-primary', 'bg-secondary text-on-secondary'],
    stats: 'text-[11px]',
    availability: {
      base: 'text-[10px] font-bold',
      highlighted: 'bg-secondary-container text-on-secondary-container',
      plain: 'bg-surface-container-high text-on-surface',
    },
  },
  TRANSPORT: {
    avatar: 'w-7 h-7',
    avatarTones: ['bg-primary-container text-on-primary', 'bg-secondary-container text-on-secondary-container'],
    stats: 'text-[10px]',
    availability: {
      base: 'text-[11px]',
      highlighted: 'bg-secondary-container text-secondary font-bold',
      plain: 'bg-surface-container-high text-on-surface-variant',
    },
  },
} as const satisfies Record<RentalCategory, OperatorStripStyle>

interface TransportTone {
  tile: string
  featureIcon: string
}

/** Transport cards alternate the colours of their icon tile and feature icons down the list. */
export const TRANSPORT_TONES = [
  { tile: 'bg-secondary-container text-on-secondary-container', featureIcon: 'text-primary' },
  { tile: 'bg-tertiary-container text-on-tertiary-container', featureIcon: 'text-secondary' },
] as const satisfies readonly TransportTone[]

/** The option for the card at `index` in a list that cycles through `options`. */
export function alternate<T>(options: readonly T[], index: number): T {
  return options[index % options.length]
}

/** The design marks the "verified" badge in secondary green and every other badge in tertiary. */
export function badgeIconTone(icon: string): string {
  return icon === 'verified' ? 'text-secondary' : 'text-tertiary'
}

/** "2.4 km away • Kem Shivar", or whichever half is known; null when neither is. */
export function distanceLabel({ distanceKm, locality }: RentalListing, t: Messages): string | null {
  const distance = distanceKm === null ? null : t.rentals.distanceAway(distanceKm)
  const parts = [distance, locality].filter((part) => part !== null)
  return parts.length > 0 ? parts.join(' • ') : null
}

/** The overview with `listing` in place of the listing it updates. */
export function withListing(overview: RentalsOverview, listing: RentalListing): RentalsOverview {
  return {
    ...overview,
    listings: overview.listings.map((current) => (current.id === listing.id ? listing : current)),
  }
}
