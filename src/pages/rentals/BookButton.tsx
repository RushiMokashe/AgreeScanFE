import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { BOOK_BUTTON_TONES, type BookingStatus } from './rentals-utils'

interface BookButtonProps {
  label: string
  icon: string
  status: BookingStatus
  onBook: () => void
  /** Put the icon after the label ("Book Tempo →") instead of before it. */
  iconAfter?: boolean
  /** Padding and gap, which differ between the spotlight hero and the listing cards. */
  className?: string
}

/** Books a rental; shows a spinner while the booking is sent and a confirmed "Booked" state after. */
export function BookButton({ label, icon, status, onBook, iconAfter = false, className = '' }: BookButtonProps) {
  const { t } = useI18n()
  const statusIcon = status === 'booked' ? 'check_circle' : status === 'pending' ? 'progress_activity' : icon
  const iconElement = (
    <Icon
      name={statusIcon}
      fill={status === 'booked'}
      className={`text-[18px] ${status === 'pending' ? 'animate-spin' : ''}`}
    />
  )

  return (
    <button
      type="button"
      disabled={status !== 'idle'}
      aria-busy={status === 'pending'}
      onClick={onBook}
      className={`min-h-[48px] rounded-lg font-label-md text-label-md flex items-center justify-center ${BOOK_BUTTON_TONES[status]} ${className}`}
    >
      {!iconAfter && iconElement}
      <span>{status === 'booked' ? t.rentals.booking.booked : label}</span>
      {iconAfter && iconElement}
    </button>
  )
}
