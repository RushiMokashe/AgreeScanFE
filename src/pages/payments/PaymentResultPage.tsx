import { StackScreen } from '../../components/layout/StackScreen'
import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the store & payments agent builds the payment outcome here
 * (/pay/:paymentId/result) with GET /api/payments/{id}.
 */
export default function PaymentResultPage() {
  const { t } = useI18n()
  return (
    <StackScreen title={t.nav.screens.paymentResult}>
      <PlaceholderPage icon="task_alt" title={t.nav.screens.paymentResult} />
    </StackScreen>
  )
}
