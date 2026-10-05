import { Icon } from '../../components/Icon'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api } from '../../lib/api'
import type { ProductCategory } from '../../lib/types'
import { ProductList } from './ProductList'

interface SearchResultsProps {
  category: ProductCategory | null
  searchTerm: string
  onAdd: (productId: number) => Promise<boolean>
  onClearFilters: () => void
}

/** Products matching the chosen department and search. */
export function SearchResults({ category, searchTerm, onAdd, onClearFilters }: SearchResultsProps) {
  const { t } = useI18n()
  const { data: products, error, reload } = useApi(
    () => api.products({ category: category ?? undefined, q: searchTerm }),
    [category, searchTerm],
  )

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!products) return <LoadingState label={t.store.results.loading} />

  return (
    <>
      <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-none mb-3">
        {t.store.results.found(products.length)}
      </h2>
      {products.length > 0 ? (
        <ProductList products={products} onAdd={onAdd} />
      ) : (
        <div className="flex flex-col items-center gap-space-sm rounded-2xl bg-surface-container-lowest p-space-lg text-center shadow-sm">
          <Icon name="search_off" className="text-[32px] text-outline" />
          <p className="font-title-md text-title-md font-bold text-on-surface">{t.store.results.empty}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.store.results.emptyHint}</p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-space-xs min-h-[44px] px-space-md rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold active:scale-95 transition-transform"
          >
            {t.store.results.clearFilters}
          </button>
        </div>
      )}
    </>
  )
}
