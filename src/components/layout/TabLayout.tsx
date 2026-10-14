import { NotificationBell } from '../../notifications/NotificationBell'
import { AssistantButton } from './AssistantButton'
import type { NavTab } from './BottomNav'
import { TabBarLayout } from './TabBarLayout'

/** The Stitch design's five tabs, with the raised "Scan Crop" camera button in the middle. */
const FARMER_TABS: readonly NavTab[] = [
  { to: '/', icon: 'home', label: (t) => t.nav.tabs.home, end: true },
  { to: '/mandi', icon: 'monitoring', label: (t) => t.nav.tabs.mandi },
  { to: '/scan', icon: 'photo_camera', label: (t) => t.nav.tabs.scan, raised: true },
  { to: '/rentals', icon: 'local_shipping', label: (t) => t.nav.tabs.rentals },
  { to: '/store', icon: 'storefront', label: (t) => t.nav.tabs.store },
]

/** Farmer tab screens: the header with the notification bell and the voice assistant's mic, the content and the tab bar. */
export function TabLayout() {
  return (
    <TabBarLayout
      tabs={FARMER_TABS}
      actions={
        <>
          <NotificationBell to="/notifications" />
          <AssistantButton />
        </>
      }
    />
  )
}
