import { useParams } from 'react-router'
import { Icon } from '../../components/Icon'
import { StackScreen } from '../../components/layout/StackScreen'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { PaymentStatus, PaymentStatusCode } from '../../lib/types'
import { PaymentResultActions } from './PaymentResultActions'
import { usePaymentResult } from './usePaymentResult'

const RESULT_STYLES: Record<PaymentStatusCode, { icon: string; tone: string }> = {
  SUCCEEDED: { icon: 'check_circle', tone: 'bg-primary text-on-primary' },
  PROCESSING: { icon: 'hourglass_top', tone: 'bg-secondary-container text-on-secondary-container' },
  REQUIRES_PAYMENT: { icon: 'pending', tone: 'bg-surface-container-highest text-on-surface-variant' },
  FAILED: { icon: 'error', tone: 'bg-error-container text-error' },
  CANCELLED: { icon: 'cancel', tone: 'bg-surface-container-highest text-on-surface-variant' },
}

/** How a payment ended (/pay/:paymentId/result), and what to do next: view the order or booking, or pay again. */
export default function PaymentResultPage() {
  const { t } = useI18n()
  const paymentId = Number(useParams().paymentId)
  const { payment, error, reload, polling, checkAgain } = usePaymentResult(paymentId)

  return (
    <StackScreen title={t.nav.screens.paymentResult}>
      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : !payment ? (
        <LoadingState label={t.payments.result.checking} />
      ) : (
        <div className="flex flex-col gap-space-md px-margin py-space-lg">
          <PaymentOutcome payment={payment} polling={polling} />
          <PaymentFacts payment={payment} />
          <PaymentResultActions payment={payment} onCheckAgain={checkAgain} />
        </div>
      )}
    </StackScreen>
  )
}

function PaymentOutcome({ payment, polling }: { payment: PaymentStatus; polling: boolean }) {
  const { t } = useI18n()
  const format = useFormat()
  const { icon, tone } = RESULT_STYLES[payment.status]
  const texts = t.payments.result
  const amount = format.inr(payment.amount)
  // A Scan & Pay payment waits for the seller, not a bank, and failing means the seller did not see the money.
  const payee = payment.provider === 'SCAN_AND_PAY' ? payment.payeeName : null
  const title = payee ? texts.scanAndPay.title[payment.status] : texts.title[payment.status]
  const message = payee ? texts.scanAndPay.message[payment.status](amount, payee) : texts.message[payment.status](amount)

  return (
    <section role="status" className="flex flex-col items-center gap-space-xs text-center">
      <div className={`mb-space-xs flex h-20 w-20 items-center justify-center rounded-full shadow-sm ${tone}`}>
        <Icon name={icon} fill className="text-[44px]" />
      </div>
      <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">{title}</h1>
      <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">{message}</p>
      {payment.status === 'FAILED' && payment.failureReason && (
        <p className="font-body-sm text-body-sm text-error">{texts.reason(payment.failureReason)}</p>
      )}
      {polling && (
        <p className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
          <Icon name="progress_activity" className="animate-spin text-[16px]" />
          {texts.stillChecking}
        </p>
      )}
    </section>
  )
}

function PaymentFacts({ payment }: { payment: PaymentStatus }) {
  const { t } = useI18n()
  const format = useFormat()
  const texts = t.payments.result
  const provider = t.payments.providers[payment.provider]
  const facts: [string, string][] = [
    [texts.amount, format.inr(payment.amount)],
    [texts.paidFor, payment.description],
    [texts.provider, payment.payeeName ? `${provider} • ${payment.payeeName}` : provider],
    ...(payment.upiReference ? [[texts.upiReference, payment.upiReference] satisfies [string, string]] : []),
    [texts.reference, `#${payment.paymentId}`],
    [texts.updated, format.dayAndTime(payment.updatedAt)],
  ]

  return (
    <dl className="flex flex-col divide-y divide-surface-container-high rounded-xl bg-surface-container-lowest px-space-md shadow-sm">
      {facts.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-space-md py-space-sm">
          <dt className="font-label-md text-label-md text-on-surface-variant">{label}</dt>
          <dd className="text-right font-body-md text-body-md font-semibold text-on-surface">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
