import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { ScanSummary } from '../../lib/types'

interface HealthyScanCardProps {
  scan: ScanSummary
}

/** Compact history card for a scan that found no disease. */
export function HealthyScanCard({ scan }: HealthyScanCardProps) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <Link
      className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-space-md active:scale-[0.98]"
      to={`/diagnosis/${scan.id}`}
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
        <img
          alt={t.scan.photoAlt(scan.cropLabel, scan.diseaseName)}
          className="w-full h-full object-cover"
          src={scan.imageUrl}
        />
        <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface font-label-sm text-[9px] font-bold">
          {scan.confidence}%
        </span>
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-title-md text-title-md font-bold text-on-surface truncate">{scan.diseaseName}</span>
          <Icon name="check_circle" fill className="text-[16px] text-secondary" />
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {scan.cropLabel} • {format.timeAgo(scan.scannedAt)}
        </span>
        {scan.note && (
          <span className="font-label-sm text-label-sm text-secondary font-semibold mt-0.5">{scan.note}</span>
        )}
      </div>
      <Icon name="chevron_right" className="text-on-surface-variant text-[20px]" />
    </Link>
  )
}
