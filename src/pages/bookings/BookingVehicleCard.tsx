import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { COUNTRY_CODE, formatPhone } from '../../lib/phone'
import type { RentalBookingDetail } from '../../lib/types'

/** Tile icon of a booked vehicle that has neither a photo nor an icon. */
const DEFAULT_VEHICLE_ICON = 'agriculture'

/** The booked vehicle, its hub and its owner, with a button to call the owner. */
export function BookingVehicleCard({ booking }: { booking: RentalBookingDetail }) {
  const { t } = useI18n()

  return (
    <section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex items-center gap-space-sm">
        {booking.listingImageUrl ? (
          <img
            src={booking.listingImageUrl}
            alt=""
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-surface-container-high"
          />
        ) : (
          <span className="w-16 h-16 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
            <Icon name={booking.listingIcon ?? DEFAULT_VEHICLE_ICON} className="text-[32px]" />
          </span>
        )}
        <div className="flex flex-col min-w-0">
          <span className="font-title-md text-title-md font-bold text-on-surface">{booking.listingName}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {t.bookings.detail.hub}: {booking.hubName}
          </span>
        </div>
      </div>
      <a
        href={`tel:${COUNTRY_CODE}${booking.operatorPhone}`}
        className="min-h-[48px] rounded-lg bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1.5 active:bg-secondary-container"
      >
        <Icon name="call" className="text-[18px]" />
        <span>{t.bookings.detail.callOwner(booking.operatorName)}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">{formatPhone(booking.operatorPhone)}</span>
      </a>
    </section>
  )
}
