import { Icon } from '../../components/Icon'

/** The design's setActiveFilter() classes for the selected chip and the others. */
const CHIP_CLASSES = {
  selected:
    'min-h-[44px] px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5 flex-shrink-0 shadow-sm',
  unselected:
    'min-h-[44px] px-3.5 py-2 rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md flex items-center gap-1.5 flex-shrink-0 active:bg-surface-container-high transition-colors',
}

interface FilterChipProps {
  label: string
  icon: string
  /** Icon colour while the chip is not selected; a selected chip's icon takes the chip's text colour. */
  iconTone: string
  /** Red count badge, hidden at zero. */
  count: number
  selected: boolean
  onSelect: () => void
}

/** A department filter chip. */
export function FilterChip({ label, icon, iconTone, count, selected, onSelect }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={selected ? CHIP_CLASSES.selected : CHIP_CLASSES.unselected}
    >
      <Icon name={icon} className={`text-[18px] ${selected ? '' : iconTone}`} />
      <span>{label}</span>
      {count > 0 && (
        <span className="w-5 h-5 rounded-full bg-error text-on-error font-label-sm text-label-sm flex items-center justify-center ml-0.5">
          {count}
        </span>
      )}
    </button>
  )
}
