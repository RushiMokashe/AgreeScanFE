import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { Messages } from '../../i18n/translation'
import { TrustPillar } from './TrustPillar'

type PillarId = keyof Messages['store']['promise']['pillars']

/** The pillars in the design's order, each with its icon and tile colours. */
const PILLARS: readonly { id: PillarId; icon: string; tone: string }[] = [
  { id: 'genuine', icon: 'verified', tone: 'bg-secondary-container text-on-secondary-container' },
  { id: 'payOnDelivery', icon: 'credit_card', tone: 'bg-primary-fixed text-on-primary-fixed' },
  { id: 'dosageCall', icon: 'support_agent', tone: 'bg-tertiary-fixed text-on-tertiary-fixed' },
]

/** "AgriScan Kisan Suraksha Promise": the store's guarantees (static copy from the design). */
export function KisanPromise() {
  const { t } = useI18n()
  const { title, pillars } = t.store.promise

  return (
    <section className="px-margin mt-6">
      <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-3.5">
        <div className="flex items-center gap-2">
          <Icon name="verified_user" className="text-primary text-[22px]" />
          <h2 className="font-title-md text-title-md font-bold text-on-surface">{title}</h2>
        </div>
        <ul className="grid grid-cols-1 gap-2.5">
          {PILLARS.map(({ id, icon, tone }) => (
            <TrustPillar key={id} icon={icon} tone={tone} {...pillars[id]} />
          ))}
        </ul>
      </div>
    </section>
  )
}
