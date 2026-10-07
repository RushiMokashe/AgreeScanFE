import { Icon } from '../../components/Icon'
import { RichText } from '../../components/RichText'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { RentalSpotlight } from '../../lib/types'
import { BookButton } from './BookButton'
import { PerkTile } from './PerkTile'

interface SpotlightHeroProps {
  spotlight: RentalSpotlight
  onBook: (spotlight: RentalSpotlight) => void
}

/** "Mandi Harvest Express": the featured harvest pickup, its fare and perks, and one-tap booking. */
export function SpotlightHero({ spotlight, onBook }: SpotlightHeroProps) {
  const { t } = useI18n()
  const format = useFormat()
  const { title, subtitle, label, imageUrl, baseFare, perKmRate, dispatchMinutes, perks } = spotlight

  return (
    <div className="px-margin my-space-sm">
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md flex flex-col">
        <div className="relative w-full h-48 bg-surface-container-high">
          <img className="w-full h-full object-cover" src={imageUrl} alt={title} />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent" />
          <div className="absolute top-space-sm left-space-sm flex items-center gap-1.5 bg-primary-container/95 text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
            <span>{label}</span>
          </div>
          <div className="absolute bottom-space-sm left-space-sm right-space-sm text-on-primary flex items-end justify-between">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-surface font-bold leading-tight">{title}</span>
              <span className="font-body-sm text-body-sm text-surface-container-high">{subtitle}</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="font-label-sm text-[11px] text-surface-variant uppercase">
                {t.rentals.spotlight.fareStarts}
              </span>
              <span className="font-headline-sm text-headline-sm text-secondary-fixed font-bold leading-none">
                {format.inr(baseFare)} + {format.inr(perKmRate)}
                {/* nowrap keeps the unit whole, and lines never break before its slash: "₹22/km" stays together */}
                <span className="text-body-sm font-normal whitespace-nowrap">{t.rentals.rateUnits.KM}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="p-space-md flex flex-col gap-space-sm">
          <div className="grid grid-cols-3 gap-2">
            {perks.map((perk) => (
              <PerkTile key={perk.title} perk={perk} />
            ))}
          </div>
          <div className="flex items-center justify-between pt-space-xs">
            <div className="flex items-center gap-2">
              <Icon name="timer" className="text-secondary text-[18px]" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                <RichText text={t.rentals.spotlight.dispatch(dispatchMinutes)} />
              </span>
            </div>
            <BookButton
              label={t.rentals.spotlight.book}
              icon="arrow_forward"
              iconAfter
              onBook={() => onBook(spotlight)}
              className="px-space-md gap-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
