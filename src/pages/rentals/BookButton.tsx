import { Icon } from '../../components/Icon'

interface BookButtonProps {
  label: string
  icon: string
  onBook: () => void
  /** Put the icon after the label ("Book Tempo →") instead of before it. */
  iconAfter?: boolean
  /** Padding and gap, which differ between the spotlight hero and the listing cards. */
  className?: string
}

/** Opens the booking sheet for a rental. */
export function BookButton({ label, icon, onBook, iconAfter = false, className = '' }: BookButtonProps) {
  const iconElement = <Icon name={icon} className="text-[18px]" />

  return (
    <button
      type="button"
      onClick={onBook}
      className={`min-h-[48px] rounded-lg bg-primary text-on-primary shadow-sm font-label-md text-label-md flex items-center justify-center active:bg-primary-container ${className}`}
    >
      {!iconAfter && iconElement}
      <span>{label}</span>
      {iconAfter && iconElement}
    </button>
  )
}
