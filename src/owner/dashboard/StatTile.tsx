import { Link } from 'react-router'
import { Icon } from '../../components/Icon'

interface StatTileProps {
  icon: string
  label: string
  value: string
  /** A screen with the details, e.g. the waiting requests. */
  to?: string
  /** Draws attention, e.g. to requests waiting for an answer. */
  highlighted?: boolean
}

/** One number of the owner's dashboard. */
export function StatTile({ icon, label, value, to, highlighted = false }: StatTileProps) {
  const className = `flex flex-col gap-1 rounded-xl p-space-sm shadow-sm ${
    highlighted ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container-lowest text-on-surface'
  }`
  const content = (
    <>
      <Icon name={icon} className="text-[22px]" />
      <span className="font-headline-sm text-headline-sm font-bold leading-tight">{value}</span>
      <span className="font-label-sm text-label-sm opacity-80">{label}</span>
    </>
  )

  return to ? (
    <Link to={to} className={`${className} active:opacity-80`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  )
}
