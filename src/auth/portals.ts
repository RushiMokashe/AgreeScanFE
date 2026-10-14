import type { Role } from '../lib/types'

export const LOGIN_PATH = '/login'

/** Each role's portal (D8): where it starts and its icon. The farmer app is the root of the site. */
export const PORTALS: Readonly<Record<Role, { home: string; icon: string }>> = {
  FARMER: { home: '/', icon: 'agriculture' },
  VEHICLE_OWNER: { home: '/owner', icon: 'local_shipping' },
  SHOPKEEPER: { home: '/shop', icon: 'storefront' },
  ADMIN: { home: '/admin', icon: 'admin_panel_settings' },
}

/** Most to least privileged: a user with several roles signs in to the first one they hold. */
export const ROLE_PRIORITY: readonly Role[] = ['ADMIN', 'VEHICLE_OWNER', 'SHOPKEEPER', 'FARMER']

/** The role a user signs in as, or undefined for an account without any role. */
export function primaryRole(roles: readonly Role[]): Role | undefined {
  return ROLE_PRIORITY.find((role) => roles.includes(role))
}

/** Where a user lands after signing in; an account without roles has nowhere to go but the sign-in page. */
export function homePath(roles: readonly Role[]): string {
  const role = primaryRole(roles)
  return role ? PORTALS[role].home : LOGIN_PATH
}

function isWithin(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`)
}

/** The role whose portal serves `pathname`: /admin/…, /owner/… and /shop/… have their own, the rest is the farmer app. */
export function portalRole(pathname: string): Role {
  if (isWithin(pathname, PORTALS.ADMIN.home)) return 'ADMIN'
  if (isWithin(pathname, PORTALS.VEHICLE_OWNER.home)) return 'VEHICLE_OWNER'
  if (isWithin(pathname, PORTALS.SHOPKEEPER.home)) return 'SHOPKEEPER'
  return 'FARMER'
}

/** The sign-in page, coming back to `path` afterwards. */
export function loginPath(path: string): string {
  return `${LOGIN_PATH}?${new URLSearchParams({ next: path })}`
}

/**
 * `next` when it is a page of this app, else undefined: never another site (that would turn the sign-in page
 * into an open redirect) and never the sign-in page itself.
 */
export function safeNextPath(next: string | null): string | undefined {
  if (!next?.startsWith('/')) return undefined
  const url = new URL(next, window.location.origin)
  if (url.origin !== window.location.origin || isWithin(url.pathname, LOGIN_PATH)) return undefined
  return `${url.pathname}${url.search}${url.hash}`
}
