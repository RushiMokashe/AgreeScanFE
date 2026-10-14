import { Preferences } from '@capacitor/preferences'
import { isNativeApp } from './native'

/**
 * How the refresh token travels between the backend and this client (backend: AuthController and NativeClient).
 * In a browser it is an HttpOnly cookie that JavaScript never sees. The installed app calls the API from another
 * origin, where that cookie is never sent, so it keeps the token in its private storage and exchanges it in headers.
 */
export interface SessionTransport {
  /** Extra headers for an API request to `path` ("/auth/refresh", "/scans", ...). */
  headersFor: (path: string) => Promise<Record<string, string>>
  /** Keeps the refresh token a response hands over (after signing in, refreshing or changing the password). */
  received: (response: Response) => Promise<void>
  /** Forgets the refresh token: signed out, or the session has ended. */
  forget: () => Promise<void>
}

const CLIENT_HEADER = 'X-AgriScan-Client'
const NATIVE_CLIENT = 'native'
const REFRESH_TOKEN_HEADER = 'X-Refresh-Token'
/** The calls that need the refresh token itself. */
const REFRESH_TOKEN_PATHS: ReadonlySet<string> = new Set(['/auth/refresh', '/auth/logout'])
/** Android SharedPreferences, private to the app. */
const STORAGE_KEY = 'agriscan.refreshToken'

/** The browser handles the cookie by itself. */
const browserTransport: SessionTransport = {
  headersFor: () => Promise.resolve({}),
  received: () => Promise.resolve(),
  forget: () => Promise.resolve(),
}

const nativeTransport: SessionTransport = {
  headersFor: async (path) => {
    const headers: Record<string, string> = { [CLIENT_HEADER]: NATIVE_CLIENT }
    if (REFRESH_TOKEN_PATHS.has(path)) {
      const { value } = await Preferences.get({ key: STORAGE_KEY })
      if (value) headers[REFRESH_TOKEN_HEADER] = value
    }
    return headers
  },
  received: async (response) => {
    const token = response.headers.get(REFRESH_TOKEN_HEADER)
    if (token) await Preferences.set({ key: STORAGE_KEY, value: token })
  },
  forget: () => Preferences.remove({ key: STORAGE_KEY }),
}

export const sessionTransport: SessionTransport = isNativeApp ? nativeTransport : browserTransport
