import { useState } from 'react'
import { FormError } from '../../components/form/FormError'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { api, describeError } from '../../lib/api'
import type { PaymentCheckout, RazorpayCheckout as RazorpaySession } from '../../lib/types'
import { loadScript } from './load-script'
import { RAZORPAY_CHECKOUT_JS } from './payment-sdks'

/** AgriScan's primary green, so Razorpay's window looks like part of the app. */
const THEME_COLOR = '#00450d'

interface RazorpayCheckoutProps {
  checkout: PaymentCheckout
  razorpay: RazorpaySession
  /** Opens Razorpay on the method the farmer picked; Razorpay still offers the others. */
  method: 'CARD' | 'UPI'
  onDone: (paymentId: number) => void
}

/**
 * Razorpay Checkout (UPI, cards, net banking, wallets), opened over the page. Razorpay signs a successful payment; the
 * server verifies that signature before the payment counts. A failed attempt can be retried in the same window.
 */
export function RazorpayCheckout({ checkout, razorpay, method, onDone }: RazorpayCheckoutProps) {
  const { t } = useI18n()
  const format = useFormat()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  const open = async () => {
    setBusy(true)
    setError(undefined)
    try {
      await loadScript(RAZORPAY_CHECKOUT_JS)
    } catch {
      setError(t.payments.scriptFailed)
      setBusy(false)
      return
    }
    const Razorpay = window.Razorpay
    if (!Razorpay) {
      setError(t.payments.scriptFailed)
      setBusy(false)
      return
    }
    const instance = new Razorpay({
      key: razorpay.keyId,
      amount: razorpay.amountPaise,
      currency: razorpay.currency,
      order_id: razorpay.orderId,
      name: razorpay.merchantName,
      description: razorpay.description,
      prefill: {
        name: razorpay.prefillName,
        contact: razorpay.prefillContact,
        method: method === 'CARD' ? 'card' : 'upi',
      },
      theme: { color: THEME_COLOR },
      handler: (response) => {
        api.payments
          .confirm(checkout.paymentId, {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          })
          .then(() => onDone(checkout.paymentId), (failure: unknown) => {
            setError(describeError(failure, t.payments.confirmFailed))
            setBusy(false)
          })
      },
      modal: { ondismiss: () => setBusy(false) },
    })
    instance.on('payment.failed', (response) => setError(t.payments.razorpay.failed(response.error.description)))
    instance.open()
  }

  return (
    <div className="flex flex-col gap-space-md">
      {error && <FormError message={error} />}
      <button
        type="button"
        disabled={busy}
        aria-busy={busy}
        onClick={() => void open()}
        className="flex min-h-[52px] w-full items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg font-label-lg text-label-lg text-on-primary shadow-md active:scale-[0.99] disabled:opacity-60"
      >
        <Icon name={busy ? 'progress_activity' : 'lock'} className={`text-[20px] ${busy ? 'animate-spin' : ''}`} />
        {t.payments.razorpay.open(format.inr(checkout.amount))}
      </button>
    </div>
  )
}
