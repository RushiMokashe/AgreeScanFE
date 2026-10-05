import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { TreatmentStep } from '../../lib/types'
import { reminderButtonLabel } from './treatment-utils'
import type { StepAction } from './useStepActions'

interface StepActionsProps {
  step: TreatmentStep
  /** A step action is in flight somewhere in the plan. */
  busy: boolean
  /** The action in flight on this step, if any. */
  pendingAction?: StepAction
  onToggleReminder: (step: TreatmentStep) => void
  onComplete: (step: TreatmentStep) => void
}

/** Controls of the next step: the design's reminder toggle, plus a quieter "Mark as Done". */
export function StepActions({ step, busy, pendingAction, onToggleReminder, onComplete }: StepActionsProps) {
  const { t } = useI18n()

  return (
    <>
      <button
        type="button"
        disabled={busy}
        aria-busy={pendingAction === 'reminder'}
        onClick={() => onToggleReminder(step)}
        className={`mt-space-xs min-h-[44px] w-full active:bg-secondary-container font-label-md text-label-md rounded-lg flex items-center justify-center gap-space-xs transition-colors disabled:opacity-60 ${
          step.reminderSet ? 'bg-secondary-container text-on-secondary-container font-bold' : 'bg-surface-container text-primary'
        }`}
      >
        <Icon name="alarm_add" className="text-[18px]" />
        <span>{reminderButtonLabel(step, t.treatment.reminder)}</span>
      </button>
      <button
        type="button"
        disabled={busy}
        aria-busy={pendingAction === 'complete'}
        onClick={() => onComplete(step)}
        className="self-center min-h-[44px] px-space-md rounded-lg border border-outline-variant text-on-surface-variant font-label-md text-label-md flex items-center gap-space-xs active:bg-surface-container transition-colors disabled:opacity-60"
      >
        <Icon name="task_alt" className="text-[18px]" />
        {t.treatment.step.markDone}
      </button>
    </>
  )
}
