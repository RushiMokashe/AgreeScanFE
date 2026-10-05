import type { KeyboardEvent } from 'react'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { MessageSelector } from '../../i18n/translation'
import { rentalPanelId, rentalTabId, type RentalTab } from './rentals-utils'

const TABS: readonly { id: RentalTab; label: MessageSelector; icon: string }[] = [
  { id: 'machinery', label: (t) => t.rentals.tabs.machinery, icon: 'agriculture' },
  { id: 'transport', label: (t) => t.rentals.tabs.transport, icon: 'local_shipping' },
]

/** The design's switchTab() classes for the selected and the other segment. */
const SEGMENT_CLASSES = {
  selected:
    'flex-1 py-2.5 px-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm transition-all',
  unselected:
    'flex-1 py-2.5 px-3 rounded-lg bg-transparent text-on-surface-variant font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all active:bg-surface-container-high',
}

const ARROW_KEY_STEPS: Partial<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 }

interface RentalTabsProps {
  selected: RentalTab
  onSelect: (tab: RentalTab) => void
}

/** Segment switcher between machinery and transport; a WAI-ARIA tab list, so arrow keys switch tabs. */
export function RentalTabs({ selected, onSelect }: RentalTabsProps) {
  const { t } = useI18n()

  const selectWithArrowKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = ARROW_KEY_STEPS[event.key]
    if (step === undefined) return
    event.preventDefault()
    const current = TABS.findIndex((tab) => tab.id === selected)
    const next = TABS[(current + step + TABS.length) % TABS.length]
    onSelect(next.id)
    document.getElementById(rentalTabId(next.id))?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={t.rentals.tabs.label}
      onKeyDown={selectWithArrowKeys}
      className="bg-surface-container-low p-1 rounded-xl flex items-center gap-1 shadow-inner"
    >
      {TABS.map(({ id, label, icon }) => {
        const isSelected = id === selected
        return (
          // min-w-0 lets a long label truncate; ::after stretches the tap target over the track's padding
          <button
            key={id}
            id={rentalTabId(id)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={rentalPanelId(id)}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(id)}
            className={`relative min-w-0 after:absolute after:inset-x-0 after:-inset-y-1 ${
              isSelected ? SEGMENT_CLASSES.selected : SEGMENT_CLASSES.unselected
            }`}
          >
            <Icon name={icon} className="text-[18px]" />
            <span className="truncate">{label(t)}</span>
          </button>
        )
      })}
    </div>
  )
}
