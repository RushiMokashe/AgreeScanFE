import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { CHECKBOX_CLASSES } from '../../components/form/field-styles'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { inLanguage } from '../../lib/localized-draft'
import type { ProductCategory, ShopProduct } from '../../lib/types'
import { apiUrl } from '../../platform/api-base'

/** The tile of a product without a photo. */
const CATEGORY_ICONS: Record<ProductCategory, string> = {
  CROP_MEDICINE: 'vaccines',
  SEEDS: 'spa',
  TOOLS: 'agriculture',
  DAIRY: 'pets',
}

interface ShopProductCardProps {
  product: ShopProduct
  /** The stock switch is being saved. */
  switching: boolean
  onToggleStock: (product: ShopProduct) => void
}

/** One of the shop's products: photo, name, pack, price and MRP, an in-stock switch, and a link to edit it. */
export function ShopProductCard({ product, switching, onToggleStock }: ShopProductCardProps) {
  const { t, lang } = useI18n()
  const format = useFormat()
  const texts = t.shop.products
  const name = inLanguage(product.name, lang)
  const packSize = product.packSize && inLanguage(product.packSize, lang)

  return (
    <li className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex gap-space-sm">
        {product.imageUrl ? (
          <img
            src={apiUrl(product.imageUrl)}
            alt=""
            className="h-20 w-20 flex-shrink-0 rounded-lg bg-surface-container-high object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
            <Icon name={CATEGORY_ICONS[product.category]} className="text-[32px]" />
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <span className="font-title-md text-title-md font-bold text-on-surface line-clamp-2">{name}</span>
          {packSize && <span className="font-body-sm text-body-sm text-on-surface-variant">{packSize}</span>}
          <span className="mt-auto flex items-baseline gap-space-xs">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">{format.inr(product.price)}</span>
            {product.mrp !== null && product.mrp > product.price && (
              <span className="font-label-sm text-label-sm text-on-surface-variant line-through">
                {texts.mrp(format.inr(product.mrp))}
              </span>
            )}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-space-sm border-t border-surface-container-high pt-space-sm">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-space-xs">
          <input
            type="checkbox"
            role="switch"
            checked={product.inStock}
            disabled={switching}
            aria-label={texts.stockLabel(name)}
            onChange={() => onToggleStock(product)}
            className={`h-5 w-5 ${CHECKBOX_CLASSES}`}
          />
          <span
            className={`font-label-md text-label-md ${product.inStock ? 'font-bold text-secondary' : 'text-error'}`}
          >
            {product.inStock ? texts.inStock : texts.outOfStock}
          </span>
        </label>
        <Link
          to={`/shop/products/${product.id}`}
          aria-label={texts.edit(name)}
          className="flex min-h-[44px] items-center gap-1 rounded-lg px-space-sm font-label-md text-label-md text-primary active:bg-surface-container"
        >
          <Icon name="edit" className="text-[18px]" />
          {texts.editButton}
        </Link>
      </div>
    </li>
  )
}
