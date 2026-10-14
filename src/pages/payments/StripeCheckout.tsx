import { useEffect, useRef, useState, type FormEvent } from 'react'
import { FormError } from '../../components/form/FormError'
import { SubmitButton } from '../../components/form/SubmitButton'
import { LoadingState } from '../../components/PageState'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { api, describeError } from '../../lib/api'
import type { PaymentCheckout, StripeCheckout as StripeSession } from '../../lib/types'
import { loadScript } from './load-script'
import { resultPath } from './payment-utils'
import { STRIPE_JS, type StripeAppearance, type StripeElements, type StripeInstance } from './payment-sdks'

/** Stripe's Payment Element in AgriScan's colours, corners and type. */
const APPEARANCE: StripeAppearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#00450d',
    colorText: '#181c20',
    colorDanger: '#ba1a1a',
    borderRadius: '12px',
    fontFamily: '"Public Sans", "Noto Sans Devanagari", system-ui, sans-serif',
  },
}

/** Stripe picks the language from the browser; it has no Marathi, so it is never forced to one. */
const STRIPE_LOCALE = 'auto'

interface StripeCheckoutProps {
  checkout: PaymentCheckout
  stripe: StripeSession
  onDone: (paymentId: number) => void
}

/**
 * Stripe's Payment Element: cards, and UPI on India-enabled Stripe accounts. A payment that needs a bank's check comes
 * back to the result page, which confirms it; the rest is confirmed here.
 */
export function StripeCheckout({ checkout, stripe: session, onDone }: StripeCheckoutProps) {
  const { t } = useI18n()
  const format = useFormat()
  const mountRef = useRef<HTMLDivElement>(null)
  const [stripe, setStripe] = useState<{ instance: StripeInstance; elements: StripeElements }>()
  const [loadFailed, setLoadFailed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let element: { destroy: () => void } | undefined
    let cancelled = false
    loadScript(STRIPE_JS).then(
      () => {
        const target = mountRef.current
        if (cancelled || !window.Stripe || !target) return
        const instance = window.Stripe(session.publishableKey, { locale: STRIPE_LOCALE })
        const elements = instance.elements({ clientSecret: session.clientSecret, appearance: APPEARANCE })
        const paymentElement = elements.create('payment', { layout: 'tabs' })
        paymentElement.mount(target)
        element = paymentElement
        setStripe({ instance, elements })
      },
      () => {
        if (!cancelled) setLoadFailed(true)
      },
    )
    return () => {
      cancelled = true
      element?.destroy()
    }
  }, [session.publishableKey, session.clientSecret])

  const pay = async (event: FormEvent) => {
    event.preventDefault()
    if (!stripe) return
    setBusy(true)
    setError(undefined)
    const result = await stripe.instance.confirmPayment({
      elements: stripe.elements,
      confirmParams: { return_url: `${window.location.origin}${resultPath(checkout.paymentId)}` },
      redirect: 'if_required',
    })
    if (result.error) {
      setError(result.error.message ?? t.payments.confirmFailed)
      setBusy(false)
      return
    }
    try {
      await api.payments.confirm(checkout.paymentId)
      onDone(checkout.paymentId)
    } catch (failure) {
      setError(describeError(failure, t.payments.confirmFailed))
      setBusy(false)
    }
  }

  if (loadFailed) return <FormError message={t.payments.scriptFailed} />

  return (
    <form noValidate onSubmit={(event) => void pay(event)} className="flex flex-col gap-space-md">
      {!stripe && <LoadingState label={t.payments.stripeLoading} />}
      <div ref={mountRef} />
      {error && <FormError message={error} />}
      <SubmitButton busy={busy} busyLabel={t.payments.paying} icon="lock" disabled={!stripe}>
        {t.payments.pay(format.inr(checkout.amount))}
      </SubmitButton>
    </form>
  )
}
