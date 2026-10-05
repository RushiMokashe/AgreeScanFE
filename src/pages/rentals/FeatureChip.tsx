import { Icon } from '../../components/Icon'
import type { RentalFeature } from '../../lib/types'

interface FeatureChipProps {
  feature: RentalFeature
  /** Icon colour, which alternates between transport cards. */
  iconTone: string
}

/** A transport perk such as "Solapur APMC Direct Entry Pass". */
export function FeatureChip({ feature, iconTone }: FeatureChipProps) {
  return (
    <span className="bg-surface-container text-on-surface font-label-sm text-[11px] px-2 py-1 rounded flex items-center gap-1">
      <Icon name={feature.icon} className={`text-[14px] ${iconTone}`} />
      {feature.text}
    </span>
  )
}
