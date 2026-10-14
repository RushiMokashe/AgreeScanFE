import { Icon } from '../../components/Icon'
import { OrderStatusChip } from '../../components/orders/OrderStatusChip'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { COUNTRY_CODE, formatPhone } from '../../lib/phone'
import type { ShopOrder } from '../../lib/types'

/** An order placed with the shop: who to deliver to (tap to call), what, how it is paid and its total. */
export function ShopOrderCard({ order }: { order: ShopOrder }) {
  const { t } = useI18n()
  const format = useFormat()
  const texts = t.shop.orders

  return (
    <li className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-space-sm">
          <h3 className="font-title-md text-title-md font-bold text-on-surface">{texts.order(order.id)}</h3>
          <OrderStatusChip status={order.status} />
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {texts.placed(format.timeAgo(order.placedAt))} • {texts.method[order.paymentMethod]}
        </span>
      </div>
      <div className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-container px-space-sm py-space-xs">
        <span className="flex min-w-0 items-center gap-1 font-body-md text-body-md text-on-surface">
          <Icon name="person" className="text-[18px] text-on-surface-variant" />
          <span className="truncate">{order.customerName}</span>
        </span>
        <a
          href={`tel:${COUNTRY_CODE}${order.customerPhone}`}
          aria-label={texts.call(order.customerName)}
          className="flex min-h-[44px] flex-shrink-0 items-center gap-1 px-space-xs font-label-md text-label-md text-primary"
        >
          <Icon name="call" className="text-[18px]" />
          {formatPhone(order.customerPhone)}
        </a>
      </div>
      <ul className="flex flex-col divide-y divide-surface-container-high">
        {order.lines.map((line) => (
          <li key={line.name} className="flex items-baseline justify-between gap-space-sm py-space-xs">
            <div className="flex min-w-0 flex-col">
              <span className="font-body-md text-body-md text-on-surface">{line.name}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {texts.lineQuantity(line.quantity, format.inr(line.unitPrice))}
              </span>
            </div>
            <span className="flex-shrink-0 font-label-lg text-label-lg font-semibold text-on-surface">
              {format.inr(line.lineTotal)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-space-sm border-t border-surface-container-high pt-space-sm">
        <span className="font-label-lg text-label-lg text-on-surface">
          {texts.total} • {texts.items(order.itemCount)}
        </span>
        <span className="font-headline-sm text-headline-sm font-bold text-primary">{format.inr(order.total)}</span>
      </div>
    </li>
  )
}
