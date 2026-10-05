import { Icon } from '../../components/Icon'
import type { RentalPerk } from '../../lib/types'

interface PerkTileProps {
  perk: RentalPerk
}

/** One of the spotlight's trust badges, e.g. "Zero Spill / Tarpaulin Tied". */
export function PerkTile({ perk }: PerkTileProps) {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-low text-center">
      <Icon name={perk.icon} className="text-primary text-[20px] mb-0.5" />
      <span className="font-label-sm text-[11px] text-on-surface font-bold leading-tight">{perk.title}</span>
      <span className="font-label-sm text-[10px] text-on-surface-variant">{perk.subtitle}</span>
    </div>
  )
}
