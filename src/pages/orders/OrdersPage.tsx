import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api } from '../../lib/api'
import { useNotificationRefresh } from '../../notifications/useNotificationRefresh'
import { usePayNow } from '../payments/usePayNow'
import { OrderCard } from './OrderCard'

/**
 * The farmer's Agro Store orders, newest first (/orders). An unpaid online order can be paid from here; the list
 * reloads when a payment notification arrives, e.g. one a webhook settled.
 */
export default function OrdersPage() {
  const { t } = useI18n()
  const { data: orders, error, reload } = useApi(() => api.orders())
  const { paying, payNow } = usePayNow()
  useNotificationRefresh((route) => route === '/orders', reload)

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!orders) return <LoadingState label={t.orders.loading} />

  if (orders.length === 0) {
    return (
      <section className="mx-margin my-space-lg flex flex-col items-center gap-space-sm rounded-2xl bg-surface-container-lowest px-space-md py-space-xl text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <Icon name="receipt_long" className="text-[32px]" />
        </div>
        <h1 className="font-title-md text-title-md font-bold text-on-surface">{t.orders.empty.title}</h1>
        <p className="max-w-sm font-body-sm text-body-sm text-on-surface-variant">{t.orders.empty.message}</p>
        <Link
          to="/store"
          className="mt-space-xs flex min-h-[48px] items-center gap-space-xs rounded-xl bg-primary px-space-lg font-label-lg text-label-lg text-on-primary"
        >
          <Icon name="storefront" className="text-[20px]" />
          {t.orders.empty.shop}
        </Link>
      </section>
    )
  }

  return (
    <ul className="flex flex-col gap-space-sm px-margin py-space-sm">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          paying={paying?.referenceId === order.id}
          payDisabled={paying !== null}
          onPay={() => void payNow({ purpose: 'STORE_ORDER', referenceId: order.id })}
        />
      ))}
    </ul>
  )
}
