import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { Messages } from '../../i18n/translation'
import { GradingTip } from './GradingTip'
import type { GradingTipTone } from './mandi-utils'

interface GradingTipConfig {
  /** The tip's title and body in `t.mandi.grading.tips`. */
  id: keyof Messages['mandi']['grading']['tips']
  icon: string
  tone: GradingTipTone
}

const GRADING_TIPS: readonly GradingTipConfig[] = [
  { id: 'sortDamaged', icon: 'warning', tone: 'warning' },
  { id: 'packEarly', icon: 'wb_sunny', tone: 'advice' },
]

/** How to sort and pack a harvest for a better auction price, ending with the AI quality scanner. */
export function GradingGuide() {
  const { t } = useI18n()

  return (
    <section className="px-margin pt-space-xl">
      <div className="flex items-center gap-2 mb-space-sm">
        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
          <Icon name="school" className="text-[18px]" />
        </div>
        <div>
          <h2 className="font-title-md text-title-md text-on-surface font-bold">{t.mandi.grading.title}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.mandi.grading.subtitle}</p>
        </div>
      </div>
      <div className="space-y-space-sm">
        {GRADING_TIPS.map(({ id, icon, tone }) => (
          <GradingTip key={id} icon={icon} tone={tone} {...t.mandi.grading.tips[id]} />
        ))}
        <div className="p-space-md rounded-xl bg-secondary-container text-on-secondary-container shadow-sm flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <Icon name="document_scanner" className="text-[28px]" />
            <div>
              <h3 className="font-body-md text-body-md font-bold">{t.mandi.grading.scanTitle}</h3>
              <p className="font-label-sm text-label-sm opacity-90">{t.mandi.grading.scanHint}</p>
            </div>
          </div>
          <Link
            to="/scan"
            className="min-h-[44px] px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shadow whitespace-nowrap active:scale-95 flex items-center"
          >
            {t.mandi.grading.openCamera}
          </Link>
        </div>
      </div>
    </section>
  )
}
