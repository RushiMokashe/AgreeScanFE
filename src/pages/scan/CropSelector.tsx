import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { CropOption } from '../../lib/types'
import { CropPill } from './CropPill'

interface CropSelectorProps {
  crops: CropOption[]
  /** CropOption.code of the chosen crop, or null for auto-detect. */
  selected: string | null
  onSelect: (code: string | null) => void
  disabled: boolean
}

/** Horizontally scrolling crop pills: "Auto Detect" followed by every supported crop. */
export function CropSelector({ crops, selected, onSelect, disabled }: CropSelectorProps) {
  const { t } = useI18n()
  const autoDetect = selected === null

  return (
    <div
      aria-label={t.scan.crops.label}
      className="w-full overflow-x-auto no-scrollbar px-margin pb-3.5 flex gap-2"
      role="group"
    >
      <CropPill active={autoDetect} disabled={disabled} onClick={() => onSelect(null)}>
        <Icon name="auto_awesome" className="text-[18px]" />
        <span>{autoDetect ? t.scan.crops.autoDetectActive : t.scan.crops.autoDetect}</span>
      </CropPill>
      {crops.map((crop) => (
        <CropPill
          key={crop.code}
          active={selected === crop.code}
          disabled={disabled}
          onClick={() => onSelect(crop.code)}
        >
          <span>
            <span aria-hidden="true">{crop.emoji}</span> {crop.label}
          </span>
        </CropPill>
      ))}
    </div>
  )
}
