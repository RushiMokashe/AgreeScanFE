import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { AgroDealer } from '../../lib/types'
import { CERTIFICATION_STYLES, directionsUrl, reviewCountLabel, splitPriceLabel } from './treatment-utils'

interface DealerCardProps {
  dealer: AgroDealer
  /** The nearest stockist gets the primary "Get Route" button. */
  nearest: boolean
}

/** A stockist with its certification, rating, live stock and call / route actions. */
export function DealerCard({ dealer, nearest }: DealerCardProps) {
  const { t } = useI18n()
  const { name, certification, distanceKm, address, rating, reviewCount, phone, stock } = dealer
  const certificationStyle = CERTIFICATION_STYLES[certification]
  const price = splitPriceLabel(stock.priceLabel)

  return (
    <article className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <Icon name={certificationStyle.icon} className={`${certificationStyle.iconColor} text-[18px]`} />
            <span
              className={`font-label-sm text-label-sm ${certificationStyle.labelColor} font-bold uppercase tracking-wider`}
            >
              {t.treatment.dealer.certification[certification]}
            </span>
          </div>
          <h3 className="font-title-md text-title-md font-bold text-on-surface truncate">{name}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
            <Icon name="location_on" className="text-[16px] text-outline" />
            {t.treatment.dealer.distance(distanceKm, address)}
          </p>
        </div>
        <div className={`flex flex-col items-end flex-shrink-0 ${certificationStyle.ratingBox} px-space-xs py-1 rounded`}>
          <div className={`flex items-center gap-0.5 ${certificationStyle.ratingColor} font-label-md text-label-md font-bold`}>
            <span>{rating.toFixed(1)}</span>
            <Icon name="star" fill className="text-[16px] text-primary" />
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {reviewCountLabel(reviewCount, t.treatment.dealer)}
          </span>
        </div>
      </div>
      <div className="bg-secondary-container/25 rounded-lg p-space-sm flex flex-col gap-1">
        <div className="flex items-center justify-between gap-space-xs">
          <span className="font-label-sm text-label-sm font-bold text-primary flex items-center gap-1">
            <Icon name="check_circle" className="text-[16px]" />
            {stock.headline}
          </span>
          <span className="font-label-md text-label-md font-bold text-on-surface">
            {price.amount}
            {price.unit && (
              <span className="ml-1 font-body-sm text-body-sm font-normal text-on-surface-variant">{price.unit}</span>
            )}
          </span>
        </div>
        <p className="font-body-sm text-body-sm font-semibold text-on-surface">{stock.detail}</p>
        <span className="font-label-sm text-label-sm text-on-surface-variant">{stock.note}</span>
      </div>
      <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
        <a
          href={`tel:${phone}`}
          aria-label={t.treatment.dealer.callLabel(name)}
          className="min-h-[48px] rounded-lg bg-surface-container text-primary active:bg-surface-container-high flex items-center justify-center gap-space-xs font-label-lg text-label-lg transition-colors"
        >
          <Icon name="phone" className="text-[20px]" />
          <span>{t.treatment.dealer.call}</span>
        </a>
        <a
          href={directionsUrl(dealer)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.treatment.dealer.routeLabel(name)}
          className={`min-h-[48px] rounded-lg flex items-center justify-center gap-space-xs font-label-lg text-label-lg transition-colors ${
            nearest
              ? 'bg-primary text-on-primary active:bg-primary-container shadow-sm'
              : 'bg-surface-container-high text-on-surface active:bg-surface-dim'
          }`}
        >
          <Icon name="directions" className="text-[20px]" />
          <span>{t.treatment.dealer.route}</span>
        </a>
      </div>
    </article>
  )
}
