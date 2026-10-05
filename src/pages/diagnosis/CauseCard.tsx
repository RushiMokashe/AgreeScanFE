import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'

interface CauseCardProps {
  cause: string
  /** e.g. "27°C with 86% leaf wetness" */
  climateTrigger: string | null
}

/** "Why This Happened": the cause of the disease and the field climate that triggered it. */
export function CauseCard({ cause, climateTrigger }: CauseCardProps) {
  const { t } = useI18n()

  return (
    <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-2.5">
      <div className="flex items-center gap-2 text-primary">
        <Icon name="psychology_alt" className="text-[22px]" />
        <h3 className="font-title-md text-title-md font-bold text-on-surface">{t.diagnosis.cause.title}</h3>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{cause}</p>
      {climateTrigger && (
        <div className="flex items-center gap-2 pt-1 text-on-surface-variant font-label-sm text-label-sm">
          <Icon name="thermostat" className="text-secondary text-[16px]" />
          <span>{t.diagnosis.cause.climateTrigger(climateTrigger)}</span>
        </div>
      )}
    </section>
  )
}
