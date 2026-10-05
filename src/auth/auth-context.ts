import { createContext, useContext, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { CurrentUser, LoginRequest, Role } from '../lib/types'
import { PORTALS, portalRole, primaryRole } from './portals'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

/** What AuthProvider shares: the sign-in state and the actions that change it. */
export interface AuthSessionState {
  /** 'loading' until the session kept in the refresh cookie has been restored, or found missing. */
  status: AuthStatus
  user: CurrentUser | null
  /** Signs in; resolves to the user, rejects with an ApiError (wrong credentials, offline, …). */
  login: (credentials: LoginRequest) => Promise<CurrentUser>
  /** Signs out here and on the server; rejects, still signed in, when the server cannot be reached. */
  logout: () => Promise<void>
}

export interface Auth extends AuthSessionState {
  /**
   * The role whose portal is on screen, taken from the URL (/admin, /owner, else the farmer app) so it always
   * matches what the user sees; a portal of a role the user lacks falls back to their primary role. Null
   * when signed out.
   */
  activeRole: Role | null
  hasRole: (role: Role) => boolean
  /** Opens the portal of another role the user holds (the account menu's role switch). */
  switchRole: (role: Role) => void
}

export const AuthContext = createContext<AuthSessionState | null>(null)

/** The signed-in user, their roles and the sign-in actions; for components inside the router. */
export function useAuth(): Auth {
  const state = useContext(AuthContext)
  const portal = portalRole(useLocation().pathname)
  const navigate = useNavigate()

  const auth = useMemo(() => {
    if (!state) return null
    const roles = state.user?.roles ?? []
    const hasRole = (role: Role) => roles.includes(role)
    return {
      ...state,
      activeRole: hasRole(portal) ? portal : (primaryRole(roles) ?? null),
      hasRole,
      switchRole: (role: Role) => {
        if (hasRole(role)) navigate(PORTALS[role].home)
      },
    }
  }, [state, portal, navigate])

  if (!auth) throw new Error('useAuth() must be used inside <AuthProvider>')
  return auth
}
