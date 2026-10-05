import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { ScanDetail } from '../../lib/types'
import { liveDiagnosisHint } from './scan-utils'

interface LiveDiagnosisCardProps {
  scan: ScanDetail
}

/** Floating recognition card at the foot of the viewfinder; opens the scan's diagnosis. */
export function LiveDiagnosisCard({ scan }: LiveDiagnosisCardProps) {
  const { t } = useI18n()

  return (
    <Link
      className="self-stretch pointer-events-auto block transition-transform active:scale-95"
      to={`/diagnosis/${scan.id}`}
    >
      <div className="bg-inverse-surface/90 backdrop-blur-md rounded-2xl p-3 shadow-lg flex items-start gap-3 hover:bg-inverse-surface transition-colors">
        <div className="w-10 h-10 rounded-xl bg-tertiary-container flex-shrink-0 flex items-center justify-center text-on-tertiary-container">
          <Icon name="troubleshoot" className="text-[24px]" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed">
              {t.scan.live.title}
            </span>
            <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
              {t.scan.live.match(scan.confidence)}
            </span>
          </div>
          <p className="font-label-md text-label-md text-inverse-on-surface font-semibold truncate">
            {scan.symptom ?? scan.diseaseName}
          </p>
          <p className="font-body-sm text-body-sm text-surface-variant line-clamp-1">{liveDiagnosisHint(t, scan)}</p>
        </div>
      </div>
    </Link>
  )
}
