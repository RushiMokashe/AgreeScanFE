import { Icon } from '../../components/Icon'
import { RichText } from '../../components/RichText'
import { GRADING_TIP_TONES, type GradingTipTone } from './mandi-utils'

interface GradingTipProps {
  icon: string
  tone: GradingTipTone
  title: string
  /** **Bold** segments are emphasised in the tone's colour. */
  body: string
}

/** One grading or packing practice that raises the auction price. */
export function GradingTip({ icon, tone, title, body }: GradingTipProps) {
  const toneStyle = GRADING_TIP_TONES[tone]

  return (
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-start gap-space-sm">
      <div className={`w-10 h-10 rounded-full ${toneStyle.icon} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon name={icon} className="text-[22px]" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-body-md text-body-md font-bold text-on-surface">{title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">
          <RichText text={body} strongClassName={toneStyle.emphasis} />
        </p>
      </div>
    </div>
  )
}
