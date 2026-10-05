import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { ScanSummary } from '../../lib/types'

interface DiseasedScanCardProps {
  scan: ScanSummary
}

/**
 * Large history card for a scan that found a disease. The whole card opens the diagnosis (the title link
 * is stretched over it); the prescription strip at the bottom is a separate link to the stockists.
 */
export function DiseasedScanCard({ scan }: DiseasedScanCardProps) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <article className="relative p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm active:scale-[0.98]">
      <div className="flex gap-space-md">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
          <img
            alt={t.scan.photoAlt(scan.cropLabel, scan.diseaseName)}
            className="w-full h-full object-cover"
            src={scan.imageUrl}
          />
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface font-label-sm text-[10px] font-bold">
            {t.home.scans.confidence(scan.confidence)}
          </span>
        </div>
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <div className="flex items-center gap-1.5">
            <Link
              className="font-title-md text-title-md font-bold text-on-surface truncate after:absolute after:inset-0"
              to={`/diagnosis/${scan.id}`}
            >
              {scan.diseaseName}
            </Link>
            <span className="w-2 h-2 rounded-full bg-error flex-shrink-0" />
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {scan.cropLabel} • {t.scan.scanned(format.dayAndTime(scan.scannedAt))}
          </span>
          {scan.prescriptionShort && (
            <div className="mt-1 flex items-center gap-1 text-secondary font-label-sm text-label-sm font-bold">
              <Icon name="medication" className="text-[16px]" />
              <span className="truncate">{t.home.scans.prescription(scan.prescriptionShort)}</span>
            </div>
          )}
        </div>
      </div>
      {scan.prescriptionShort && (
        <Link
          className="relative z-10 min-h-[44px] flex items-center justify-between bg-surface-container-low px-2.5 pt-space-xs pb-2.5 rounded-lg active:scale-95"
          to="/treatment"
        >
          <div className="flex items-center gap-1.5">
            <Icon name="local_pharmacy" fill className="text-[18px] text-primary" />
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {t.home.scans.stockists(scan.stockistCount)}
            </span>
          </div>
          <span className="font-label-md text-label-md text-primary font-bold flex items-center gap-0.5 flex-shrink-0">
            <span>{t.home.scans.viewPrescription}</span>
            <Icon name="arrow_forward" className="text-[16px]" />
          </span>
        </Link>
      )}
    </article>
  )
}
