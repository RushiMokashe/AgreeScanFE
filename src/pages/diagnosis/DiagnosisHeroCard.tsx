import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { ScanDetail } from '../../lib/types'
import { apiUrl } from '../../platform/api-base'
import { ConfidenceTile } from './ConfidenceTile'
import { cropDisplayName, diagnosticAdvice } from './diagnosis-utils'
import { DiagnosticAudioRow } from './DiagnosticAudioRow'
import { SeverityTile } from './SeverityTile'

interface DiagnosisHeroCardProps {
  scan: ScanDetail
}

/** Scanned photo with the diagnosis, then severity, confidence and the spoken advice. */
export function DiagnosisHeroCard({ scan }: DiagnosisHeroCardProps) {
  const { t } = useI18n()

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
      <div className="relative w-full h-44 bg-surface-container-high overflow-hidden">
        <img
          alt={t.scan.photoAlt(scan.cropLabel, scan.diseaseName)}
          className="w-full h-full object-cover"
          src={apiUrl(scan.imageUrl)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent" />
        {/* One row, so the two chips shrink instead of overlapping on narrow phones */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2">
          {scan.plotLabel && (
            <div className="min-w-0 bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
              <Icon name="eco" fill className="text-secondary text-[16px]" />
              <span className="font-label-sm text-label-sm text-on-surface font-bold truncate">{scan.plotLabel}</span>
            </div>
          )}
          {scan.verifiedBy && (
            <div className="min-w-0 ml-auto bg-primary text-on-primary px-2.5 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
              <Icon name="verified" className="text-[14px]" />
              <span className="truncate">{scan.verifiedBy}</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-on-primary">
          <div>
            <span className="font-label-sm text-label-sm text-secondary-fixed opacity-90 block">
              {cropDisplayName(scan.cropLabel, scan.cropScientificName)}
            </span>
            <h2 className="font-headline-sm text-headline-sm text-surface-container-lowest font-bold leading-tight">
              {scan.diseaseName}
            </h2>
            {scan.pathogen && (
              <span className="font-body-sm text-body-sm text-surface-variant italic">{scan.pathogen}</span>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <SeverityTile severity={scan.severity} stage={scan.severityStage} label={scan.severityLabel} />
          <ConfidenceTile confidence={scan.confidence} />
        </div>
        {scan.audioLanguages && (
          <DiagnosticAudioRow
            languages={scan.audioLanguages}
            durationSeconds={scan.audioDurationSeconds}
            script={diagnosticAdvice(t, scan)}
          />
        )}
      </div>
    </section>
  )
}
