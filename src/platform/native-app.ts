import { App } from '@capacitor/app'
import { isNativeApp } from './native'

/** Whether a modal sheet or drawer is open; each closes on Escape (hooks/useModalFocus). */
function modalIsOpen(): boolean {
  return document.querySelector('[role="dialog"][aria-modal="true"]') !== null
}

/**
 * Wires the installed app to Android. The back button closes an open sheet first, then goes back a screen, and
 * leaves the app from its first screen, as Android users expect. Does nothing in a browser.
 */
export function startNativeApp(): void {
  if (!isNativeApp) return
  void App.addListener('backButton', ({ canGoBack }) => {
    if (modalIsOpen()) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    } else if (canGoBack) {
      window.history.back()
    } else {
      void App.exitApp()
    }
  })
}
