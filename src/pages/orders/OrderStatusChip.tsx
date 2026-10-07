import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { OrderStatus } from '../../lib/types'

const ORDER_STATUS_STYLES: Record<OrderStatus, { icon: string; tone: string }> = {
  AWAITING_PAYMENT: { icon: 'schedule', tone: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  PLACED: { icon: 'inventory_2', tone: 'bg-secondary-container text-on-secondary-container' },
  PAID: { icon: 'verified', tone: 'bg-primary text-on-primary' },
  CANCELLED: { icon: 'cancel', tone: 'bg-surface-container-highest text-on-surface-variant' },
}

/** An order's status as a small chip, e.g. a tick and "Paid". */
export function OrderStatusChip({ status }: { status: OrderStatus }) {
  const { t } = useI18n()
  const { icon, tone } = ORDER_STATUS_STYLES[status]

  return (
    <span
      className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-label-sm text-label-sm font-bold ${tone}`}
    >
      <Icon name={icon} className="text-[14px]" />
      {t.orders.status[status]}
    </span>
  )
}
