import { useState } from 'react'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { BuyerInquiry } from '../../lib/types'

/**
 * Registers the farmer's lot against a buyer inquiry. The endpoint returns the updated inquiry, which
 * is handed to `onInquiryChange`. Callers disable every inquiry action while `pendingId` is set, so
 * responses are applied one at a time.
 */
export function useInquiryResponse(onInquiryChange: (inquiry: BuyerInquiry) => void) {
  const { t } = useI18n()
  const toast = useToast()
  const [pendingId, setPendingId] = useState<number | null>(null)

  const respond = async (inquiry: BuyerInquiry) => {
    setPendingId(inquiry.id)
    try {
      onInquiryChange(await api.respondToInquiry(inquiry.id))
      toast.show(t.mandi.inquiries.registeredWith(inquiry.buyerName))
    } catch (error) {
      toast.show(describeError(error, t.mandi.inquiries.registerFailed), 'error')
    } finally {
      setPendingId(null)
    }
  }

  return { pendingId, respond }
}
