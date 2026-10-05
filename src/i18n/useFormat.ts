import { formatterFor, type Formatter } from '../lib/format'
import { useI18n } from './i18n-context'

/** Numbers, rupees, times and dates in the active language: `useFormat().inr(1850)` -> "₹1,850". */
export function useFormat(): Formatter {
  return formatterFor(useI18n().language.locale)
}
