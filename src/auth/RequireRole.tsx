import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { SplashScreen } from '../components/SplashScreen'
import type { Role } from '../lib/types'
import { useAuth } from './auth-context'
import { homePath, loginPath } from './portals'

interface RequireRoleProps {
  /** Users holding any of these roles may enter. */
  roles: readonly Role[]
  children: ReactNode
}

/**
 * Route guard: shows `children` to users holding one of `roles`. Signed-out visitors go to the sign-in page
 * and come back here afterwards; signed-in users without the role go to their own portal.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { status, user, hasRole } = useAuth()
  const { pathname, search, hash } = useLocation()

  if (status === 'loading') return <SplashScreen />
  if (!user) return <Navigate to={loginPath(`${pathname}${search}${hash}`)} replace />
  if (!roles.some(hasRole)) return <Navigate to={homePath(user.roles)} replace />
  return children
}
