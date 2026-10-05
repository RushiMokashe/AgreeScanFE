import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { Product } from '../../lib/types'
import { FlashDealCountdown } from './FlashDealCountdown'
import { ProductList } from './ProductList'

interface FlashDealsProps {
  /** ISO instant the deals end. */
  endsAt: string
  products: Product[]
  onAdd: (productId: number) => Promise<boolean>
}

/** "Depot Flash Deals" with its countdown: what the store shows before any filter is applied. */
export function FlashDeals({ endsAt, products, onAdd }: FlashDealsProps) {
  const { t } = useI18n()

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Icon name="local_fire_department" className="text-error text-[20px]" />
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-none">
            {t.store.flashDeals.title}
          </h2>
        </div>
        <FlashDealCountdown endsAt={endsAt} />
      </div>
      <ProductList products={products} onAdd={onAdd} />
    </>
  )
}
