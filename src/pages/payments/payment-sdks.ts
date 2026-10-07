/**
 * The parts of the providers' browser SDKs the checkout uses. Both load from the providers' own sites
 * (see load-script.ts), so their globals are typed here rather than through npm packages.
 */

export const STRIPE_JS = 'https://js.stripe.com/v3/'
export const RAZORPAY_CHECKOUT_JS = 'https://checkout.razorpay.com/v1/checkout.js'

export interface StripeElement {
  mount: (target: HTMLElement) => void
  destroy: () => void
}

export interface StripeElements {
  create: (type: 'payment', options: { layout: 'tabs' | 'accordion' }) => StripeElement
}

export interface StripeInstance {
  elements: (options: { clientSecret: string; appearance: StripeAppearance }) => StripeElements
  confirmPayment: (options: {
    elements: StripeElements
    confirmParams: { return_url: string }
    redirect: 'if_required'
  }) => Promise<{ error?: { message?: string } }>
}

export interface StripeAppearance {
  theme: 'stripe' | 'flat'
  variables: Record<string, string>
}

/** What Razorpay Checkout returns after a successful payment, signed with the merchant's key secret. */
export interface RazorpaySuccess {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  /** The farmer's details, and the method Razorpay opens on. */
  prefill: { name: string; contact: string; method: 'card' | 'upi' }
  theme: { color: string }
  handler: (response: RazorpaySuccess) => void
  modal: { ondismiss: () => void }
}

export interface RazorpayCheckoutInstance {
  open: () => void
  on: (event: 'payment.failed', listener: (response: { error: { description: string } }) => void) => void
}

declare global {
  interface Window {
    Stripe?: (publishableKey: string, options: { locale: string }) => StripeInstance
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckoutInstance
  }
}
