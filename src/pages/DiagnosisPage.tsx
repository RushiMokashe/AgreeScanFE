import { useParams } from 'react-router'
import { ErrorState, LoadingState } from '../components/PageState'
import { useApi } from '../hooks/useApi'
import { useI18n } from '../i18n/i18n-context'
import type { Messages } from '../i18n/translation'
import { api } from '../lib/api'
import type { ScanDetail } from '../lib/types'
import { CauseCard } from './diagnosis/CauseCard'
import { DiagnosisActions } from './diagnosis/DiagnosisActions'
import { DiagnosisHeroCard } from './diagnosis/DiagnosisHeroCard'
import { PrescriptionSection } from './diagnosis/PrescriptionSection'
import { SanitationSteps } from './diagnosis/SanitationSteps'
import { TriageHeader } from './diagnosis/TriageHeader'

/** Scan ids are positive integers. */
const SCAN_ID = /^[1-9]\d*$/

/** `/diagnosis` shows the most recent scan, `/diagnosis/:scanId` a specific one. */
function loadScan(scanId: string | undefined, t: Messages): Promise<ScanDetail> {
  if (scanId === undefined) return api.latestScan()
  if (!SCAN_ID.test(scanId)) return Promise.reject(new Error(t.diagnosis.noSuchScan(scanId)))
  return api.scan(Number(scanId))
}

/** Stitch screen "Diagnosis & Treatment Summary": the diagnosis, its prescription and the next steps. */
export default function DiagnosisPage() {
  const { t } = useI18n()
  const { scanId } = useParams()
  const { data: scan, error, reload } = useApi(() => loadScan(scanId, t), [scanId])
  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!scan) return <LoadingState />

  return (
    <div className="flex flex-col w-full px-margin pb-6 gap-space-lg">
      <TriageHeader healthy={scan.healthy} scannedAt={scan.scannedAt} />
      <DiagnosisHeroCard scan={scan} />
      {scan.cause && <CauseCard cause={scan.cause} climateTrigger={scan.climateTrigger} />}
      {scan.prescription && (
        <PrescriptionSection prescription={scan.prescription} organicAlternative={scan.organicAlternative} />
      )}
      {scan.sanitationSteps.length > 0 && (
        <SanitationSteps
          title={scan.healthy ? t.diagnosis.sanitation.preventive : t.diagnosis.sanitation.field}
          steps={scan.sanitationSteps}
        />
      )}
      <DiagnosisActions prescription={scan.prescription} treatmentPlanId={scan.treatmentPlanId} />
    </div>
  )
}
