import type { BookingStatus, LanguageCode, LocalizedText, OwnerBooking, OwnerBookingDetail } from '../lib/types'

/** The booking-request filters, in the order the chips show them; null shows every booking. */
export const BOOKING_FILTERS: readonly (BookingStatus | null)[] = [
  null,
  'REQUESTED',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'DECLINED',
  'CANCELLED',
]

/** Search param holding the bookings filter; the dashboard links to `/owner/bookings?status=REQUESTED`. */
export const STATUS_PARAM = 'status'

const STATUSES: ReadonlySet<string> = new Set(BOOKING_FILTERS.filter((status) => status !== null))

/** `?status=` as a booking status, or null (show all) for anything else. */
export function parseStatusFilter(value: string | null): BookingStatus | null {
  return value !== null && STATUSES.has(value) ? (value as BookingStatus) : null
}

/** `bookings` with `updated` in place of the booking it updates. */
export function withBooking(bookings: readonly OwnerBooking[], updated: OwnerBookingDetail): OwnerBooking[] {
  return bookings.map((booking) => (booking.id === updated.id ? updated : booking))
}

/** An owner's own text in the active language, or in English when it has no translation. */
export function inLanguage(text: LocalizedText, lang: LanguageCode): string {
  return (lang === 'en' ? null : text[lang]) ?? text.en
}

/** A text being edited in three languages; blank translations are sent as null. */
export interface LocalizedDraft {
  en: string
  mr: string
  hi: string
}

export const EMPTY_DRAFT: LocalizedDraft = { en: '', mr: '', hi: '' }

export function toDraft(text: LocalizedText | null): LocalizedDraft {
  return { en: text?.en ?? '', mr: text?.mr ?? '', hi: text?.hi ?? '' }
}

/** The draft as the API takes it: trimmed, with blank translations as null. */
export function fromDraft(draft: LocalizedDraft): LocalizedText {
  return { en: draft.en.trim(), mr: draft.mr.trim() || null, hi: draft.hi.trim() || null }
}

/** An optional text: null when even its English is blank. */
export function fromOptionalDraft(draft: LocalizedDraft): LocalizedText | null {
  return draft.en.trim() ? fromDraft(draft) : null
}
