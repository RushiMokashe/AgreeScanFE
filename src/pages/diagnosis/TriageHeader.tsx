import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { TRIAGE_BADGE } from './diagnosis-utils'

interface TriageHeaderProps {
  healthy: boolean
  scannedAt: string
}

/** Result banner above the report: priority triage (diseased) or healthy, and when the leaf was scanned. */
export function TriageHeader({ healthy, scannedAt }: TriageHeaderProps) {
  const { t } = useI18n()
  const format = useFormat()
  const result = healthy ? 'healthy' : 'priority'
  const badge = TRIAGE_BADGE[result]

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center justify-center w-2.5 h-2.5 rounded-full ${badge.dot}`} />
        <span className={`font-label-md text-label-md uppercase tracking-wider font-bold ${badge.text}`}>
          {t.diagnosis.triage[result]}
        </span>
      </div>
      <div className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm">
        <Icon name="schedule" className="text-[15px]" />
        <span>{t.scan.scanned(format.timeAgo(scannedAt))}</span>
      </div>
    </div>
  )
}
