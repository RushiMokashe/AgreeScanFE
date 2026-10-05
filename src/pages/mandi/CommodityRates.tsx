import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { CommodityPrice } from '../../lib/types'
import { CommodityTile } from './CommodityTile'

interface CommodityRatesProps {
  commodities: CommodityPrice[]
  /** ISO instant of the last price update. */
  updatedAt: string
}

/** Two-column board of today's wholesale rates. */
export function CommodityRates({ commodities, updatedAt }: CommodityRatesProps) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <section className="px-margin pt-space-lg">
      <div className="flex items-center justify-between mb-space-sm">
        <div className="flex items-center gap-1.5">
          <Icon name="grid_view" className="text-primary text-[20px]" />
          <h2 className="font-title-md text-title-md text-on-surface font-bold">{t.mandi.rates.title}</h2>
        </div>
        <time dateTime={updatedAt} className="font-label-sm text-label-sm text-on-surface-variant">
          {t.mandi.rates.updated(format.timeAgo(updatedAt))}
        </time>
      </div>
      <div className="grid grid-cols-2 gap-space-sm">
        {commodities.map((commodity) => (
          <CommodityTile key={commodity.id} commodity={commodity} />
        ))}
      </div>
    </section>
  )
}
