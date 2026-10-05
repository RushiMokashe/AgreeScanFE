import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { TreatmentPlan } from '../../lib/types'

interface TreatmentPlanBannerProps {
  plan: TreatmentPlan
}

/** Plan title, the disease it targets and the course progress. */
export function TreatmentPlanBanner({ plan }: TreatmentPlanBannerProps) {
  const { t } = useI18n()
  const { title, target, pathogen, completedSteps, totalSteps, progressPercent } = plan

  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-secondary-container/20 pointer-events-none" />
      <div className="flex items-center justify-between gap-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-error-container text-on-error-container">
            <Icon name="coronavirus" className="text-[18px]" />
          </span>
          <span className="font-label-sm text-label-sm text-error uppercase tracking-wider">
            {t.treatment.plan.outbreak}
          </span>
        </div>
        <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-space-sm py-0.5 rounded-full font-bold">
          {t.treatment.plan.stepsDone(completedSteps, totalSteps)}
        </span>
      </div>
      <div>
        <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">{title}</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
          <Icon name="eco" className="text-[16px] text-primary" />
          {t.treatment.plan.target} <strong className="font-bold text-on-surface">{target}</strong> ({pathogen})
        </p>
      </div>
      <div className="flex flex-col gap-1 mt-space-xs">
        <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span>{t.treatment.plan.progress}</span>
          <span className="font-bold text-primary">{t.treatment.plan.percentCompleted(progressPercent)}</span>
        </div>
        <div
          role="progressbar"
          aria-label={t.treatment.plan.progress}
          aria-valuenow={progressPercent}
          className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </section>
  )
}
