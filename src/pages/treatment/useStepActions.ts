import { useState } from 'react'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { TreatmentPlan, TreatmentStep } from '../../lib/types'
import { reminderToggledMessage } from './treatment-utils'

export type StepAction = 'complete' | 'reminder'

interface PendingStepAction {
  stepId: number
  action: StepAction
}

/**
 * Completes steps and toggles their reminders. Both endpoints return the whole updated plan, which is
 * handed to `onPlanChange`. Callers disable every step control while `pending` is set, so only one
 * mutation is in flight and an older plan can never overwrite a newer one.
 */
export function useStepActions(planId: number, onPlanChange: (plan: TreatmentPlan) => void) {
  const { t } = useI18n()
  const toast = useToast()
  const [pending, setPending] = useState<PendingStepAction | null>(null)

  const run = async (step: TreatmentStep, action: StepAction) => {
    setPending({ stepId: step.id, action })
    try {
      if (action === 'complete') {
        onPlanChange(await api.completeTreatmentStep(planId, step.id))
        toast.show(t.treatment.step.markedDone(step.title))
      } else {
        onPlanChange(await api.toggleStepReminder(planId, step.id))
        toast.show(reminderToggledMessage(step, t.treatment.reminder))
      }
    } catch (error) {
      toast.show(describeError(error, t.treatment.step.updateFailed), 'error')
    } finally {
      setPending(null)
    }
  }

  return {
    pending,
    completeStep: (step: TreatmentStep) => run(step, 'complete'),
    toggleReminder: (step: TreatmentStep) => run(step, 'reminder'),
  }
}
