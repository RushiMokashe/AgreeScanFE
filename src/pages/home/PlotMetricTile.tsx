import type { PlotMetric } from '../../lib/types'
import { METRIC_VALUE_CLASS } from './home-utils'

interface PlotMetricTileProps {
  metric: PlotMetric
}

/** Label/value tile of a plot card, e.g. "Harvest Cycle" / "12 days left". Rendered inside a <dl>. */
export function PlotMetricTile({ metric }: PlotMetricTileProps) {
  return (
    <div className="flex flex-col p-2 rounded-lg bg-surface-container-low">
      <dt className="font-label-sm text-label-sm text-on-surface-variant">{metric.label}</dt>
      <dd className={`font-title-md text-title-md font-bold ${METRIC_VALUE_CLASS[metric.tone]}`}>{metric.value}</dd>
    </div>
  )
}
