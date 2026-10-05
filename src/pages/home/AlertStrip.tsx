import { Icon } from '../../components/Icon'
import { ALERT_STRIP_STYLE, type UrgentAlert } from './home-utils'

interface AlertStripProps {
  alert: UrgentAlert
}

/** Disease precaution strip at the foot of the weather card. */
export function AlertStrip({ alert }: AlertStripProps) {
  const style = ALERT_STRIP_STYLE[alert.severity]

  return (
    <div className={`px-space-md py-space-sm flex items-start gap-space-sm ${style.container}`}>
      <Icon name="warning" fill className={`text-[22px] flex-shrink-0 mt-0.5 ${style.icon}`} />
      <div className="flex flex-col">
        <span className={`font-label-md text-label-md font-bold ${style.title}`}>{alert.title}</span>
        <p className="font-body-sm text-body-sm leading-snug mt-0.5">{alert.message}</p>
      </div>
    </div>
  )
}
