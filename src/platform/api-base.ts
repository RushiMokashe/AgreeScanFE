/**
 * Where the backend is. The web app calls it on its own origin ("/api", which Vite proxies to :8080 in
 * development). The installed app is served from https://localhost inside the phone, so its build names the
 * backend's address in VITE_API_BASE_URL (see .env.android).
 */
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

/**
 * The address of a backend path: "/api/scans" on the web, "https://api.example.in/api/scans" in the app. Signed
 * photo links the API returns ("/api/media/scan/42?...") need this too; the app's own files ("/images/...") and
 * absolute URLs are returned as they are.
 */
export function apiUrl(path: string): string {
  return path.startsWith('/api/') ? `${API_ORIGIN}${path}` : path
}
