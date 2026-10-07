/** Scripts loaded so far, by URL: each is added to the page once, however many checkouts ask for it. */
const loaded = new Map<string, Promise<void>>()

/**
 * Loads a payment provider's script (Stripe.js, Razorpay Checkout) from its own site the first time a checkout needs
 * it; providers require loading from their domain rather than bundling. A failed load is forgotten, so a retry tries
 * again.
 */
export function loadScript(src: string): Promise<void> {
  let script = loaded.get(src)
  if (!script) {
    script = new Promise<void>((resolve, reject) => {
      const element = document.createElement('script')
      element.src = src
      element.async = true
      element.onload = () => resolve()
      element.onerror = () => {
        loaded.delete(src)
        element.remove()
        reject(new Error(`Could not load ${src}`))
      }
      document.head.append(element)
    })
    loaded.set(src, script)
  }
  return script
}
