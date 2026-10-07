import { existsSync, readFileSync } from 'node:fs'
import type { CapacitorConfig } from '@capacitor/cli'

/**
 * VITE_API_BASE_URL as the Android build sees it: the environment first (CI), then .env.android.local (your own
 * machine, not committed), then .env.android.
 */
function androidApiBaseUrl(): string {
  if (process.env.VITE_API_BASE_URL) return process.env.VITE_API_BASE_URL
  for (const file of ['.env.android.local', '.env.android']) {
    if (!existsSync(file)) continue
    const match = /^VITE_API_BASE_URL=(.*)$/m.exec(readFileSync(file, 'utf8'))
    if (match) return match[1].trim()
  }
  return ''
}

/**
 * A test build may reach a backend on a laptop over plain http (Wi-Fi or the emulator). The app itself is served
 * from https://localhost, so that needs mixed content and cleartext traffic, which stay off for an https backend:
 * every Play Store build.
 */
const plainHttpBackend = androidApiBaseUrl().startsWith('http://')

/**
 * The Android app: the web build in dist/ inside a native shell (Capacitor). See docs/mobile-app.md.
 * The appId is the app's permanent identity on the Play Store; it cannot change once published.
 */
const config: CapacitorConfig = {
  appId: 'com.myagree.agriscan',
  appName: 'AgriScan',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: plainHttpBackend,
  },
  android: {
    allowMixedContent: plainHttpBackend,
  },
  plugins: {
    SystemBars: {
      // The web app pads its header and tab bar with env(safe-area-inset-*) (index.css: pt-safe, pt-header, ...).
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
      // Dark icons on AgriScan's light header, in light and dark phone themes alike.
      style: 'LIGHT',
    },
  },
}

export default config
