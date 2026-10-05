import { useI18n } from '../../i18n/i18n-context'
import type { NavTab } from './BottomNav'
import { PhoneFrame } from './PhoneFrame'
import { TabBarLayout } from './TabBarLayout'

const OWNER_TABS: readonly NavTab[] = [
  { to: '/owner', icon: 'space_dashboard', label: (t) => t.nav.ownerTabs.dashboard, end: true },
  { to: '/owner/vehicles', icon: 'agriculture', label: (t) => t.nav.ownerTabs.vehicles },
  { to: '/owner/bookings', icon: 'event_note', label: (t) => t.nav.ownerTabs.bookings },
  { to: '/owner/profile', icon: 'person', label: (t) => t.nav.ownerTabs.profile },
]

/** The partner (vehicle-owner) portal (D8): phone frame, "AgriScan Partner" header and a four-tab bar. */
export function OwnerLayout() {
  const { t } = useI18n()

  return (
    <PhoneFrame>
      <TabBarLayout tabs={OWNER_TABS} badge={t.nav.partnerBadge} />
    </PhoneFrame>
  )
}
