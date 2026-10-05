import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { api, getSession, subscribeSession } from '../lib/api'
import { AuthContext, type AuthSessionState } from './auth-context'

/**
 * The sign-in state (D1, D2). On start it restores the session from the HttpOnly refresh cookie. The session
 * itself lives in lib/api.ts, which renews it when the access token expires and ends it when it cannot be
 * renewed; the route guards then send the user to the sign-in page.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(subscribeSession, getSession)
  const [restoring, setRestoring] = useState(true)

  useEffect(() => {
    api.auth
      .refresh()
      .catch(() => undefined) // no cookie, an expired one, or no connection: the visitor starts signed out
      .finally(() => setRestoring(false))
  }, [])

  const state = useMemo<AuthSessionState>(
    () => ({
      status: restoring ? 'loading' : session ? 'authenticated' : 'anonymous',
      user: session?.user ?? null,
      login: async (credentials) => (await api.auth.login(credentials)).user,
      logout: api.auth.logout,
    }),
    [restoring, session],
  )

  return <AuthContext value={state}>{children}</AuthContext>
}
