import { StackScreen } from '../../components/layout/StackScreen'
import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the store & payments agent builds checkout here (/pay/:paymentId): GET
 * /api/payments/{id}, then Stripe, Razorpay or the simulated provider, then POST /api/payments/{id}/confirm.
 */
export default function PaymentPage() {
  const { t } = useI18n()
  return (
    <StackScreen title={t.nav.screens.payment}>
      <PlaceholderPage icon="payments" title={t.nav.screens.payment} />
    </StackScreen>
  )
}
