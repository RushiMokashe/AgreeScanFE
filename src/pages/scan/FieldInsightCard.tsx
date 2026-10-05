import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { INSIGHT_TONE_STYLE, type InsightTone } from './scan-utils'

const CARD_CLASS = 'bg-surface-container-low rounded-2xl p-3 shadow-sm flex flex-col justify-between'

interface FieldInsightCardProps {
  label: string
  icon: string
  value: string
  note: string
  tone: InsightTone
  /** Turns the whole card into a link. */
  to?: string
}

/** Field agronomy context card under the shutter deck, e.g. "Field Moisture 78%". */
export function FieldInsightCard({ label, icon, value, note, tone, to }: FieldInsightCardProps) {
  const style = INSIGHT_TONE_STYLE[tone]
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</span>
        <Icon name={icon} className={`text-[18px] ${style.icon}`} />
      </div>
      <div className="mt-2">
        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{value}</span>
        <p className={`font-label-sm text-label-sm font-medium ${style.note}`}>{note}</p>
      </div>
    </>
  )

  if (!to) return <div className={CARD_CLASS}>{content}</div>
  return (
    <Link className={`${CARD_CLASS} hover:bg-surface-container transition-all active:scale-95`} to={to}>
      {content}
    </Link>
  )
}
