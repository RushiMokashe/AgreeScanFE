import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useApi } from '../../hooks/useApi'
import { api } from '../../lib/api'
import { useNotificationRefresh } from '../../notifications/useNotificationRefresh'
import { paidItemPath } from './payment-utils'

const POLL_INTERVAL_MS = 2_000
/** About half a minute of polling; after that the farmer can check again, and a notification still updates it. */
const MAX_POLLS = 15

/** Stripe adds this (with the PaymentIntent's id) to the return URL after a bank's check, e.g. 3-D Secure. */
const STRIPE_RETURN_PARAM = 'redirect_status'

/**
 * A payment's outcome, kept current. Back from a Stripe redirect it is confirmed first (the server re-reads the
 * PaymentIntent; webhooks may not reach this server). While the bank is processing it is polled, and it reloads when
 * the payment's notification arrives.
 */
export function usePaymentResult(paymentId: number) {
  const [searchParams, setSearchParams] = useSearchParams()
  const returnedFromStripe = searchParams.has(STRIPE_RETURN_PARAM)
  const { data: payment, error, reload, setData } = useApi(
    () => (returnedFromStripe ? api.payments.confirm(paymentId) : api.payments.get(paymentId)),
    [paymentId],
  )
  const [polls, setPolls] = useState(0)
  const status = payment?.status

  // Confirmed once: later reloads only read the status.
  useEffect(() => {
    if (payment && returnedFromStripe) setSearchParams({}, { replace: true })
  }, [payment, returnedFromStripe, setSearchParams])

  useEffect(() => {
    if (status !== 'PROCESSING' || polls >= MAX_POLLS) return
    const timer = window.setTimeout(() => {
      api.payments
        .get(paymentId)
        .then(setData, () => undefined)
        .finally(() => setPolls((count) => count + 1))
    }, POLL_INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [paymentId, status, polls, setData])

  useNotificationRefresh(
    (route) => payment !== undefined && route === paidItemPath(payment.purpose, payment.referenceId),
    reload,
  )

  const checkAgain = () => {
    setPolls(0)
    reload()
  }

  return { payment, error, reload, polling: status === 'PROCESSING' && polls < MAX_POLLS, checkAgain }
}
