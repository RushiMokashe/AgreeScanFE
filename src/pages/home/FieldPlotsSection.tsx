import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import type { FieldPlot } from '../../lib/types'
import { PlotCard } from './PlotCard'

interface FieldPlotsSectionProps {
  plots: FieldPlot[]
}

/** "My Field Plots": one card per plot. */
export function FieldPlotsSection({ plots }: FieldPlotsSectionProps) {
  const { t } = useI18n()
  const toast = useToast()

  return (
    <section className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{t.home.plots.title}</h3>
          <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center font-bold">
            {plots.length}
          </span>
        </div>
        <button
          className="min-h-[44px] font-label-md text-label-md text-secondary font-bold flex items-center gap-0.5"
          type="button"
          onClick={() => toast.show(t.home.plots.comingSoon, 'info')}
        >
          <span>{t.nav.screens.plots}</span>
          <Icon name="chevron_right" className="text-[18px]" />
        </button>
      </div>
      <div className="flex flex-col gap-space-sm">
        {plots.length === 0 && (
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.home.plots.empty}</p>
        )}
        {plots.map((plot) => (
          <PlotCard key={plot.id} plot={plot} />
        ))}
      </div>
    </section>
  )
}
