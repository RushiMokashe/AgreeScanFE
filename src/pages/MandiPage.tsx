import { ErrorState, LoadingState } from '../components/PageState'
import { useApi } from '../hooks/useApi'
import { useI18n } from '../i18n/i18n-context'
import { api } from '../lib/api'
import type { BuyerInquiry } from '../lib/types'
import { BuyerInquiries } from './mandi/BuyerInquiries'
import { CommodityRates } from './mandi/CommodityRates'
import { GradingGuide } from './mandi/GradingGuide'
import { MandiHelpline } from './mandi/MandiHelpline'
import { MarketHero } from './mandi/MarketHero'
import { TransportCard } from './mandi/TransportCard'

/**
 * Stitch screen "Mandi Market & Crop Demand": live APMC rates, buyer purchase orders, grading tips
 * and mandi transport.
 */
export default function MandiPage() {
  const { t } = useI18n()
  const { data, error, reload, setData } = useApi(() => api.mandi())

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!data) return <LoadingState label={t.mandi.loading} />

  const replaceInquiry = (updated: BuyerInquiry) =>
    setData((current) => ({
      ...current,
      inquiries: current.inquiries.map((inquiry) => (inquiry.id === updated.id ? updated : inquiry)),
    }))

  return (
    <div className="flex flex-col w-full">
      <MarketHero market={data.market} forecast={data.forecast} />
      <CommodityRates commodities={data.commodities} updatedAt={data.pricesUpdatedAt} />
      <BuyerInquiries inquiries={data.inquiries} onInquiryChange={replaceInquiry} />
      <GradingGuide />
      <TransportCard market={data.market} />
      <MandiHelpline market={data.market} />
    </div>
  )
}
