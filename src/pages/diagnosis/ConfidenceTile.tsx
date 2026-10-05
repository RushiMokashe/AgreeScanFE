import { useI18n } from '../../i18n/i18n-context'
import { patternMatchLabel } from './diagnosis-utils'

interface ConfidenceTileProps {
  /** 0-100 */
  confidence: number
}

/** Model confidence with a proportional bar. */
export function ConfidenceTile({ confidence }: ConfidenceTileProps) {
  const { t } = useI18n()

  return (
    <div className="bg-surface-container p-2.5 rounded-lg flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
          {t.diagnosis.confidence.title}
        </span>
        <span className="font-label-sm text-label-sm text-secondary font-bold">{confidence}%</span>
      </div>
      <div aria-hidden="true" className="w-full bg-surface-container-highest h-2 rounded-full mt-1.5 overflow-hidden">
        <div className="bg-secondary h-full rounded-full" style={{ width: `${confidence}%` }} />
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
        {patternMatchLabel(t, confidence)}
      </span>
    </div>
  )
}
