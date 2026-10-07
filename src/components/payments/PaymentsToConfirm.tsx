import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { api, describeError } from '../../lib/api'
import { COUNTRY_CODE, formatPhone } from '../../lib/phone'
import type { PaymentPurpose, SellerPayment } from '../../lib/types'
import { useNotificationRefresh } from '../../notifications/useNotificationRefresh'
import { ReasonSheet } from '../booking/ReasonSheet'
import { Icon } from '../Icon'
import { useToast } from '../toast/toast-context'

/** Where the seller's notification about a Scan & Pay payment points, per purpose. */
const NOTIFICATION_ROUTES: Record<PaymentPurpose, string> = {
  STORE_ORDER: '/shop/orders',
  RENTAL_BOOKING: '/owner/bookings/',
}

interface PaymentsToConfirmProps {
  purpose: PaymentPurpose
  /** Only the payments of this order or booking; all of the purpose's when left out. */
  referenceId?: number
  /** Called after the seller decided, e.g. to reload the order or booking. */
  onDecided?: (payment: SellerPayment) => void
}

/**
 * The Scan & Pay payments farmers sent the shopkeeper or vehicle owner that wait for their word: what for, how much,
 * who paid (tap to call) and the UPI reference to look for in their bank. "Received" settles the payment; "Not
 * received" lets the farmer pay again. Shows nothing while there is nothing to confirm.
 */
export function PaymentsToConfirm({ purpose, referenceId, onDecided }: PaymentsToConfirmProps) {
  const { t } = useI18n()
  const format = useFormat()
  const toast = useToast()
  const texts = t.payments.seller
  const { data, error, reload, setData } = useApi(() => api.seller.payments('PROCESSING'))
  const [deciding, setDeciding] = useState<number | null>(null)
  const [notReceivedFor, setNotReceivedFor] = useState<SellerPayment | null>(null)
  useNotificationRefresh((route) => route.startsWith(NOTIFICATION_ROUTES[purpose]), reload)

  const payments = (data ?? []).filter(
    (payment) => payment.purpose === purpose && (referenceId === undefined || payment.referenceId === referenceId),
  )
  if (error || payments.length === 0) return null

  const decided = (payment: SellerPayment) => {
    setData((current) => current.filter((pending) => pending.paymentId !== payment.paymentId))
    onDecided?.(payment)
  }

  const received = async (payment: SellerPayment) => {
    setDeciding(payment.paymentId)
    try {
      decided(await api.seller.received(payment.paymentId))
      toast.show(texts.receivedDone(format.inr(payment.amount)))
    } catch (failure) {
      toast.show(describeError(failure, texts.failed), 'error')
    } finally {
      setDeciding(null)
    }
  }

  const notReceived = async (payment: SellerPayment, reason: string | null) => {
    decided(await api.seller.notReceived(payment.paymentId, reason))
    setNotReceivedFor(null)
    toast.show(texts.notReceivedDone, 'info')
  }

  return (
    <section className="flex flex-col gap-space-sm rounded-2xl bg-tertiary-fixed/40 p-space-md">
      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-space-xs font-title-md text-title-md font-bold text-on-surface">
          <Icon name="qr_code_scanner" className="text-[22px] text-primary" />
          {texts.toConfirm} ({format.number(payments.length)})
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{texts.checkBank}</p>
      </div>
      <ul className="flex flex-col gap-space-sm">
        {payments.map((payment) => (
          <li key={payment.paymentId} className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex min-w-0 flex-col">
                <span className="font-title-md text-title-md font-bold text-on-surface">{payment.description}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {texts.paidBy(payment.payerName)} • {texts.sent(format.timeAgo(payment.submittedAt))}
                </span>
              </div>
              <span className="flex-shrink-0 font-headline-sm text-headline-sm font-bold text-primary">
                {format.inr(payment.amount)}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <span className="rounded-lg bg-surface-container px-space-sm py-1 font-label-md text-label-md text-on-surface">
                {texts.reference} <span className="font-bold tracking-wider">{payment.upiReference}</span>
              </span>
              <a
                href={`tel:${COUNTRY_CODE}${payment.payerPhone}`}
                aria-label={texts.call(payment.payerName)}
                className="flex min-h-[44px] items-center gap-1 px-space-xs font-label-md text-label-md text-primary"
              >
                <Icon name="call" className="text-[18px]" />
                {formatPhone(payment.payerPhone)}
              </a>
            </div>
            <div className="grid grid-cols-2 gap-space-sm">
              <button
                type="button"
                disabled={deciding !== null}
                onClick={() => setNotReceivedFor(payment)}
                className="flex min-h-[48px] items-center justify-center gap-1 rounded-xl border border-error/40 font-label-lg text-label-lg text-error active:bg-error-container disabled:opacity-60"
              >
                <Icon name="close" className="text-[20px]" />
                {texts.notReceived}
              </button>
              <button
                type="button"
                disabled={deciding !== null}
                aria-busy={deciding === payment.paymentId}
                onClick={() => void received(payment)}
                className="flex min-h-[48px] items-center justify-center gap-1 rounded-xl bg-primary font-label-lg text-label-lg text-on-primary shadow-sm active:scale-[0.99] disabled:opacity-60"
              >
                <Icon
                  name={deciding === payment.paymentId ? 'progress_activity' : 'check'}
                  className={`text-[20px] ${deciding === payment.paymentId ? 'animate-spin' : ''}`}
                />
                {texts.received}
              </button>
            </div>
          </li>
        ))}
      </ul>
      {notReceivedFor && (
        <ReasonSheet
          title={texts.notReceivedTitle}
          message={texts.notReceivedMessage}
          quickReasons={[texts.quickReasons.notInAccount, texts.quickReasons.wrongAmount, texts.quickReasons.wrongReference]}
          confirmLabel={texts.notReceivedConfirm}
          busyLabel={texts.saving}
          onConfirm={(reason) => notReceived(notReceivedFor, reason)}
          onClose={() => setNotReceivedFor(null)}
        />
      )}
    </section>
  )
}
