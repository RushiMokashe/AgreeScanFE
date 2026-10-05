import { useI18n } from '../../i18n/i18n-context'
import type { MessageSelector } from '../../i18n/translation'
import type { ProductCategory } from '../../lib/types'
import { FilterChip } from './FilterChip'

interface StoreFilter {
  /** Null shows every department. */
  category: ProductCategory | null
  label: MessageSelector
  icon: string
  iconTone: string
}

const FILTERS: readonly StoreFilter[] = [
  { category: null, label: (t) => t.store.filters.all, icon: 'apps', iconTone: '' },
  {
    category: 'CROP_MEDICINE',
    label: (t) => t.store.filters.cropMedicine,
    icon: 'prescriptions',
    iconTone: 'text-error',
  },
  { category: 'SEEDS', label: (t) => t.store.filters.seeds, icon: 'grain', iconTone: 'text-secondary' },
  { category: 'TOOLS', label: (t) => t.store.filters.tools, icon: 'handyman', iconTone: 'text-outline' },
  { category: 'DAIRY', label: (t) => t.store.filters.dairy, icon: 'cruelty_free', iconTone: 'text-primary' },
]

/** Prescriptions are crop medicines, so that chip carries the count of prescribed items. */
const RX_CATEGORY: ProductCategory = 'CROP_MEDICINE'

interface FilterChipsProps {
  selected: ProductCategory | null
  rxCount: number
  onSelect: (category: ProductCategory | null) => void
}

/** Horizontally scrolling department filters for the product list. */
export function FilterChips({ selected, rxCount, onSelect }: FilterChipsProps) {
  const { t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t.store.filters.label}
      className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 -mx-margin px-margin"
    >
      {FILTERS.map(({ category, label, icon, iconTone }) => (
        <FilterChip
          key={category ?? 'ALL'}
          label={label(t)}
          icon={icon}
          iconTone={iconTone}
          count={category === RX_CATEGORY ? rxCount : 0}
          selected={category === selected}
          onSelect={() => onSelect(category)}
        />
      ))}
    </div>
  )
}
