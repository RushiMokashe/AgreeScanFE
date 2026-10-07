import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { PaymentPurpose } from '../../lib/types'

/** What a farmer pays for online: an order or a booking. */
export interface PaymentTarget {
  purpose: PaymentPurpose
  referenceId: number
}

/**
 * Pays an order or booking online: opens (or reopens) its payment and goes to the payment page (D5). `paying` names
 * the target while the payment opens, so its button can show a spinner and the others wait.
 */
export function usePayNow() {
  const { t } = useI18n()
  const toast = useToast()
  const navigate = useNavigate()
  const [paying, setPaying] = useState<PaymentTarget | null>(null)

  /**
   * Resolves to whether the payment page opened. Otherwise the farmer is told why: by default the server's reason,
   * or what `describe` says instead.
   */
  const payNow = async (
    target: PaymentTarget,
    describe: (error: unknown) => string = (error) => describeError(error, t.payments.startFailed),
  ): Promise<boolean> => {
    setPaying(target)
    try {
      const checkout = await api.payments.create(target)
      navigate(`/pay/${checkout.paymentId}`)
      return true
    } catch (error) {
      toast.show(describe(error), 'error')
      return false
    } finally {
      setPaying(null)
    }
  }

  return { paying, payNow }
}
