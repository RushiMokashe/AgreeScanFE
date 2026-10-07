import { Navigate, useNavigate, useParams } from 'react-router'
import { StackScreen } from '../../components/layout/StackScreen'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api } from '../../lib/api'
import type { PaymentCheckout, PaymentStatus } from '../../lib/types'
import { PaymentSummary } from './PaymentSummary'
import { RazorpayCheckout } from './RazorpayCheckout'
import { SimulatedCheckout } from './SimulatedCheckout'
import { StripeCheckout } from './StripeCheckout'
import { isFinal, resultPath } from './payment-utils'

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
 * Paying online (/pay/:paymentId, D5) with the provider the server chose: Stripe's Payment Element, Razorpay
 * Checkout, or the simulated test checkout. Once the payment is confirmed the result page shows how it ended.
 */
export default function PaymentPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const paymentId = Number(useParams().paymentId)
  const { data, error, reload } = useApi(() => openCheckout(paymentId), [paymentId])

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

  // Back from the result page skips the finished checkout.
  const showResult = () => navigate(resultPath(checkout.paymentId), { replace: true })

  return (
    <StackScreen title={t.nav.screens.payment}>
      <div className="flex flex-col gap-space-md px-margin py-space-md">
        <PaymentSummary checkout={checkout} />
        {checkout.provider === 'STRIPE' && checkout.stripe && (
          <StripeCheckout checkout={checkout} stripe={checkout.stripe} onDone={showResult} />
        )}
        {checkout.provider === 'RAZORPAY' && checkout.razorpay && (
          <RazorpayCheckout checkout={checkout} razorpay={checkout.razorpay} onDone={showResult} />
        )}
        {checkout.provider === 'SIMULATED' && <SimulatedCheckout checkout={checkout} onDone={showResult} />}
      </div>
    </StackScreen>
  )
}
