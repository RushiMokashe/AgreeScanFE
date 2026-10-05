/** Indian mobile numbers: accounts store the 10-digit national number ("9876543210"). */
export const PHONE_DIGITS = 10

/** India's calling code, shown in front of phone fields and numbers. */
export const COUNTRY_CODE = '+91'

const NATIONAL_NUMBER = new RegExp(`^\\d{${PHONE_DIGITS}}$`)

/** What people type or paste before the national number: international, country or trunk prefixes. */
const DIALING_PREFIXES = ['0091', '091', '91', '0']

export function isValidPhone(phone: string): boolean {
  return NATIONAL_NUMBER.test(phone)
}

/**
 * What a phone field keeps of the typed or pasted text: its digits, without a dialing prefix that accounts
 * for exactly the extra digits ("+91 98765 43210" -> "9876543210"), otherwise cut to ten digits.
 */
export function toNationalNumber(input: string): string {
  const digits = input.replace(/\D/g, '')
  const prefix = DIALING_PREFIXES.find(
    (candidate) => digits.length === candidate.length + PHONE_DIGITS && digits.startsWith(candidate),
  )
  return prefix ? digits.slice(prefix.length) : digits.slice(0, PHONE_DIGITS)
}

/** "9876543210" -> "+91 98765 43210" (anything else is returned unchanged). */
export function formatPhone(phone: string): string {
  if (!isValidPhone(phone)) return phone
  const half = PHONE_DIGITS / 2
  return `${COUNTRY_CODE} ${phone.slice(0, half)} ${phone.slice(half)}`
}
