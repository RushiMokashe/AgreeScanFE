import { Link } from 'react-router'
import { Icon } from '../../components/Icon'

interface ServiceTileProps {
  to: string
  icon: string
  title: string
  description: string
}

/** Entry of the "What can you do here?" service grid. */
export function ServiceTile({ to, icon, title, description }: ServiceTileProps) {
  return (
    <Link
      className="flex flex-col gap-1 p-2.5 rounded-lg bg-surface-container-low transition-colors active:bg-surface-container active:scale-95"
      to={to}
    >
      <div className="flex items-center gap-1.5">
        <Icon name={icon} fill className="text-primary text-[20px]" />
        <span className="font-title-md text-[14px] font-bold text-on-surface leading-tight">{title}</span>
      </div>
      <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug">{description}</p>
    </Link>
  )
}
