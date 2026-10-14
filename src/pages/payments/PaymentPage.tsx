import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { StackScreen } from '../../components/layout/StackScreen'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api } from '../../lib/api'
import type { PaymentCheckout, PaymentStatus } from '../../lib/types'
import { PaymentSummary } from './PaymentSummary'
import { RazorpayCheckout } from './RazorpayCheckout'
import { ScanAndPayCheckout } from './ScanAndPayCheckout'
import { SimulatedCardForm } from './SimulatedCardForm'
import { SimulatedUpiForm } from './SimulatedUpiForm'
import { StripeCheckout } from './StripeCheckout'
import { PAYMENT_METHOD_CHOICES, type PaymentMethodChoice } from './payment-methods'
import { isFinal, resultPath } from './payment-utils'
import { PaymentMethodTabs } from './PaymentMethodTabs'

/** A payment still to pay comes with its checkout; one already paid, failed or processing only has its status. */
type Opened = { checkout: PaymentCheckout } | { settled: PaymentStatus }

/**
 * The payment's checkout session. Asking for the payment again returns the same open payment with its provider
 * session, or a fresh one if it went stale (for instance the amount changed); either way it is current.
 */
async function openCheckout(paymentId: number): Promise<Opened> {
  const payment = await api.payments.get(paymentId)
  if (isFinal(payment.status) || payment.status === 'PROCESSING') return { settled: payment }
  return { checkout: await api.payments.create({ purpose: payment.purpose, referenceId: payment.referenceId }) }
}

/**
 * Paying online (/pay/:paymentId, D5): by UPI or card with the provider the server chose (Stripe's Payment Element,
 * Razorpay Checkout, or the simulated test checkout), or by Scan & Pay straight to the seller when they offer it. Once
 * the payment is confirmed, or sent to the seller, the result page shows how it stands.
 */
export default function PaymentPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const paymentId = Number(useParams().paymentId)
  const { data, error, reload } = useApi(() => openCheckout(paymentId), [paymentId])
  const [method, setMethod] = useState<PaymentMethodChoice>(PAYMENT_METHOD_CHOICES[0])

  if (error) {
    return (
      <StackScreen title={t.nav.screens.payment}>
        <ErrorState error={error} onRetry={reload} />
      </StackScreen>
    )
  }
  if (!data) {
    return (
      <StackScreen title={t.nav.screens.payment}>
        <LoadingState label={t.payments.loading} />
      </StackScreen>
    )
  }
  if ('settled' in data) return <Navigate replace to={resultPath(data.settled.paymentId)} />

  const { checkout } = data
  // A stale payment was replaced: the address follows the new one, so a reload reopens it.
  if (checkout.paymentId !== paymentId) return <Navigate replace to={`/pay/${checkout.paymentId}`} />

  // Back from the result page skips the finished checkout. A Scan & Pay payment is a new payment of its own.
  const showResult = (settledPaymentId: number) => navigate(resultPath(settledPaymentId), { replace: true })

  return (
    <StackScreen title={t.nav.screens.payment}>
      <div className="flex flex-col gap-space-md px-margin py-space-md">
        <PaymentSummary checkout={checkout} />
        <PaymentMethodTabs value={method} onChange={setMethod} scanAndPayOffered={checkout.scanAndPay !== null} />
        <CheckoutForMethod key={method} checkout={checkout} method={method} onDone={showResult} />
      </div>
    </StackScreen>
  )
}

interface CheckoutForMethodProps {
  checkout: PaymentCheckout
  method: PaymentMethodChoice
  onDone: (paymentId: number) => void
}

/**
 * The form for the chosen method. Card and UPI go through the active provider: the test checkout's own forms, or
 * Stripe's and Razorpay's widgets, which offer both. Scan & Pay goes straight to the seller.
 */
function CheckoutForMethod({ checkout, method, onDone }: CheckoutForMethodProps) {
  if (method === 'SCAN_AND_PAY') {
    return checkout.scanAndPay && <ScanAndPayCheckout checkout={checkout} option={checkout.scanAndPay} onDone={onDone} />
  }
  switch (checkout.provider) {
    case 'STRIPE':
      return checkout.stripe && <StripeCheckout checkout={checkout} stripe={checkout.stripe} onDone={onDone} />
    case 'RAZORPAY':
      return (
        checkout.razorpay && (
          <RazorpayCheckout checkout={checkout} razorpay={checkout.razorpay} method={method} onDone={onDone} />
        )
      )
    case 'SIMULATED':
      return method === 'CARD' ? (
        <SimulatedCardForm checkout={checkout} onDone={onDone} />
      ) : (
        <SimulatedUpiForm checkout={checkout} onDone={onDone} />
      )
    case 'SCAN_AND_PAY':
      return null
  }
}
