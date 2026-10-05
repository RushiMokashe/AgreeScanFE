import { LANGUAGES } from '../i18n/languages'

/**
 * Numbers, money, times and dates for one locale, with Latin digits and Indian grouping in every language.
 * Components use the active language's formatter: `const format = useFormat()` (src/i18n/useFormat.ts).
 * Relative texts are in their mid-sentence form ("yesterday", "3 hours ago"), ready to go inside a message.
 */
export interface Formatter {
  /** 8450 -> "8,450", 1234567 -> "12,34,567" (rounded to a whole number) */
  number: (value: number) => string
  /** 1850 -> "₹1,850" */
  inr: (value: number) => string
  /** 2.5 -> "2.5", 4 -> "4.0" (acreage always has one decimal) */
  acres: (value: number) => string
  /** ISO instant -> "04:30 PM" */
  clock: (iso: string) => string
  /** ISO instant -> "now", "4 minutes ago", "3 hours ago", "yesterday", "3 days ago" */
  timeAgo: (iso: string, now?: Date) => string
  /** ISO instant -> "today 09:10 AM", "yesterday 04:30 PM", "3 days ago" */
  dayAndTime: (iso: string, now?: Date) => string
  /** ISO date ("2026-09-29") or instant -> "29 Sept 2026" */
  date: (value: string) => string
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** A calendar date, which `new Date()` would read as midnight UTC (the day before, west of Greenwich). */
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

function toDate(value: string): Date {
  const match = ISO_DATE.exec(value)
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value)
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/** Whole calendar days from `then` to `now` (0 = same day, 1 = yesterday). */
function calendarDaysBetween(then: Date, now: Date): number {
  return Math.round((startOfDay(now) - startOfDay(then)) / DAY)
}

function createFormatter(locale: string): Formatter {
  const wholeNumber = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
  const oneDecimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: true })
  const calendarDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' })
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  const number = (value: number) => wholeNumber.format(value)
  // AM/PM in capitals in every language, like the times the server sends ("07:00 AM").
  const clock = (iso: string) =>
    time
      .formatToParts(new Date(iso))
      .map((part) => (part.type === 'dayPeriod' ? part.value.toUpperCase() : part.value))
      .join('')

  return {
    number,
    // Built on the number format: Intl's rupee pattern drops the Indian grouping for Marathi.
    inr: (value) => (value < 0 ? `-₹${number(-value)}` : `₹${number(value)}`),
    acres: (value) => oneDecimal.format(value),
    clock,
    timeAgo: (iso, now = new Date()) => {
      const then = new Date(iso)
      const elapsed = now.getTime() - then.getTime()
      if (elapsed < MINUTE) return relative.format(0, 'second')
      if (elapsed < HOUR) return relative.format(-Math.floor(elapsed / MINUTE), 'minute')
      const days = calendarDaysBetween(then, now)
      return days === 0 ? relative.format(-Math.floor(elapsed / HOUR), 'hour') : relative.format(-days, 'day')
    },
    dayAndTime: (iso, now = new Date()) => {
      const days = calendarDaysBetween(new Date(iso), now)
      const day = relative.format(-days, 'day')
      return days > 1 ? day : `${day} ${clock(iso)}`
    },
    date: (value) => calendarDate.format(toDate(value)),
  }
}

const formatters = new Map<string, Formatter>()

/** The formatter for an Intl locale, created once. */
export function formatterFor(locale: string): Formatter {
  let formatter = formatters.get(locale)
  if (!formatter) {
    formatter = createFormatter(locale)
    formatters.set(locale, formatter)
  }
  return formatter
}

/** Milliseconds -> "08:42:15" (clamped at zero; the same in every language) */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

// English-only helpers kept for the phase-1 screens until their agents localize them.
const english = formatterFor(LANGUAGES.en.locale)

/** @deprecated English only: use `useFormat().number`. */
export const formatNumber = english.number
/** @deprecated English only: use `useFormat().inr`. */
export const formatInr = english.inr
/** @deprecated English only: use `useFormat().acres`. */
export const formatAcres = english.acres
/** @deprecated English only: use `useFormat().clock`. */
export const formatClock = english.clock
/** @deprecated English only: use `useFormat().timeAgo`. */
export const timeAgo = english.timeAgo
/** @deprecated English only: use `useFormat().dayAndTime`. */
export const formatDayAndTime = english.dayAndTime
