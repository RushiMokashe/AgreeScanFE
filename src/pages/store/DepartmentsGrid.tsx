import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import type { ProductCategory, StoreCategory } from '../../lib/types'
import { DepartmentCard } from './DepartmentCard'

interface DepartmentsGridProps {
  categories: StoreCategory[]
  onSelect: (category: ProductCategory) => void
}

/** The store's departments; choosing one filters the product list. */
export function DepartmentsGrid({ categories, onSelect }: DepartmentsGridProps) {
  const { t } = useI18n()
  const toast = useToast()

  return (
    <section className="px-margin mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-none">
          {t.store.departments.title}
        </h2>
        <button
          type="button"
          onClick={() => toast.show(t.store.departments.catalogComingSoon, 'info')}
          className="min-h-[44px] font-label-md text-label-md text-secondary font-bold flex items-center gap-0.5"
        >
          <span>{t.store.departments.viewCatalog}</span>
          <Icon name="chevron_right" className="text-[16px]" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((department) => (
          <DepartmentCard key={department.category} department={department} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
