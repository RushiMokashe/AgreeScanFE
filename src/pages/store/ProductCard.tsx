import { useState } from 'react'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { Product } from '../../lib/types'
import { ProductImage } from './ProductImage'
import { FOOTER_TONES, STOCK_TONES, TAG_TONES } from './store-utils'

interface ProductCardProps {
  product: Product
  /** Adds the product to the cart; resolves to whether it was added. */
  onAdd: (productId: number) => Promise<boolean>
}

/** A depot product: photo, tag, price against MRP, stock, delivery note, and a one-tap "Add ₹480". */
export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { t } = useI18n()
  const format = useFormat()
  const [adding, setAdding] = useState(false)
  const { id, name, tag, tagTone, packSize, description, price, mrp, stockNote, stockTone } = product
  const footer = FOOTER_TONES[product.footerTone]
  const priceLabel = format.inr(price)

  const add = async () => {
    setAdding(true)
    await onAdd(id)
    setAdding(false)
  }

  return (
    <article className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm flex flex-col gap-3">
      <div className="flex gap-3">
        <ProductImage product={product} />
        <div className="flex flex-col justify-between flex-grow min-w-0">
          <div>
            {(tag || packSize) && (
              <div className="flex items-center gap-1.5">
                {tag && (
                  <span className={`px-2 py-0.5 rounded ${TAG_TONES[tagTone]} font-label-sm text-label-sm font-bold`}>
                    {tag}
                  </span>
                )}
                {packSize && <span className="font-label-sm text-label-sm text-on-surface-variant">{packSize}</span>}
              </div>
            )}
            <h3 className="font-title-md text-title-md font-bold text-on-surface mt-1 truncate">{name}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{description}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">{priceLabel}</span>
            {mrp !== null && mrp > price && (
              <span className="font-label-sm text-label-sm line-through text-on-surface-variant">{format.inr(mrp)}</span>
            )}
            <span className={`font-label-sm text-label-sm font-bold ${STOCK_TONES[stockTone]}`}>{stockNote}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-surface-container-high/60">
        <span className={`font-label-sm text-label-sm flex items-center gap-1 min-w-0 ${footer.text}`}>
          <Icon name={product.footerIcon} className={`text-[16px] ${footer.icon}`} />
          <span>{product.footerText}</span>
        </span>
        <button
          type="button"
          disabled={adding}
          aria-busy={adding}
          aria-label={t.store.product.addLabel(priceLabel, name)}
          onClick={add}
          className="min-h-[44px] px-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform disabled:opacity-70"
        >
          <Icon name={adding ? 'progress_activity' : 'add'} className={`text-[18px] ${adding ? 'animate-spin' : ''}`} />
          <span>{t.store.product.add(priceLabel)}</span>
        </button>
      </div>
    </article>
  )
}
