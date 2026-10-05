import type { Ref } from 'react'
import type { Product, ProductCategory } from '../../lib/types'
import { FlashDeals } from './FlashDeals'
import { SearchResults } from './SearchResults'

interface ProductsSectionProps {
  /** Lets the page scroll the section into view when a department is chosen. */
  ref: Ref<HTMLElement>
  category: ProductCategory | null
  searchTerm: string
  flashDealEndsAt: string
  flashDeals: Product[]
  onAdd: (productId: number) => Promise<boolean>
  onClearFilters: () => void
}

/** The depot's flash deals, or, once a department or search is chosen, the matching products. */
export function ProductsSection({
  ref,
  category,
  searchTerm,
  flashDealEndsAt,
  flashDeals,
  onAdd,
  onClearFilters,
}: ProductsSectionProps) {
  const filtered = category !== null || searchTerm !== ''

  return (
    // scroll-mt clears the fixed app header when scrolled into view
    <section ref={ref} className="px-margin mt-6 scroll-mt-20">
      {filtered ? (
        <SearchResults category={category} searchTerm={searchTerm} onAdd={onAdd} onClearFilters={onClearFilters} />
      ) : (
        <FlashDeals endsAt={flashDealEndsAt} products={flashDeals} onAdd={onAdd} />
      )}
    </section>
  )
}
