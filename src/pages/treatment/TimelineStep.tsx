import { Icon } from '../../components/Icon'
import { RichText } from '../../components/RichText'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { TreatmentStep } from '../../lib/types'
import { StepActions } from './StepActions'
import { STEP_STATUS_STYLES } from './treatment-utils'
import type { StepAction } from './useStepActions'

interface TimelineStepProps {
  step: TreatmentStep
  /** A step action is in flight somewhere in the plan. */
  busy: boolean
  /** The action in flight on this step, if any. */
  pendingAction?: StepAction
  onToggleReminder: (step: TreatmentStep) => void
  onComplete: (step: TreatmentStep) => void
}

const CHIP_CLASS = 'font-label-sm text-label-sm px-space-xs py-0.5 font-bold'

/** One day of the protocol, drawn in its status's variant; only the next step is actionable. */
export function TimelineStep({ step, busy, pendingAction, onToggleReminder, onComplete }: TimelineStepProps) {
  const { t } = useI18n()
  const format = useFormat()
  const style = STEP_STATUS_STYLES[step.status]

  return (
    <li className="relative flex flex-col gap-space-xs">
      <span
        className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${style.marker}`}
      >
        <Icon name={style.markerIcon} className={style.markerIconSize} />
      </span>
      <div className="flex items-center justify-between gap-space-xs">
        <span className={`font-label-md text-label-md font-bold ${style.dayLabel}`}>
          {t.treatment.timeline.day(step.dayNumber, step.dayLabel)}
        </span>
        {step.status === 'COMPLETED' ? (
          <span className={`${CHIP_CLASS} rounded-full flex items-center gap-1 ${style.chip}`}>
            <Icon name="done_all" className="text-[14px]" />
            {step.completedAt
              ? t.treatment.timeline.completedAt(format.clock(step.completedAt))
              : t.treatment.timeline.completed}
          </span>
        ) : (
          step.badge && <span className={`${CHIP_CLASS} rounded ${style.chip}`}>{step.badge}</span>
        )}
      </div>
      <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1">
        <h3 className="font-title-md text-title-md font-bold text-on-surface">{step.title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          <RichText text={step.detail} />
        </p>
        {step.note && (
          <p className={`font-label-sm text-label-sm ${style.note}`}>
            {style.noteIcon && <Icon name={style.noteIcon} className="text-[16px]" />}
            {step.note}
          </p>
        )}
        {step.status === 'UPCOMING' && (
          <StepActions
            step={step}
            busy={busy}
            pendingAction={pendingAction}
            onToggleReminder={onToggleReminder}
            onComplete={onComplete}
          />
        )}
      </div>
    </li>
  )
}
