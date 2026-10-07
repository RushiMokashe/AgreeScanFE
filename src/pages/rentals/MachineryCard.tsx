import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { RentalListing } from '../../lib/types'
import { FavoriteButton } from './FavoriteButton'
import { OperatorStrip } from './OperatorStrip'
import { RentalActions } from './RentalActions'
import { RentalRate } from './RentalRate'
import { badgeIconTone, distanceLabel } from './rentals-utils'
import { SpecTile } from './SpecTile'

/** Tile icon for a machine listed without a photo or an icon of its own. */
const DEFAULT_MACHINE_ICON = 'agriculture'

interface MachineryCardProps {
  listing: RentalListing
  /** Position of the card in its list; operator avatars alternate colours. */
  toneIndex: number
  onBook: (listing: RentalListing) => void
  /** Id of the listing whose favourite toggle is in flight, if any. */
  favoritePendingId: number | null
  onToggleFavorite: (listing: RentalListing) => void
}

/** A tractor or implement for hire: photo, rate, operator, specs, and call / book actions. */
export function MachineryCard({
  listing,
  toneIndex,
  onBook,
  favoritePendingId,
  onToggleFavorite,
}: MachineryCardProps) {
  const { t } = useI18n()
  const { name, description, imageUrl, badge, badgeIcon, specs } = listing
  const distance = distanceLabel(listing, t)

  return (
    <article className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="relative w-full h-44 bg-surface-container-high">
        {imageUrl ? (
          <img className="w-full h-full object-cover" src={imageUrl} alt={name} loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary-container/60 text-on-secondary-container">
            <Icon name={listing.icon ?? DEFAULT_MACHINE_ICON} className="text-[72px]" />
          </div>
        )}
        {badge && (
          <div className="absolute top-3 left-3 bg-surface-container-lowest/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-primary font-label-sm text-label-sm font-bold shadow-sm flex items-center gap-1">
            {badgeIcon && <Icon name={badgeIcon} className={`text-[16px] ${badgeIconTone(badgeIcon)}`} />}
            <span>{badge}</span>
          </div>
        )}
        <FavoriteButton
          listing={listing}
          busy={favoritePendingId !== null}
          pending={favoritePendingId === listing.id}
          onToggle={onToggleFavorite}
        />
        {distance && (
          <div className="absolute bottom-3 left-3 bg-inverse-surface/85 backdrop-blur-sm text-inverse-on-surface px-2 py-0.5 rounded text-label-sm font-medium">
            {distance}
          </div>
        )}
      </div>
      <div className="p-space-md flex flex-col gap-space-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <h3 className="font-title-md text-title-md text-on-surface font-bold leading-snug truncate">{name}</h3>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{description}</span>
          </div>
          <RentalRate listing={listing} />
        </div>
        <OperatorStrip listing={listing} toneIndex={toneIndex} />
        {specs.length > 0 && (
          <div className="grid grid-cols-3 gap-2 text-center text-on-surface-variant font-label-sm text-[11px]">
            {specs.map((spec) => (
              <SpecTile key={spec.label} spec={spec} />
            ))}
          </div>
        )}
        <RentalActions listing={listing} onBook={onBook} />
      </div>
    </article>
  )
}
