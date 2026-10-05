import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { TreatmentPlan } from '../../lib/types'
import { TimelineStep } from './TimelineStep'
import { useStepActions } from './useStepActions'

interface ProtocolTimelineProps {
  plan: TreatmentPlan
  /** Receives the updated plan returned by a step action. */
  onPlanChange: (plan: TreatmentPlan) => void
}

/** Day-by-day protocol with reminders, and the check-up photo that verifies recovery. */
export function ProtocolTimeline({ plan, onPlanChange }: ProtocolTimelineProps) {
  const { t } = useI18n()
  const { pending, completeStep, toggleReminder } = useStepActions(plan.id, onPlanChange)

  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <Icon name="calendar_month" className="text-primary text-[22px]" />
          <h2 className="font-title-md text-title-md text-on-surface font-bold">
            {t.treatment.timeline.title(plan.durationDays)}
          </h2>
        </div>
        <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-space-xs py-0.5 rounded">
          {t.treatment.timeline.timeZone}
        </span>
      </div>
      <div className="relative pl-6">
        <div className="absolute left-[11px] top-3 bottom-6 w-0.5 bg-outline-variant" />
        <ol className="flex flex-col gap-space-lg">
          {plan.steps.map((step) => (
            <TimelineStep
              key={step.id}
              step={step}
              busy={pending !== null}
              pendingAction={pending?.stepId === step.id ? pending.action : undefined}
              onToggleReminder={toggleReminder}
              onComplete={completeStep}
            />
          ))}
        </ol>
      </div>
      <div className="pt-space-xs">
        <Link
          to="/scan"
          className="w-full min-h-[52px] bg-primary text-on-primary rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-space-sm shadow-md active:bg-primary-container active:scale-95 transition-all"
        >
          <Icon name="add_a_photo" className="text-[24px]" />
          <span>{t.treatment.timeline.checkupPhoto}</span>
        </Link>
        <p className="font-label-sm text-label-sm text-center text-on-surface-variant mt-1.5">
          {t.treatment.timeline.checkupHint}
        </p>
      </div>
    </section>
  )
}
