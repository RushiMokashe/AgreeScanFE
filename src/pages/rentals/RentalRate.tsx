import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { RentalListing } from '../../lib/types'

interface RentalRateProps {
  listing: RentalListing
}

/** "₹650/hr" with its note: highlighted ("With Diesel + Driver") or plain ("or ₹2,800/Day"). */
export function RentalRate({ listing }: RentalRateProps) {
  const { t } = useI18n()
  const format = useFormat()
  const { rate, rateUnit, rateNote, rateNoteHighlighted } = listing

  return (
    <div className="text-right flex-shrink-0">
      <div className="font-headline-sm text-headline-sm text-primary font-bold">
        {format.inr(rate)}
        <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">
          {t.rentals.rateUnits[rateUnit]}
        </span>
      </div>
      {rateNote && (
        <span
          className={`block font-label-sm text-[10px] ${rateNoteHighlighted ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}
        >
          {rateNote}
        </span>
      )}
    </div>
  )
}
