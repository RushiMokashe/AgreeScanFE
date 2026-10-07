import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'

interface LocationStripProps {
  hubName: string
  radiusKm: number
  routes: string
  /** Opens the hub picker. */
  onChange: () => void
}

/** The APMC hub the rentals are listed around, with its service radius and routes, and "Change" to pick another. */
export function LocationStrip({ hubName, radiusKm, routes, onChange }: LocationStripProps) {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-between gap-space-xs bg-surface-container-lowest p-space-sm rounded-xl shadow-sm">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
          <Icon name="location_on" className="text-[18px]" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-label-lg text-label-lg text-on-surface truncate">{hubName}</span>
            <span className="bg-secondary-container text-on-secondary-container font-label-sm text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 whitespace-nowrap">
              {t.rentals.location.radius(radiusKm)}
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{routes}</span>
        </div>
      </div>
      {/* ::after widens the tap target to 44px without changing the chip's look */}
      <button
        type="button"
        aria-label={t.rentals.location.changeLabel}
        aria-haspopup="dialog"
        onClick={onChange}
        className="relative px-space-sm py-1.5 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm flex items-center gap-1 flex-shrink-0 active:bg-surface-container-high after:absolute after:-inset-2"
      >
        <span>{t.rentals.location.change}</span>
        <Icon name="tune" className="text-[14px]" />
      </button>
    </div>
  )
}
