import { useSearchParams } from 'react-router'
import { Icon } from '../../components/Icon'
import { ErrorState, LoadingState } from '../../components/PageState'
import { PaymentsToConfirm } from '../../components/payments/PaymentsToConfirm'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api } from '../../lib/api'
import type { OrderStatus } from '../../lib/types'
import { useNotificationRefresh } from '../../notifications/useNotificationRefresh'
import { ShopOrderCard } from './ShopOrderCard'

/** The order filters, in the order the chips show them; null shows every order. */
const ORDER_FILTERS: readonly (OrderStatus | null)[] = [null, 'VERIFYING_PAYMENT', 'AWAITING_PAYMENT', 'PLACED', 'PAID']
/** `?status=VERIFYING_PAYMENT` links straight to the payments to confirm. */
const STATUS_PARAM = 'status'
const FILTERS: ReadonlySet<string> = new Set(ORDER_FILTERS.filter((status) => status !== null))

/**
 * The shop's orders (/shop/orders), newest first: Scan & Pay payments to confirm on top, then the orders, filtered by
 * status. A new payment to confirm arrives as a notification and shows at once.
 */
export default function ShopOrdersPage() {
  const { t } = useI18n()
  const texts = t.shop.orders
  const [searchParams, setSearchParams] = useSearchParams()
  const param = searchParams.get(STATUS_PARAM)
  const status = param !== null && FILTERS.has(param) ? (param as OrderStatus) : null
  const { data: orders, error, reload } = useApi(() => api.shop.orders(status ?? undefined), [status])
  useNotificationRefresh((route) => route.startsWith('/shop/orders'), reload)

  if (error) return <ErrorState error={error} onRetry={reload} />

  const choose = (filter: OrderStatus | null) =>
    setSearchParams(filter ? { [STATUS_PARAM]: filter } : {}, { replace: true, preventScrollReset: true })

  return (
    <div className="flex flex-col gap-space-sm py-space-sm">
      <div className="px-margin">
        <PaymentsToConfirm purpose="STORE_ORDER" onDecided={reload} />
      </div>
      <div role="group" aria-label={texts.filterLabel} className="flex gap-space-xs overflow-x-auto px-margin pb-1">
        {ORDER_FILTERS.map((filter) => (
          <button
            key={filter ?? 'all'}
            type="button"
            aria-pressed={filter === status}
            onClick={() => choose(filter)}
            className={`min-h-[40px] flex-shrink-0 rounded-full px-space-md font-label-md text-label-md transition-colors ${
              filter === status
                ? 'bg-primary text-on-primary'
                : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant'
            }`}
          >
            {texts.filters[filter ?? 'all']}
          </button>
        ))}
      </div>
      {!orders && <LoadingState label={texts.loading} />}
      {orders?.length === 0 && (
        <p className="mx-margin flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-md font-body-md text-body-md text-on-surface-variant shadow-sm">
          <Icon name="receipt_long" className="text-[24px]" />
          {texts.empty}
        </p>
      )}
      {orders && orders.length > 0 && (
        <ul className="flex flex-col gap-space-sm px-margin">
          {orders.map((order) => (
            <ShopOrderCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  )
}
