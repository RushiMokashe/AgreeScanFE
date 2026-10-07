import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { OwnerListing } from '../../lib/types'
import { apiUrl } from '../../platform/api-base'
import { inLanguage } from '../owner-utils'

/** Tile icon of a vehicle with neither a photo nor an icon of its own, per category. */
const CATEGORY_ICONS = { MACHINERY: 'agriculture', TRANSPORT: 'local_shipping' } as const

interface VehicleCardProps {
  listing: OwnerListing
  /** This vehicle's switch is being saved. */
  switching: boolean
  onToggleOnline: (listing: OwnerListing) => void
}

/** One of the owner's vehicles: picture, rate, open bookings, the online switch and a link to edit it. */
export function VehicleCard({ listing, switching, onToggleOnline }: VehicleCardProps) {
  const { t, lang } = useI18n()
  const format = useFormat()
  const name = inLanguage(listing.name, lang)

  return (
    <li className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="flex gap-space-sm p-space-sm">
        {listing.imageUrl ? (
          <img src={apiUrl(listing.imageUrl)} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-surface-container-high" />
        ) : (
          <span className="w-20 h-20 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
            <Icon name={listing.icon ?? CATEGORY_ICONS[listing.category]} className="text-[36px]" />
          </span>
        )}
        <div className="flex flex-col min-w-0 flex-1 gap-0.5">
          <span className="font-title-md text-title-md font-bold text-on-surface">{name}</span>
          <span className="font-label-lg text-label-lg text-primary">
            {format.inr(listing.rate)}
            {t.rentals.rateUnits[listing.rateUnit]}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {listing.openBookings > 0 ? t.owner.vehicles.openBookings(listing.openBookings) : t.owner.vehicles.noOpenBookings}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-space-sm border-t border-outline-variant/50 px-space-sm py-space-xs">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-space-sm">
          <input
            type="checkbox"
            role="switch"
            checked={listing.online}
            disabled={switching}
            aria-label={t.owner.vehicles.onlineLabel(name)}
            onChange={() => onToggleOnline(listing)}
            className="h-5 w-5 accent-primary"
          />
          <span className={`font-label-md text-label-md ${listing.online ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
            {listing.online ? t.owner.vehicles.online : t.owner.vehicles.offline}
          </span>
        </label>
        <Link
          to={`/owner/vehicles/${listing.id}`}
          className="min-h-[44px] flex items-center gap-1 rounded-lg px-space-sm font-label-md text-label-md text-primary active:bg-surface-container"
        >
          <Icon name="edit" className="text-[18px]" />
          {t.owner.vehicles.edit}
        </Link>
      </div>
    </li>
  )
}
