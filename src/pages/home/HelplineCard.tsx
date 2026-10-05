import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { Helpline } from '../../lib/types'

interface HelplineCardProps {
  helpline: Helpline
}

/** Emergency strip with the government farmer helpline and a one-tap dial button. */
export function HelplineCard({ helpline }: HelplineCardProps) {
  const { t } = useI18n()

  return (
    <section className="rounded-xl bg-surface-container p-space-md flex flex-col gap-space-sm shadow-sm">
      <div className="flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-md">
            <Icon name="support_agent" className="text-[24px]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm uppercase font-bold text-primary tracking-wider">
              {t.home.helpline.title}
            </span>
            <span className="font-title-md text-title-md font-bold text-on-surface">{helpline.name}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {helpline.displayNumber} ({helpline.hours})
            </span>
          </div>
        </div>
      </div>
      <a
        aria-label={t.home.helpline.dialLabel(helpline.name)}
        className="w-full min-h-[48px] py-2.5 px-space-md rounded-lg bg-surface-container-lowest text-primary font-title-md text-title-md font-bold flex items-center justify-center gap-2 shadow-sm active:bg-secondary-container transition-colors"
        href={`tel:${helpline.phone}`}
      >
        <Icon name="call" className="text-[20px]" />
        <span>{t.home.helpline.dial}</span>
      </a>
    </section>
  )
}
