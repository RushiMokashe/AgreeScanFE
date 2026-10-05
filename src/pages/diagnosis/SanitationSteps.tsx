import { Icon } from '../../components/Icon'
import { SanitationStep } from './SanitationStep'

interface SanitationStepsProps {
  /** "Field Sanitation Steps", or "Preventive Care Tips" for a healthy crop. */
  title: string
  steps: string[]
}

/** Numbered cultural-control steps that go with the prescription. */
export function SanitationSteps({ title, steps }: SanitationStepsProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-2 text-on-surface">
        <Icon name="yard" className="text-primary text-[22px]" />
        <h3 className="font-title-md text-title-md font-bold">{title}</h3>
      </div>
      <ol className="flex flex-col gap-2.5">
        {steps.map((step, index) => (
          <SanitationStep key={step} number={index + 1} text={step} />
        ))}
      </ol>
    </section>
  )
}
