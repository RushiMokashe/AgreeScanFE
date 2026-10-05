import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { Outlet } from 'react-router'
import { useModalFocus } from '../../hooks/useModalFocus'
import { useI18n } from '../../i18n/i18n-context'
import { Icon } from '../Icon'
import { LanguagePicker } from '../LanguagePicker'
import { AdminNav } from './AdminNav'
import { Brand } from './Brand'
import { ProfileMenu } from './ProfileMenu'
import { useRouteTitle } from './route-handle'

/** Tailwind's `lg` breakpoint: from here on the navigation is a sidebar instead of a drawer. */
const SIDEBAR_SCREEN = '(min-width: 64rem)'

/**
 * The admin portal (D8): desktop-first and full width, outside the phone frame. The navigation is a sidebar
 * from `lg` up and a drawer below it; the top bar names the screen and holds the language switch and the
 * account menu.
 */
export function AdminLayout() {
  const { t } = useI18n()
  const title = useRouteTitle()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-container-low">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-outline-variant/40 bg-surface-container-lowest lg:flex">
        <div className="flex h-16 items-center px-margin">
          <Brand badge={t.nav.adminBadge} />
        </div>
        <AdminNav />
      </aside>
      {drawerOpen && <NavigationDrawer onClose={() => setDrawerOpen(false)} />}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-space-sm border-b border-outline-variant/40 bg-surface/90 px-margin backdrop-blur-xl lg:px-margin-tablet">
          <button
            type="button"
            aria-label={t.nav.header.openNavigation}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="-ml-2 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container lg:hidden"
          >
            <Icon name="menu" className="text-[24px]" />
          </button>
          <p className="min-w-0 flex-1 truncate font-headline-sm text-headline-sm text-on-surface">{title}</p>
          <LanguagePicker />
          <ProfileMenu />
        </header>
        <main className="flex-1 pb-space-xl">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/** The navigation as a modal drawer on phones and tablets; it closes on navigation, Escape or a tap outside. */
function NavigationDrawer({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const drawerRef = useRef<HTMLDivElement>(null)
  const close = useEffectEvent(onClose)
  useModalFocus(drawerRef, onClose)

  // Turning a tablet to landscape brings the sidebar back: close the drawer rather than trap focus in it.
  useEffect(() => {
    const sidebarScreen = window.matchMedia(SIDEBAR_SCREEN)
    const closeOnSidebarScreen = (event: MediaQueryListEvent) => {
      if (event.matches) close()
    }
    sidebarScreen.addEventListener('change', closeOnSidebarScreen)
    return () => sidebarScreen.removeEventListener('change', closeOnSidebarScreen)
  }, [])

  return (
    <div className="lg:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[45] bg-inverse-surface/40 transition-opacity duration-200 starting:opacity-0"
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.adminNavigation}
        tabIndex={-1}
        className="fixed inset-y-0 left-0 z-[46] flex w-72 max-w-[85vw] flex-col bg-surface-container-lowest shadow-xl outline-none transition-transform duration-200 ease-out starting:-translate-x-full"
      >
        <div className="flex h-16 items-center justify-between gap-space-sm pl-margin pr-space-sm">
          <Brand badge={t.nav.adminBadge} />
          <button
            type="button"
            aria-label={t.nav.header.closeNavigation}
            onClick={onClose}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container"
          >
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>
        <AdminNav onNavigate={onClose} />
      </div>
    </div>
  )
}
