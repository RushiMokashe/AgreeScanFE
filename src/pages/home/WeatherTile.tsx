import { Icon } from '../../components/Icon'

interface WeatherTileProps {
  icon: string
  value: string
  label: string
}

/** One reading of the microclimate bar, e.g. "68%" / "Humidity". */
export function WeatherTile({ icon, value, label }: WeatherTileProps) {
  return (
    <div className="flex items-center gap-2 bg-surface-container-low p-2.5 rounded-lg">
      <Icon name={icon} className="text-secondary text-[24px]" />
      <div className="flex flex-col min-w-0">
        <span className="font-title-md text-title-md font-bold text-on-surface leading-tight">{value}</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{label}</span>
      </div>
    </div>
  )
}
