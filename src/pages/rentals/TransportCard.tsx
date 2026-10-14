import { Icon } from '../../components/Icon'
import type { RentalListing } from '../../lib/types'
import { FeatureChip } from './FeatureChip'
import { OperatorStrip } from './OperatorStrip'
import { RentalActions } from './RentalActions'
import { RentalRate } from './RentalRate'
import { TRANSPORT_TONES, alternate } from './rentals-utils'

/** Tile icon for a vehicle listed without one of its own. */
const DEFAULT_VEHICLE_ICON = 'local_shipping'

interface TransportCardProps {
  listing: RentalListing
  /** Position of the card in its list; tile, feature icon and avatar colours alternate. */
  toneIndex: number
  onBook: (listing: RentalListing) => void
}

/** A tempo or truck for mandi runs: capacity, per-km fare, perks, driver, and call / dispatch actions. */
export function TransportCard({ listing, toneIndex, onBook }: TransportCardProps) {
  const { name, description, icon, features } = listing
  const tone = alternate(TRANSPORT_TONES, toneIndex)

  return (
    <article className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-space-md flex flex-col gap-space-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-12 h-12 rounded-xl ${tone.tile} flex items-center justify-center flex-shrink-0`}>
              <Icon name={icon ?? DEFAULT_VEHICLE_ICON} className="text-[28px]" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-title-md text-title-md text-on-surface font-bold leading-none">{name}</h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{description}</span>
            </div>
          </div>
          <RentalRate listing={listing} />
        </div>
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-0.5">
            {features.map((feature) => (
              <FeatureChip key={feature.text} feature={feature} iconTone={tone.featureIcon} />
            ))}
          </div>
        )}
        <OperatorStrip listing={listing} toneIndex={toneIndex} />
        <RentalActions listing={listing} onBook={onBook} />
      </div>
    </article>
  )
}
