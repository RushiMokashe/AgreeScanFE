import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { MandiMarket } from '../../lib/types'

interface MandiHelplineProps {
  market: MandiMarket
}

/** Closing note with the market's helpline number and hours. */
export function MandiHelpline({ market }: MandiHelplineProps) {
  const { t } = useI18n()

  return (
    <footer className="px-margin pb-space-lg text-center">
      <div className="inline-flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
        <Icon name="support_agent" className="text-[16px] text-primary" />
        <span>
          {t.mandi.helpline(market.name)}{' '}
          <strong className="text-primary font-bold">{market.helplineDisplay}</strong> ({market.helplineHours})
        </span>
      </div>
    </footer>
  )
}
