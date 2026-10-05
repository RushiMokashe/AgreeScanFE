import { Icon } from '../../components/Icon'

interface TrustPillarProps {
  icon: string
  /** Colours of the icon tile. */
  tone: string
  title: string
  description: string
}

/** One pillar of the Kisan Suraksha Promise. */
export function TrustPillar({ icon, tone, title, description }: TrustPillarProps) {
  return (
    <li className="flex items-start gap-3 bg-surface-container-lowest p-3 rounded-xl shadow-xs">
      <div className={`w-8 h-8 rounded-lg ${tone} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon name={icon} className="text-[18px]" />
      </div>
      <div>
        <h3 className="font-label-lg text-label-lg font-bold text-on-surface">{title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{description}</p>
      </div>
    </li>
  )
}
