import { Icon } from '../../components/Icon'
import { RichText } from '../../components/RichText'
import { useI18n } from '../../i18n/i18n-context'
import type { PriceForecast } from '../../lib/types'

interface ForecastCardProps {
  forecast: PriceForecast
}

/** AI price outlook, overlapping the bottom edge of the market hero. */
export function ForecastCard({ forecast }: ForecastCardProps) {
  const { t } = useI18n()

  return (
    <div className="mx-margin -mt-3 relative z-10 p-space-sm rounded-xl bg-surface-container-lowest shadow-md flex items-start gap-space-sm">
      <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 text-on-secondary-container">
        <Icon name="trending_up" className="text-[20px]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-label-sm text-label-sm uppercase text-secondary font-bold">
            {t.mandi.market.forecast}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          <span className="font-label-sm text-label-sm text-on-surface-variant">{forecast.tag}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
          <RichText text={forecast.message} strongClassName="font-bold text-primary" />
        </p>
      </div>
    </div>
  )
}
