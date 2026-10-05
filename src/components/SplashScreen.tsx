import { APP_NAME, BRAND_MARK_URL } from './layout/constants'

/**
 * The brand mark and a spinner while the app starts: before the texts of the saved language or the signed-in
 * session are ready. It has no text to translate, and a CSS spinner because the icon font may still be loading.
 */
export function SplashScreen() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={APP_NAME}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-space-md bg-surface"
    >
      <img alt="" className="h-14 w-14" src={BRAND_MARK_URL} />
      <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
    </div>
  )
}
