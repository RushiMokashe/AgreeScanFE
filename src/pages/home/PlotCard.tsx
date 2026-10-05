import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { FieldPlot } from '../../lib/types'
import { diagnosisPath } from './home-utils'
import { PlotHealthPill } from './PlotHealthPill'
import { PlotMetricTile } from './PlotMetricTile'

interface PlotCardProps {
  plot: FieldPlot
}

/** A field plot with its health pill, metrics and, when something is due, the pending action. */
export function PlotCard({ plot }: PlotCardProps) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <article className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          {plot.imageUrl ? (
            <img
              alt={t.home.plots.photoAlt(plot.crop, plot.fieldName)}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-surface-container"
              src={plot.imageUrl}
            />
          ) : (
            <div className="w-14 h-14 rounded-lg flex-shrink-0 bg-surface-container flex items-center justify-center text-primary">
              <Icon name="grass" className="text-[28px]" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-title-md text-title-md font-bold text-on-surface truncate">
                {plot.code}: {plot.crop}
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {plot.variety} ({t.home.plots.area(format.acres(plot.areaAcres))})
            </span>
          </div>
        </div>
        <PlotHealthPill health={plot.health} />
      </div>
      <dl className="grid grid-cols-2 gap-space-xs pt-1">
        {plot.metrics.map((metric) => (
          <PlotMetricTile key={metric.label} metric={metric} />
        ))}
      </dl>
      {plot.pendingAction && (
        <div className="flex items-center justify-between pt-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <Icon name="notification_important" className="text-[16px] text-error" />
            {plot.pendingAction}
          </span>
          <Link
            aria-label={t.home.plots.reviewTreatment(plot.crop)}
            className="min-h-[44px] px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center gap-1 active:scale-95 transition-transform"
            to={diagnosisPath(plot.latestScanId)}
          >
            <span>{t.home.plots.viewSolution}</span>
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      )}
    </article>
  )
}
