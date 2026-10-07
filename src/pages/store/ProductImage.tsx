import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { Product } from '../../lib/types'
import { apiUrl } from '../../platform/api-base'
import { IMAGE_BADGE_TONES } from './store-utils'

interface ProductImageProps {
  product: Product
}

/** Product photo with its badges: an offer at the top; a seal and the star rating stacked at the bottom. */
export function ProductImage({ product }: ProductImageProps) {
  const { t } = useI18n()
  const { name, imageUrl, rating, imageBadge, imageBadgeTone } = product
  const ratingText = rating === null ? null : rating.toFixed(1)
  const badgeStyle = IMAGE_BADGE_TONES[imageBadgeTone]
  const badgeCorner = imageBadge ? badgeStyle.corner : null
  const badge = imageBadge && <span className={`rounded font-bold ${badgeStyle.className}`}>{imageBadge}</span>

  return (
    <div className="w-24 h-24 rounded-xl bg-surface-container-low relative flex-shrink-0 overflow-hidden">
      {imageUrl ? (
        <img className="w-full h-full object-cover" src={apiUrl(imageUrl)} alt={name} loading="lazy" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-primary">
          <Icon name="inventory_2" className="text-[36px]" />
        </div>
      )}
      {badgeCorner === 'top' && <div className="absolute top-1 left-1 flex">{badge}</div>}
      {(badgeCorner === 'bottom' || ratingText !== null) && (
        <div className="absolute bottom-1 left-1 flex flex-col items-start gap-0.5">
          {badgeCorner === 'bottom' && badge}
          {ratingText !== null && (
            <div className="bg-surface-container-lowest/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-primary flex items-center gap-0.5">
              <Icon name="star" fill className="text-[12px] text-amber-500" />
              <span aria-hidden="true">{ratingText}</span>
              <span className="sr-only">{t.store.product.rating(ratingText)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
