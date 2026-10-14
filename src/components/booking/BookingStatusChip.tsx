import { useI18n } from '../../i18n/i18n-context'
import type { BookingStatus } from '../../lib/types'
import { Icon } from '../Icon'
import { BOOKING_STATUS_STYLES } from './booking-styles'

/** A booking's status as a small chip, e.g. a truck and "On the way". */
export function BookingStatusChip({ status }: { status: BookingStatus }) {
  const { t } = useI18n()
  const { icon, tone } = BOOKING_STATUS_STYLES[status]

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-label-sm text-label-sm font-bold ${tone}`}>
      <Icon name={icon} className="text-[14px]" />
      {t.bookings.status[status]}
    </span>
  )
}
