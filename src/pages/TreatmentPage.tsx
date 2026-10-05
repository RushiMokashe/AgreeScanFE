import { useParams } from 'react-router'
import { useApi } from '../hooks/useApi'
import { useI18n } from '../i18n/i18n-context'
import { api } from '../lib/api'
import { AgronomistCard } from './treatment/AgronomistCard'
import { NearbyStores } from './treatment/NearbyStores'
import { ProtocolTimeline } from './treatment/ProtocolTimeline'
import { SectionLoader } from './treatment/SectionLoader'
import { TreatmentPlanBanner } from './treatment/TreatmentPlanBanner'

/**
 * Stitch screen "Treatment Tracker & Agro Stores": the active treatment plan (or /treatment/:planId),
 * dealers stocking its products, and the agronomist on duty. Each part loads on its own.
 */
export default function TreatmentPage() {
  const { t } = useI18n()
  const { planId } = useParams()
  const plan = useApi(() => (planId ? api.treatmentPlan(Number(planId)) : api.activeTreatmentPlan()), [planId])
  const stock = useApi(() => api.nearbyStock())
  const agronomist = useApi(() => api.agronomist())

  return (
    <div className="flex flex-col w-full px-margin pb-space-lg gap-space-lg">
      <SectionLoader state={plan} loadingLabel={t.treatment.plan.loading} errorTitle={t.treatment.plan.loadFailed}>
        {(data) => (
          <>
            <TreatmentPlanBanner plan={data} />
            <ProtocolTimeline plan={data} onPlanChange={plan.setData} />
          </>
        )}
      </SectionLoader>
      <SectionLoader state={stock} loadingLabel={t.treatment.stores.loading} errorTitle={t.treatment.stores.loadFailed}>
        {(data) => <NearbyStores stock={data} />}
      </SectionLoader>
      <SectionLoader
        state={agronomist}
        loadingLabel={t.treatment.agronomist.loading}
        errorTitle={t.treatment.agronomist.loadFailed}
      >
        {(data) => <AgronomistCard agronomist={data} />}
      </SectionLoader>
    </div>
  )
}
