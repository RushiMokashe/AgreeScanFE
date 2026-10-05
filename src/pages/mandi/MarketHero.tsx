import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { MandiMarket, PriceForecast } from '../../lib/types'
import { ForecastCard } from './ForecastCard'

interface MarketHeroProps {
  market: MandiMarket
  forecast: PriceForecast
}

/** Market photo with trading status, the selected mandi, today's arrivals and the AI forecast. */
export function MarketHero({ market, forecast }: MarketHeroProps) {
  const { t } = useI18n()
  const format = useFormat()
  const toast = useToast()

  return (
    <section className="relative w-full bg-surface-container-low pb-space-md">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover object-center"
          alt={t.mandi.market.photoAlt(market.name)}
          src={market.imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent" />
        <div className="absolute top-space-sm left-margin right-margin flex items-center justify-between gap-space-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface shadow-sm font-label-sm text-label-sm">
            <span className={`w-2 h-2 rounded-full ${market.open ? 'bg-primary animate-pulse' : 'bg-outline'}`} />
            <span>{market.statusLabel}</span>
          </span>
          <button
            type="button"
            aria-label={t.mandi.market.select(market.shortName)}
            onClick={() => toast.show(t.mandi.market.moreSoon, 'info')}
            className="inline-flex items-center gap-1 min-h-[44px] px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm shadow-sm active:bg-secondary-container"
          >
            <Icon name="location_on" className="text-[16px]" />
            <span>{market.shortName}</span>
            <Icon name="expand_more" className="text-[16px]" />
          </button>
        </div>
        <div className="absolute bottom-3 left-margin right-margin text-inverse-on-surface flex items-end justify-between gap-space-xs">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed opacity-90">
              {market.boardLabel}
            </p>
            <h1 className="font-headline-sm text-headline-sm text-inverse-on-surface font-bold leading-tight">{market.name}</h1>
          </div>
          <div className="text-right bg-surface-container-lowest/20 backdrop-blur-md px-2.5 py-1.5 rounded-lg">
            <span className="font-label-sm text-label-sm text-inverse-on-surface/80 block">
              {t.mandi.market.arrivals}
            </span>
            <span className="font-title-md text-title-md font-bold text-inverse-on-surface whitespace-nowrap">
              {t.mandi.units.quintals(format.number(market.arrivalsQuintals))}
            </span>
          </div>
        </div>
      </div>
      <ForecastCard forecast={forecast} />
    </section>
  )
}
