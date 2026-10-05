import { useI18n } from '../../i18n/i18n-context'
import type { BuyerInquiry } from '../../lib/types'
import { InquiryCard } from './InquiryCard'
import { useInquiryResponse } from './useInquiryResponse'

interface BuyerInquiriesProps {
  inquiries: BuyerInquiry[]
  /** Receives the updated inquiry returned after the farmer responds to it. */
  onInquiryChange: (inquiry: BuyerInquiry) => void
}

/** Open purchase orders from institutional buyers; the chip counts those not yet answered. */
export function BuyerInquiries({ inquiries, onInquiryChange }: BuyerInquiriesProps) {
  const { t } = useI18n()
  const { pendingId, respond } = useInquiryResponse(onInquiryChange)
  const activeCount = inquiries.filter((inquiry) => !inquiry.responded).length

  return (
    <section className="px-margin pt-space-xl">
      <div className="flex items-center justify-between gap-space-sm mb-space-sm">
        <div>
          <h2 className="font-title-md text-title-md text-on-surface font-bold">{t.mandi.inquiries.title}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.mandi.inquiries.subtitle}</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold whitespace-nowrap">
          {t.mandi.inquiries.active(activeCount)}
        </span>
      </div>
      <div className="space-y-space-md">
        {inquiries.map((inquiry) => (
          <InquiryCard
            key={inquiry.id}
            inquiry={inquiry}
            pending={pendingId === inquiry.id}
            disabled={pendingId !== null}
            onRespond={respond}
          />
        ))}
      </div>
    </section>
  )
}
