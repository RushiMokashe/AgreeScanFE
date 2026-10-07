import { useI18n } from '../../i18n/i18n-context'
import { NotificationBell } from '../../notifications/NotificationBell'
import { NotificationsProvider } from '../../notifications/NotificationsProvider'
import type { NavTab } from './BottomNav'
import { PhoneFrame } from './PhoneFrame'
import { TabBarLayout } from './TabBarLayout'

const SHOP_TABS: readonly NavTab[] = [
  { to: '/shop', icon: 'space_dashboard', label: (t) => t.nav.shopTabs.dashboard, end: true },
  { to: '/shop/products', icon: 'inventory_2', label: (t) => t.nav.shopTabs.products },
  { to: '/shop/orders', icon: 'receipt_long', label: (t) => t.nav.shopTabs.orders },
  { to: '/shop/settings', icon: 'storefront', label: (t) => t.nav.shopTabs.settings },
]

/**
 * The shopkeeper portal: phone frame, the "AgriScan Shop" header with the notification bell (Scan & Pay payments to
 * confirm arrive live), and a four-tab bar.
 */
export function ShopLayout() {
  const { t } = useI18n()

  return (
    <NotificationsProvider>
      <PhoneFrame>
        <TabBarLayout tabs={SHOP_TABS} badge={t.nav.shopBadge} actions={<NotificationBell to="/shop/notifications" />} />
      </PhoneFrame>
    </NotificationsProvider>
  )
}
