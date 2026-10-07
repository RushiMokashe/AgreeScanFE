import type { PaymentPurpose, PaymentStatusCode } from '../../lib/types'

/** Statuses after which a payment never changes again (a failed one is retried with a new payment). */
const FINAL_STATUSES: ReadonlySet<PaymentStatusCode> = new Set(['SUCCEEDED', 'FAILED', 'CANCELLED'])

export function isFinal(status: PaymentStatusCode): boolean {
  return FINAL_STATUSES.has(status)
}

export function resultPath(paymentId: number): string {
  return `/pay/${paymentId}/result`
}

/** Where the farmer sees what they paid for: My Orders, or the booking's tracking screen. */
export function paidItemPath(purpose: PaymentPurpose, referenceId: number): string {
  return purpose === 'STORE_ORDER' ? '/orders' : `/bookings/${referenceId}`
}

/** "4111 1111 1111 1111" -> "4111111111111111"; spaces and dashes are how people type card numbers. */
export function digitsOnly(text: string): string {
  return text.replace(/[\s-]/g, '')
}

const CARD_NUMBER = /^\d{12,19}$/
const EXPIRY = /^(0[1-9]|1[0-2])\/(\d{2})$/
const CVC = /^\d{3,4}$/
const UPI_ID = /^[\w.-]{2,256}@[a-zA-Z][a-zA-Z0-9]{1,64}$/

/** Whether `number` has the length of a card number and passes the Luhn check every card number passes. */
export function isCardNumber(number: string): boolean {
  if (!CARD_NUMBER.test(number)) return false
  let sum = 0
  for (let index = 0; index < number.length; index++) {
    let digit = Number(number[number.length - 1 - index])
    if (index % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

/** Whether `expiry` is "MM/YY" and not before the current month. */
export function isFutureExpiry(expiry: string, now: Date = new Date()): boolean {
  const match = EXPIRY.exec(expiry.trim())
  if (!match) return false
  const year = 2000 + Number(match[2])
  const month = Number(match[1])
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

export function isCvc(cvc: string): boolean {
  return CVC.test(cvc)
}

/** "name@bank", as every UPI app shows it. */
export function isUpiId(id: string): boolean {
  return UPI_ID.test(id.trim())
}
