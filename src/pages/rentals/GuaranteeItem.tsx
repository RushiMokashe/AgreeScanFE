import { Icon } from '../../components/Icon'

interface GuaranteeItemProps {
  icon: string
  title: string
  description: string
}

/** One promise of the Kisan Protection card. */
export function GuaranteeItem({ icon, title, description }: GuaranteeItemProps) {
  return (
    <li className="flex items-start gap-2.5">
      <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon name={icon} className="text-[15px]" />
      </div>
      <div className="flex flex-col">
        <span className="font-label-md text-label-md text-on-surface font-bold">{title}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant leading-tight">{description}</span>
      </div>
    </li>
  )
}
