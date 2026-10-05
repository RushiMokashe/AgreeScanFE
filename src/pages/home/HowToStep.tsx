import { Icon } from '../../components/Icon'

interface HowToStepProps {
  number: number
  icon: string
  title: string
  description: string
}

/** One numbered step of the "How to use AgriScan" guide. */
export function HowToStep({ number, icon, title, description }: HowToStepProps) {
  return (
    <li className="flex items-start gap-2.5 bg-surface-container-lowest p-2.5 rounded-lg shadow-sm">
      <div
        aria-hidden="true"
        className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm flex-shrink-0 mt-0.5"
      >
        {number}
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <Icon name={icon} className="text-primary text-[18px]" />
          <span className="font-label-md text-label-md font-bold text-on-surface">{title}</span>
        </div>
        <p className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">{description}</p>
      </div>
    </li>
  )
}
