import { useId } from 'react'
import { NavLink } from 'react-router'
import { useI18n } from '../../i18n/i18n-context'
import type { MessageSelector } from '../../i18n/translation'
import { Icon } from '../Icon'

interface AdminLink {
  to: string
  icon: string
  label: MessageSelector
  /** Active only on exactly this path (the overview, whose path starts every other one). */
  end?: boolean
}

interface AdminSection {
  id: string
  title: MessageSelector
  links: readonly AdminLink[]
}

const SECTIONS: readonly AdminSection[] = [
  {
    id: 'manage',
    title: (t) => t.nav.adminSections.manage,
    links: [
      { to: '/admin', icon: 'dashboard', label: (t) => t.nav.screens.adminOverview, end: true },
      { to: '/admin/users', icon: 'group', label: (t) => t.nav.screens.users },
      { to: '/admin/payments', icon: 'payments', label: (t) => t.nav.screens.payments },
    ],
  },
  {
    id: 'rates',
    title: (t) => t.nav.adminSections.rates,
    links: [
      { to: '/admin/rates/mandi', icon: 'monitoring', label: (t) => t.nav.screens.mandiRates },
      { to: '/admin/rates/rentals', icon: 'agriculture', label: (t) => t.nav.screens.rentalRates },
      { to: '/admin/rates/products', icon: 'sell', label: (t) => t.nav.screens.productPrices },
    ],
  },
]

/** The admin portal's pages in groups, for the sidebar and the drawer; `onNavigate` closes the drawer. */
export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n()
  const idPrefix = useId()

  return (
    <nav aria-label={t.nav.adminNavigation} className="flex-1 overflow-y-auto px-space-sm py-space-md">
      {SECTIONS.map((section) => (
        <div key={section.id} className="mb-space-md">
          <h2
            id={`${idPrefix}-${section.id}`}
            className="px-space-sm pb-space-xs font-label-sm text-label-sm uppercase text-on-surface-variant"
          >
            {section.title(t)}
          </h2>
          <ul aria-labelledby={`${idPrefix}-${section.id}`} className="flex flex-col gap-1">
            {section.links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex min-h-[44px] items-center gap-space-sm rounded-xl px-space-sm font-label-lg text-label-lg transition-colors ${
                      isActive
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon name={link.icon} fill={isActive} className="text-[22px]" />
                      <span className="truncate">{link.label(t)}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
