import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { OrderSummary } from '../../lib/types'
import { OrderStatusChip } from './OrderStatusChip'

interface OrderCardProps {
  order: OrderSummary
  /** This order's payment is opening. */
  paying: boolean
  /** Another payment is opening, so this one waits. */
  payDisabled: boolean
  onPay: () => void
}

/** One order: what was bought, how it is paid, and "Pay now" while an online order is unpaid. */
export function OrderCard({ order, paying, payDisabled, onPay }: OrderCardProps) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <li className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-space-sm">
          <h2 className="font-title-md text-title-md font-bold text-on-surface">{t.orders.order(order.id)}</h2>
          <OrderStatusChip status={order.status} />
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {t.orders.placed(format.timeAgo(order.placedAt))} • {t.orders.method[order.paymentMethod]}
        </span>
      </div>
      <ul className="flex flex-col divide-y divide-surface-container-high">
        {order.lines.map((line) => (
          <li key={line.name} className="flex items-baseline justify-between gap-space-sm py-space-xs">
            <div className="flex min-w-0 flex-col">
              <span className="font-body-md text-body-md text-on-surface">{line.name}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {t.orders.lineQuantity(line.quantity, format.inr(line.unitPrice))}
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
          {t.orders.total} • {t.orders.items(order.itemCount)}
        </span>
        <span className="font-headline-sm text-headline-sm font-bold text-primary">{format.inr(order.total)}</span>
      </div>
      {order.status === 'AWAITING_PAYMENT' && (
        <div className="flex flex-col gap-space-xs">
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.orders.payHint}</p>
          <button
            type="button"
            disabled={payDisabled}
            aria-busy={paying}
            onClick={onPay}
            className="flex min-h-[48px] w-full items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg font-label-lg text-label-lg text-on-primary shadow-md active:scale-[0.99] disabled:opacity-60"
          >
            <Icon name={paying ? 'progress_activity' : 'lock'} className={`text-[20px] ${paying ? 'animate-spin' : ''}`} />
            {paying ? t.orders.paying : t.orders.payNow(format.inr(order.total))}
          </button>
        </div>
      )}
    </li>
  )
}
