import { Icon } from '../../components/Icon'
import type { ProductCategory, StoreCategory } from '../../lib/types'
import { DEPARTMENT_STYLES } from './store-utils'

interface DepartmentCardProps {
  department: StoreCategory
  onSelect: (category: ProductCategory) => void
}

/** A department tile; choosing it filters the product list to that department. */
export function DepartmentCard({ department, onSelect }: DepartmentCardProps) {
  const { category, title, localTitle, description, icon, badge } = department
  const style = DEPARTMENT_STYLES[category]

  return (
    // A button may only hold phrasing content, hence spans where the design has divs, h4 and p
    <button
      type="button"
      onClick={() => onSelect(category)}
      className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm active:bg-surface-container-low transition-colors flex flex-col justify-between text-left group"
    >
      <span className="flex items-start justify-between">
        <span
          className={`w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center ${style.icon} group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-colors`}
        >
          <Icon name={icon} className="text-[28px]" />
        </span>
        <span className={`font-label-sm text-label-sm font-bold ${style.badge} px-2 py-0.5 rounded-full`}>{badge}</span>
      </span>
      <span className="block mt-3">
        <span className="block font-title-md text-title-md font-bold text-on-surface leading-tight">{title}</span>
        <span className="block font-label-sm text-label-sm text-secondary font-semibold">{localTitle}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">{description}</span>
      </span>
    </button>
  )
}
