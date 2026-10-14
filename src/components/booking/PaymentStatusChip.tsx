import { useI18n } from '../../i18n/i18n-context'
import type { BookingPaymentStatus } from '../../lib/types'
import { Icon } from '../Icon'
import { PAYMENT_STATUS_STYLES } from './booking-styles'

/** Whether a booking was paid online, as a small chip. */
export function PaymentStatusChip({ status }: { status: BookingPaymentStatus }) {
  const { t } = useI18n()
  const { icon, tone } = PAYMENT_STATUS_STYLES[status]

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-label-sm text-label-sm ${tone}`}>
      <Icon name={icon} className="text-[14px]" />
      {t.bookings.payment[status]}
    </span>
  )
}
