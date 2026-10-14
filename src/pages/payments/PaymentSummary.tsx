import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { PaymentCheckout } from '../../lib/types'

/** What is being paid: the amount, what for, who processes it, and a warning when no real money moves. */
export function PaymentSummary({ checkout }: { checkout: PaymentCheckout }) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <section className="flex flex-col gap-space-sm">
      <div className="flex flex-col items-center gap-1 rounded-2xl bg-primary px-space-md py-space-lg text-center text-on-primary shadow-md">
        <span className="font-label-md text-label-md opacity-90">{t.payments.summary.paying}</span>
        <span className="font-headline-lg text-headline-lg font-bold">{format.inr(checkout.amount)}</span>
        <span className="font-body-sm text-body-sm opacity-90">{checkout.description}</span>
        <span className="mt-space-xs inline-flex items-center gap-1 rounded-full bg-on-primary/15 px-space-sm py-0.5 font-label-sm text-label-sm">
          <Icon name="verified_user" className="text-[16px]" />
          {t.payments.summary.secure(t.payments.providers[checkout.provider])}
        </span>
      </div>
      {checkout.provider === 'SIMULATED' && (
        <p className="flex items-start gap-space-xs rounded-xl border border-dashed border-outline bg-surface-container-low px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant">
          <Icon name="science" className="mt-0.5 text-[18px]" />
          <span>{t.payments.summary.testMode}</span>
        </p>
      )}
    </section>
  )
}
