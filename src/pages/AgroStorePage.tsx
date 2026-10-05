import { useRef, useState } from 'react'
import { ErrorState, LoadingState } from '../components/PageState'
import { useApi } from '../hooks/useApi'
import { useI18n } from '../i18n/i18n-context'
import { api } from '../lib/api'
import type { ProductCategory } from '../lib/types'
import { CartBar } from './store/CartBar'
import { CartSheet } from './store/CartSheet'
import { DepartmentsGrid } from './store/DepartmentsGrid'
import { DepotStatus } from './store/DepotStatus'
import { FilterChips } from './store/FilterChips'
import { KisanPromise } from './store/KisanPromise'
import { ProductsSection } from './store/ProductsSection'
import { RxBundleBanner } from './store/RxBundleBanner'
import { StoreSearch } from './store/StoreSearch'
import { isInCart, scrollBehavior } from './store/store-utils'
import { useCart } from './store/useCart'
import { useProductFilter } from './store/useProductFilter'
import { useTimedFlag } from './store/useTimedFlag'

/** How long the cart bar pops after an add (the design's updateCartUI animation). */
const CART_BUMP_MS = 200

/**
 * Stitch screen "Kisan Agro Store & Animal Supplies": the prescribed Rx bundle, departments, the depot's
 * flash deals (or search results), and a floating cart with Cash-on-Delivery checkout.
 */
export default function AgroStorePage() {
  const { t } = useI18n()
  const store = useApi(() => api.store())
  const cart = useCart()
  const filter = useProductFilter()
  const [cartOpen, setCartOpen] = useState(false)
  const [cartBumped, bumpCart] = useTimedFlag(CART_BUMP_MS)
  const productsRef = useRef<HTMLElement>(null)

  const loadError = store.error ?? cart.error
  if (loadError) {
    const retry = () => {
      if (store.error) store.reload()
      if (cart.error) cart.reload()
    }
    return <ErrorState error={loadError} onRetry={retry} />
  }
  if (!store.data || !cart.data) return <LoadingState label={t.store.loading} />

  const { depotName, open, deliveryLabel, rxBundle, rxCount, categories, flashDealEndsAt, flashDeals } = store.data

  const addToCart = async (productId: number) => {
    const added = await cart.add(productId)
    if (added) bumpCart()
    return added
  }

  const showDepartment = (category: ProductCategory) => {
    filter.setCategory(category)
    productsRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
  }

  return (
    <div className="flex flex-col w-full pb-6">
      <div className="px-margin pt-2 pb-3 bg-surface">
        <DepotStatus depotName={depotName} open={open} deliveryLabel={deliveryLabel} />
        <StoreSearch query={filter.query} onQueryChange={filter.setQuery} />
        <FilterChips selected={filter.category} rxCount={rxCount} onSelect={filter.setCategory} />
      </div>
      {rxBundle && (
        <RxBundleBanner bundle={rxBundle} inCart={isInCart(cart.data, rxBundle.productId)} onAdd={addToCart} />
      )}
      <DepartmentsGrid categories={categories} onSelect={showDepartment} />
      <ProductsSection
        ref={productsRef}
        category={filter.category}
        searchTerm={filter.searchTerm}
        flashDealEndsAt={flashDealEndsAt}
        flashDeals={flashDeals}
        onAdd={addToCart}
        onClearFilters={filter.clear}
      />
      <KisanPromise />
      {cart.data.itemCount > 0 && (
        <CartBar
          cart={cart.data}
          lastAdded={cart.lastAdded}
          bumped={cartBumped}
          onViewCart={() => setCartOpen(true)}
        />
      )}
      {cartOpen && (
        <CartSheet
          cart={cart.data}
          onRemove={cart.remove}
          onCheckout={cart.checkout}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  )
}
