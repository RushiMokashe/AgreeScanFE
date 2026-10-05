import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { MandiMarket } from '../../lib/types'

interface TransportCardProps {
  market: MandiMarket
}

/** Call to action for booking a pickup to the mandi, or calling its dispatcher. */
export function TransportCard({ market }: TransportCardProps) {
  const { t } = useI18n()

  return (
    <section className="px-margin pt-space-xl pb-space-lg">
      <div className="p-space-md rounded-2xl bg-primary text-on-primary shadow-lg relative overflow-hidden">
        <Icon
          name="local_shipping"
          className="text-primary-fixed-dim/10 text-[140px] absolute -right-6 -bottom-8 pointer-events-none select-none"
        />
        <div className="relative z-10 flex flex-col gap-space-sm">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm self-start">
            <Icon name="verified" className="text-[16px]" />
            <span>{t.mandi.transport.badge}</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-primary leading-tight">
            {t.mandi.transport.title(market.name)}
          </h2>
          <p className="font-body-sm text-body-sm text-on-primary/80 leading-snug">{t.mandi.transport.body}</p>
          <div className="pt-space-xs flex items-center gap-space-sm">
            <Link
              to="/rentals?tab=transport"
              className="flex-1 min-h-[50px] px-space-md rounded-xl bg-secondary-container text-on-secondary-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow active:scale-98 transition-transform"
            >
              <Icon name="local_shipping" className="text-[20px]" />
              <span>{t.mandi.transport.book}</span>
            </Link>
            <a
              href={`tel:${market.helplinePhone}`}
              aria-label={t.mandi.transport.callDispatcher}
              className="w-[50px] h-[50px] rounded-xl bg-primary-container text-on-primary flex items-center justify-center active:bg-secondary"
            >
              <Icon name="call" className="text-[22px]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
