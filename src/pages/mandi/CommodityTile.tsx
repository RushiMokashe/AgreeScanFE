import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { CommodityPrice } from '../../lib/types'
import { DEMAND_STYLES, priceChange, priceRangeLabel } from './mandi-utils'

interface CommodityTileProps {
  commodity: CommodityPrice
}

/** Wholesale price band of one commodity, with its demand level and change since the last session. */
export function CommodityTile({ commodity }: CommodityTileProps) {
  const { t } = useI18n()
  const format = useFormat()
  const { category, name, grade, minPrice, maxPrice, unit, changeAmount, demand } = commodity
  const demandStyle = DEMAND_STYLES[demand]
  const change = priceChange(format, changeAmount)

  return (
    <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between gap-1">
        <div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">{category}</span>
          <h3 className="font-title-md text-title-md text-on-surface font-bold">{name}</h3>
          <span className="font-label-sm text-label-sm text-on-surface-variant">{grade}</span>
        </div>
        <span className={`px-1.5 py-0.5 rounded ${demandStyle.badge} font-label-sm text-[10px] font-bold`}>
          {t.mandi.rates.demand[demand]}
        </span>
      </div>
      <div className="mt-space-sm pt-space-xs">
        <div className={`font-headline-sm text-headline-sm font-bold ${demandStyle.price}`}>
          {priceRangeLabel(format, minPrice, maxPrice)}
        </div>
        <div className="flex items-center justify-between text-label-sm font-label-sm mt-0.5">
          <span className="text-on-surface-variant">{t.mandi.rates.perUnit(unit)}</span>
          <span className={`${change.className} flex items-center`}>
            <Icon name={change.icon} className="text-[14px]" />
            {change.label}
          </span>
        </div>
      </div>
    </div>
  )
}
