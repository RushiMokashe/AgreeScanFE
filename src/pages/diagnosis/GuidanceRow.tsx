import type { ReactNode } from 'react'
import { Icon } from '../../components/Icon'

interface GuidanceRowProps {
  icon: string
  title: string
  /** Safety-critical guidance (the withholding period) is shown in the error colour. */
  critical?: boolean
  children: ReactNode
}

/** Icon-led instruction under the dosage grid, e.g. "Application Window". */
export function GuidanceRow({ icon, title, critical = false, children }: GuidanceRowProps) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon name={icon} className={`text-[20px] mt-0.5 flex-shrink-0 ${critical ? 'text-error' : 'text-secondary'}`} />
      <div className="flex flex-col">
        <span className={`font-label-md text-label-md font-bold ${critical ? 'text-error' : 'text-on-surface'}`}>
          {title}
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">{children}</span>
      </div>
    </div>
  )
}
