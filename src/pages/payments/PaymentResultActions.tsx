import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { PaymentStatus } from '../../lib/types'
import { paidItemPath } from './payment-utils'
import { usePayNow } from './usePayNow'

const PRIMARY =
  'flex min-h-[52px] w-full items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg font-label-lg text-label-lg text-on-primary shadow-md active:scale-[0.99] disabled:opacity-60'
const SECONDARY =
  'flex min-h-[48px] w-full items-center justify-center gap-space-xs rounded-xl border border-outline-variant font-label-lg text-label-lg text-primary active:bg-surface-container'

interface PaymentResultActionsProps {
  payment: PaymentStatus
  onCheckAgain: () => void
}

/**
 * The next step for each outcome: a paid order or booking can be viewed, a failed or closed payment retried with a
 * new one, an unfinished one continued, and a processing one checked again.
 */
export function PaymentResultActions({ payment, onCheckAgain }: PaymentResultActionsProps) {
  const { t } = useI18n()
  const { paying, payNow } = usePayNow()
  const texts = t.payments.result
  const itemPath = paidItemPath(payment.purpose, payment.referenceId)
  const viewItem = texts.viewItem[payment.purpose]

  const primary = (() => {
    switch (payment.status) {
      case 'SUCCEEDED':
        return (
          <Link to={itemPath} replace className={PRIMARY}>
            <Icon name={payment.purpose === 'STORE_ORDER' ? 'receipt_long' : 'event_available'} className="text-[20px]" />
            {viewItem}
          </Link>
        )
      case 'PROCESSING':
        return (
          <button type="button" onClick={onCheckAgain} className={PRIMARY}>
            <Icon name="refresh" className="text-[20px]" />
            {texts.refresh}
          </button>
        )
      case 'REQUIRES_PAYMENT':
        return (
          <Link to={`/pay/${payment.paymentId}`} replace className={PRIMARY}>
            <Icon name="lock" className="text-[20px]" />
            {texts.continue}
          </Link>
        )
      case 'FAILED':
      case 'CANCELLED':
        return (
          <button
            type="button"
            disabled={paying !== null}
            aria-busy={paying !== null}
            onClick={() => void payNow({ purpose: payment.purpose, referenceId: payment.referenceId })}
            className={PRIMARY}
          >
            <Icon
              name={paying ? 'progress_activity' : 'replay'}
              className={`text-[20px] ${paying ? 'animate-spin' : ''}`}
            />
            {paying ? t.payments.loading : texts.tryAgain}
          </button>
        )
    }
  })()

  return (
    <section className="flex flex-col gap-space-sm">
      {primary}
      {payment.status === 'SUCCEEDED' ? (
        <Link to="/" replace className={SECONDARY}>
          <Icon name="home" className="text-[20px]" />
          {texts.home}
        </Link>
      ) : (
        <Link to={itemPath} replace className={SECONDARY}>
          {viewItem}
        </Link>
      )}
    </section>
  )
}
