import { useAuth } from '../../auth/auth-context'
import { PORTALS, ROLE_PRIORITY } from '../../auth/portals'
import { useSignOut } from '../../auth/useSignOut'
import { useI18n } from '../../i18n/i18n-context'
import type { MessageSelector } from '../../i18n/translation'
import { formatPhone } from '../../lib/phone'
import type { Role } from '../../lib/types'
import { Menu, MenuGroup, MenuItem, MenuItemRadio, MenuLink, MenuSeparator } from '../menu/Menu'
import { RoleChip } from '../RoleChip'
import { ProfileAvatar } from './ProfileAvatar'

interface AccountLink {
  to: string
  icon: string
  label: MessageSelector
}

/** The account pages each portal offers in the menu. */
const ACCOUNT_LINKS: Readonly<Record<Role, readonly AccountLink[]>> = {
  FARMER: [
    { to: '/profile', icon: 'person', label: (t) => t.nav.account.profile },
    { to: '/plots', icon: 'grass', label: (t) => t.nav.account.plots },
    { to: '/bookings', icon: 'event_available', label: (t) => t.nav.account.bookings },
    { to: '/orders', icon: 'receipt_long', label: (t) => t.nav.account.orders },
  ],
  VEHICLE_OWNER: [{ to: '/owner/profile', icon: 'person', label: (t) => t.nav.account.profile }],
  SHOPKEEPER: [{ to: '/shop/profile', icon: 'person', label: (t) => t.nav.account.profile }],
  ADMIN: [{ to: '/admin/profile', icon: 'person', label: (t) => t.nav.account.profile }],
}

/** The avatar button of every header: who is signed in, the role switch, account pages and sign-out. */
export function ProfileMenu() {
  const { t } = useI18n()
  const { user, activeRole, switchRole } = useAuth()
  const { signOut } = useSignOut()
  if (!user || !activeRole) return null
  const heldRoles = ROLE_PRIORITY.filter((role) => user.roles.includes(role))

  return (
    <Menu
      label={t.nav.account.menu}
      buttonClassName="flex h-11 w-11 items-center justify-center rounded-full transition-transform active:scale-95"
      button={
        <>
          <ProfileAvatar />
          <span className="sr-only">{t.nav.account.menu}</span>
        </>
      }
      panelClassName="w-72"
      header={
        <div className="flex items-center gap-space-sm border-b border-outline-variant/50 px-space-md pb-space-sm pt-space-xs">
          <ProfileAvatar size="lg" />
          <div className="flex min-w-0 flex-col items-start gap-1">
            <p className="max-w-full truncate font-title-md text-title-md text-on-surface">{user.name}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{formatPhone(user.phone)}</p>
            <RoleChip role={activeRole} />
          </div>
        </div>
      }
    >
      {heldRoles.length > 1 && (
        <>
          <MenuGroup label={t.nav.account.switchRole}>
            {heldRoles.map((role) => (
              <MenuItemRadio
                key={role}
                icon={PORTALS[role].icon}
                checked={role === activeRole}
                onSelect={() => switchRole(role)}
              >
                {t.common.roles[role]}
              </MenuItemRadio>
            ))}
          </MenuGroup>
          <MenuSeparator />
        </>
      )}
      {ACCOUNT_LINKS[activeRole].map((link) => (
        <MenuLink key={link.to} to={link.to} icon={link.icon}>
          {link.label(t)}
        </MenuLink>
      ))}
      <MenuSeparator />
      <MenuItem icon="logout" onSelect={signOut}>
        {t.nav.account.signOut}
      </MenuItem>
    </Menu>
  )
}
