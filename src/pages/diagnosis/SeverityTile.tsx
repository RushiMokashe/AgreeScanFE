import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { Severity } from '../../lib/types'
import { SEVERITY_TILE_STYLE, severityTitle } from './diagnosis-utils'

interface SeverityTileProps {
  severity: Severity
  stage: number | null
  /** e.g. "Severe Risk • Spreading" */
  label: string
}

/** Severity half of the hero card's result grid. */
export function SeverityTile({ severity, stage, label }: SeverityTileProps) {
  const { t } = useI18n()
  const style = SEVERITY_TILE_STYLE[severity]

  return (
    <div className={`p-2.5 rounded-lg flex flex-col justify-between ${style.container}`}>
      <div className={`flex items-center gap-1 ${style.text}`}>
        <Icon name={style.icon} fill={style.fill} className="text-[18px]" />
        <span className="font-label-sm text-label-sm font-bold">{severityTitle(t, severity, stage)}</span>
      </div>
      <span className={`font-label-md text-label-md font-semibold mt-1 ${style.text}`}>{label}</span>
    </div>
  )
}
