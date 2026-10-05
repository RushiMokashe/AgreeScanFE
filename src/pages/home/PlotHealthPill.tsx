import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { PlotHealth } from '../../lib/types'
import { PLOT_HEALTH_PILL } from './home-utils'

interface PlotHealthPillProps {
  health: PlotHealth
}

/** Status pill in the corner of a plot card: Action Needed / Moderate Risk / Healthy. */
export function PlotHealthPill({ health }: PlotHealthPillProps) {
  const { t } = useI18n()
  const pill = PLOT_HEALTH_PILL[health]

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold flex-shrink-0 ${pill.className}`}
    >
      <Icon name={pill.icon} fill={pill.fill} className="text-[14px]" />
      {t.home.plots.health[health]}
    </span>
  )
}
