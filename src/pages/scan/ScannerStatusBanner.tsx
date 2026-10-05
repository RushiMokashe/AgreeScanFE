import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { MessageSelector } from '../../i18n/translation'

interface ReadinessChip {
  icon: string
  label: MessageSelector
  className: string
}

/** Capture-readiness checks shown under the model name. */
const READINESS_CHIPS: readonly ReadinessChip[] = [
  { icon: 'wb_sunny', label: (t) => t.scan.status.naturalLight, className: 'text-secondary font-semibold' },
  { icon: 'center_focus_strong', label: (t) => t.scan.status.macroLock, className: 'text-secondary font-semibold' },
  { icon: 'signal_cellular_alt', label: (t) => t.scan.status.offlineCache, className: 'text-outline' },
]

interface ScannerStatusBannerProps {
  /** e.g. "Neural AI Vision v4.2" */
  modelVersion: string
}

/** Status guidance banner at the top of the scanner. */
export function ScannerStatusBanner({ modelVersion }: ScannerStatusBannerProps) {
  const { t } = useI18n()

  return (
    <div className="px-margin pt-2 pb-3">
      <div className="bg-surface-container-low rounded-xl p-3 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
            <span className="font-label-md text-label-md text-on-surface flex items-center gap-1">
              <Icon name="psychology" className="text-[18px] text-secondary" />
              {t.scan.status.live(modelVersion)}
            </span>
          </div>
          <span className="flex-shrink-0 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-2.5 py-0.5 rounded-full">
            {t.scan.status.fieldReady}
          </span>
        </div>
        <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-1">
          {READINESS_CHIPS.map((chip) => (
            <span key={chip.icon} className={`flex items-center gap-1 ${chip.className}`}>
              <Icon name={chip.icon} className="text-[16px]" />
              {chip.label(t)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
