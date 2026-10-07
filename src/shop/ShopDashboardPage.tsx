import { Link } from 'react-router'
import { Icon } from '../components/Icon'
import { ErrorState, LoadingState } from '../components/PageState'
import { PaymentsToConfirm } from '../components/payments/PaymentsToConfirm'
import { StatTile } from '../components/StatTile'
import { useApi } from '../hooks/useApi'
import { useI18n } from '../i18n/i18n-context'
import { useFormat } from '../i18n/useFormat'
import { api } from '../lib/api'
import { useNotificationRefresh } from '../notifications/useNotificationRefresh'
import { ShopOrderCard } from './orders/ShopOrderCard'

const SHORTCUT =
  'flex min-h-[52px] items-center justify-center gap-space-xs rounded-xl px-space-sm font-label-lg text-label-lg'

/**
 * The shop's home (/shop): today's orders and sales, Scan & Pay payments to confirm, the catalogue at a glance and the
 * latest orders, with a nudge to set up Scan & Pay until the shop has.
 */
export default function ShopDashboardPage() {
  const { t } = useI18n()
  const format = useFormat()
  const texts = t.shop.dashboard
  const { data: dashboard, error, reload } = useApi(() => api.shop.dashboard())
  useNotificationRefresh((route) => route.startsWith('/shop/'), reload)

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!dashboard) return <LoadingState label={texts.loading} />

  return (
    <div className="flex flex-col gap-space-md px-margin py-space-sm">
      <h1 className="flex items-center gap-space-xs font-headline-sm text-headline-sm font-bold text-on-surface">
        <Icon name="storefront" className="text-[26px] text-primary" />
        {dashboard.shopName}
      </h1>

      {!dashboard.acceptsScanAndPay && (
        <Link
          to="/shop/settings"
          className="flex items-center gap-space-sm rounded-xl bg-tertiary-fixed p-space-md text-on-tertiary-fixed shadow-sm"
        >
          <Icon name="qr_code_scanner" className="text-[28px]" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-title-md text-title-md font-bold">{texts.setUpScanAndPay.title}</span>
            <span className="font-body-sm text-body-sm">{texts.setUpScanAndPay.message}</span>
          </span>
          <Icon name="chevron_right" className="text-[24px]" />
        </Link>
      )}

      <div className="grid grid-cols-3 gap-space-sm">
        <StatTile
          icon="receipt_long"
          label={texts.ordersToday}
          value={format.number(dashboard.ordersToday)}
          to="/shop/orders"
        />
        <StatTile icon="payments" label={texts.salesToday} value={format.inr(dashboard.salesToday)} />
        <StatTile
          icon="qr_code_scanner"
          label={texts.toVerify}
          value={format.number(dashboard.paymentsToVerify)}
          to="/shop/orders?status=VERIFYING_PAYMENT"
          highlighted={dashboard.paymentsToVerify > 0}
        />
      </div>

      <PaymentsToConfirm purpose="STORE_ORDER" onDecided={reload} />

      <Link
        to="/shop/products"
        className="flex items-center justify-between gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm active:bg-surface-container"
      >
        <span className="flex items-center gap-space-sm">
          <Icon name="inventory_2" className="text-[24px] text-primary" />
          <span className="flex flex-col">
            <span className="font-title-md text-title-md font-bold text-on-surface">
              {format.number(dashboard.products)} {texts.products}
            </span>
            {dashboard.outOfStock > 0 && (
              <span className="font-body-sm text-body-sm text-error">
                {texts.outOfStock(format.number(dashboard.outOfStock))}
              </span>
            )}
          </span>
        </span>
        <Icon name="chevron_right" className="text-[24px] text-on-surface-variant" />
      </Link>

      <div className="grid grid-cols-2 gap-space-sm">
        <Link to="/shop/products/new" className={`${SHORTCUT} bg-primary text-on-primary shadow-sm`}>
          <Icon name="add_circle" className="text-[20px]" />
          {texts.addProduct}
        </Link>
        <Link to="/shop/orders" className={`${SHORTCUT} bg-surface-container-high text-primary`}>
          <Icon name="receipt_long" className="text-[20px]" />
          {texts.viewOrders}
        </Link>
      </div>

      <section className="flex flex-col gap-space-sm">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{texts.recent}</h2>
        {dashboard.recentOrders.length === 0 ? (
          <p className="rounded-xl bg-surface-container-lowest p-space-md font-body-md text-body-md text-on-surface-variant shadow-sm">
            {texts.noOrders}
          </p>
        ) : (
          <ul className="flex flex-col gap-space-sm">
            {dashboard.recentOrders.map((order) => (
              <ShopOrderCard key={order.id} order={order} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
