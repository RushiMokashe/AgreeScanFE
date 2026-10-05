import type { RentalListing } from '../../lib/types'
import { OPERATOR_STRIP_STYLES, alternate } from './rentals-utils'

interface OperatorStripProps {
  listing: RentalListing
  /** Position of the card in its list; avatar colours alternate. */
  toneIndex: number
}

/** Who runs the machine or vehicle, their track record, and when it is available. */
export function OperatorStrip({ listing, toneIndex }: OperatorStripProps) {
  const { operator, availability, availabilityHighlighted } = listing
  const style = OPERATOR_STRIP_STYLES[listing.category]
  const pill = style.availability

  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-container-low">
      <div className="flex items-center gap-2 min-w-0">
        <div
          aria-hidden="true"
          className={`${style.avatar} ${alternate(style.avatarTones, toneIndex)} rounded-full flex items-center justify-center font-bold text-label-sm flex-shrink-0`}
        >
          {operator.initials}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-label-md text-label-md text-on-surface font-semibold">{operator.name}</span>
          <span className={`font-label-sm ${style.stats} text-on-surface-variant`}>{operator.stats}</span>
        </div>
      </div>
      <span
        className={`text-right font-label-sm px-2 py-0.5 rounded-full ${pill.base} ${
          availabilityHighlighted ? pill.highlighted : pill.plain
        }`}
      >
        {availability}
      </span>
    </div>
  )
}
