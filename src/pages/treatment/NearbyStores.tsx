import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { NearbyStock } from '../../lib/types'
import { apiUrl } from '../../platform/api-base'
import { DealerCard } from './DealerCard'
import { nearestDealerId } from './treatment-utils'

interface NearbyStoresProps {
  stock: NearbyStock
}

/** Dealers around the farmer's agro hub that stock the prescribed products, plus the online depot offer. */
export function NearbyStores({ stock }: NearbyStoresProps) {
  const { t } = useI18n()
  const format = useFormat()
  const { hubName, district, radiusKm, productsLabel, mapImageUrl, onlineOffer, dealers } = stock
  const nearestId = nearestDealerId(dealers)

  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-space-xs">
          <h2 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-1.5">
            <Icon name="storefront" className="text-primary text-[22px]" />
            {t.treatment.stores.title}
          </h2>
          <span className="bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm px-space-xs py-0.5 rounded-full font-bold">
            {t.treatment.stores.area(hubName, district, radiusKm)}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {t.treatment.stores.inventory(productsLabel)}
        </p>
        {onlineOffer && (
          <Link
            to="/store"
            className="mt-1 inline-flex items-center justify-between w-full min-h-[48px] p-2.5 rounded-lg bg-secondary-container/30 text-on-secondary-container active:scale-95 transition-transform"
          >
            <span className="font-label-md text-label-md font-bold flex items-center gap-1.5">
              <Icon name="shopping_bag" className="text-[18px] text-primary" />
              {onlineOffer.label} ({format.inr(onlineOffer.price)})
            </span>
            <span className="font-label-sm text-label-sm font-bold text-primary flex items-center">
              {t.treatment.stores.orderNow}
              <Icon name="chevron_right" className="text-[16px]" />
            </span>
          </Link>
        )}
      </div>
      <div
        className="w-full h-36 bg-surface-container bg-cover bg-center rounded-xl shadow-sm relative overflow-hidden flex items-end p-space-sm"
        style={{ backgroundImage: `url("${apiUrl(mapImageUrl)}")` }}
      >
        <div className="bg-surface/90 backdrop-blur-md rounded-lg p-space-xs px-space-sm flex items-center gap-space-xs text-on-surface shadow-sm">
          <Icon name="near_me" className="text-primary text-[18px]" />
          <span className="font-label-sm text-label-sm font-bold">
            {t.treatment.stores.stockists(dealers.length, hubName)}
          </span>
        </div>
      </div>
      {dealers.map((dealer) => (
        <DealerCard key={dealer.id} dealer={dealer} nearest={dealer.id === nearestId} />
      ))}
    </section>
  )
}
