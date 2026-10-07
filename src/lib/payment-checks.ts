/**
 * Shaping and checking what people type into payment and shop forms. Each format* function keeps a field in its proper
 * shape while typing (digits only, spaced card number, "MM/YY"); each check* function names what is still wrong, or
 * returns undefined when the value is fine. The form turns the problem into a message in the app's language.
 */

/** The card networks India's cards run on, told apart by their first digits. */
export type CardBrand = 'VISA' | 'MASTERCARD' | 'RUPAY' | 'AMEX'

/** First digits of each network; RuPay's ranges are checked before Visa's and Mastercard's broader ones. */
const BRAND_PREFIXES: readonly (readonly [CardBrand, RegExp])[] = [
  ['AMEX', /^3[47]/],
  ['RUPAY', /^(60|65|81|82|508|353|356)/],
  ['MASTERCARD', /^(5[1-5]|2[2-7])/],
  ['VISA', /^4/],
]

/** How many digits a card of each network has. */
const CARD_LENGTHS: Record<CardBrand, readonly number[]> = {
  VISA: [13, 16, 19],
  MASTERCARD: [16],
  RUPAY: [16],
  AMEX: [15],
}
/** Any card number has 12 to 19 digits (ISO/IEC 7812). */
const MIN_CARD_DIGITS = 12
const MAX_CARD_DIGITS = 19

/** Cards are not issued for more than this many years ahead. */
const MAX_EXPIRY_YEARS_AHEAD = 20

function digitsOf(text: string): string {
  return text.replace(/\D/g, '')
}

export function cardBrand(cardNumber: string): CardBrand | undefined {
  const digits = digitsOf(cardNumber)
  return BRAND_PREFIXES.find(([, prefix]) => prefix.test(digits))?.[0]
}

function maxDigits(brand: CardBrand | undefined): number {
  return brand ? Math.max(...CARD_LENGTHS[brand]) : MAX_CARD_DIGITS
}

/** "4111111111111111" → "4111 1111 1111 1111"; an Amex card is grouped 4-6-5. Letters are dropped. */
export function formatCardNumber(input: string): string {
  const brand = cardBrand(input)
  const digits = digitsOf(input).slice(0, maxDigits(brand))
  if (brand === 'AMEX') {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10)].filter(Boolean).join(' ')
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

/** The Luhn checksum every real card number passes; it catches most typing mistakes. */
function passesLuhn(digits: string): boolean {
  let sum = 0
  for (let index = 0; index < digits.length; index++) {
    let digit = Number(digits[digits.length - 1 - index])
    if (index % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

export type CardNumberProblem = 'required' | 'incomplete' | 'invalid'

export function checkCardNumber(cardNumber: string): CardNumberProblem | undefined {
  const digits = digitsOf(cardNumber)
  if (!digits) return 'required'
  const brand = cardBrand(digits)
  const complete = brand ? CARD_LENGTHS[brand].includes(digits.length) : digits.length >= MIN_CARD_DIGITS
  if (!complete) return 'incomplete'
  return passesLuhn(digits) ? undefined : 'invalid'
}

/**
 * Keeps the expiry as "MM/YY": digits only, the slash added after the month while typing forward, and a lone first
 * digit above 1 read as a month ("5" → "05/"). Deleting the slash with backspace works as usual.
 */
export function formatExpiry(input: string, previous: string): string {
  let digits = digitsOf(input).slice(0, 4)
  if (digits.length === 1 && Number(digits) > 1) digits = `0${digits}`
  const typingForward = input.length > previous.length
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  if (digits.length === 2 && typingForward) return `${digits}/`
  return digits
}

export type ExpiryProblem = 'required' | 'incomplete' | 'month' | 'expired' | 'tooFar'

/** A card is valid until the end of its expiry month. */
export function checkExpiry(expiry: string, now: Date = new Date()): ExpiryProblem | undefined {
  const digits = digitsOf(expiry)
  if (!digits) return 'required'
  if (digits.length < 4) return 'incomplete'
  const month = Number(digits.slice(0, 2))
  if (month < 1 || month > 12) return 'month'
  const year = 2000 + Number(digits.slice(2, 4))
  const monthsFromNow = (year - now.getFullYear()) * 12 + (month - (now.getMonth() + 1))
  if (monthsFromNow < 0) return 'expired'
  return monthsFromNow > MAX_EXPIRY_YEARS_AHEAD * 12 ? 'tooFar' : undefined
}

/** Amex prints a 4-digit code on the front; the others a 3-digit code on the back. */
export function cvcLength(brand: CardBrand | undefined): number {
  return brand === 'AMEX' ? 4 : 3
}

export function formatCvc(input: string, brand: CardBrand | undefined): string {
  return digitsOf(input).slice(0, cvcLength(brand))
}

export type CvcProblem = 'required' | 'incomplete'

export function checkCvc(cvc: string, brand: CardBrand | undefined): CvcProblem | undefined {
  if (!cvc) return 'required'
  return cvc.length === cvcLength(brand) ? undefined : 'incomplete'
}

/** "name@bank", as every UPI app shows it. */
const UPI_ID = /^[\w.-]{2,256}@[a-zA-Z][a-zA-Z0-9]{1,64}$/

export type UpiIdProblem = 'required' | 'invalid'

export function checkUpiId(upiId: string): UpiIdProblem | undefined {
  const trimmed = upiId.trim()
  if (!trimmed) return 'required'
  return UPI_ID.test(trimmed) ? undefined : 'invalid'
}

/** A UPI transaction ID (UTR / RRN), as the UPI app shows it after paying: 12 digits. */
export const UPI_REFERENCE_LENGTH = 12

export function formatUpiReference(input: string): string {
  return digitsOf(input).slice(0, UPI_REFERENCE_LENGTH)
}

export type UpiReferenceProblem = 'required' | 'incomplete'

export function checkUpiReference(reference: string): UpiReferenceProblem | undefined {
  if (!reference) return 'required'
  return reference.length === UPI_REFERENCE_LENGTH ? undefined : 'incomplete'
}

/** The EAN-13 barcode on a product pack: 13 digits, the last one a check digit. */
export const EAN13_LENGTH = 13

export type BarcodeProblem = 'incomplete' | 'invalid'

/** An optional barcode: blank is fine; otherwise 13 digits whose check digit matches. */
export function checkBarcode(barcode: string): BarcodeProblem | undefined {
  const digits = barcode.trim()
  if (!digits) return undefined
  if (!/^\d{13}$/.test(digits)) return 'incomplete'
  const sum = [...digits.slice(0, 12)].reduce((total, digit, index) => total + Number(digit) * (index % 2 ? 3 : 1), 0)
  return (10 - (sum % 10)) % 10 === Number(digits[12]) ? undefined : 'invalid'
}
