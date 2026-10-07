import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppHeader } from './AppHeader'
import { BottomNav, type NavTab } from './BottomNav'
import { useRouteTitle } from './route-handle'

interface TabBarLayoutProps {
  tabs: readonly NavTab[]
  /** The portal's name beside the brand, e.g. "Partner". */
  badge?: string
  /** Header buttons between the language switch and the account menu. */
  actions?: ReactNode
}

/** Phone screens between the app header (showing the screen's name) and a tab bar. */
export function TabBarLayout({ tabs, badge, actions }: TabBarLayoutProps) {
  const title = useRouteTitle()

  return (
    <>
      <AppHeader subtitle={title} badge={badge}>
        {actions}
      </AppHeader>
      <main className="flex flex-col relative w-full pt-header pb-tabbar bg-surface">
        <Outlet />
      </main>
      <BottomNav tabs={tabs} />
    </>
  )
}
