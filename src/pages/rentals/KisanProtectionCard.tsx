import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { Messages } from '../../i18n/translation'
import { GuaranteeItem } from './GuaranteeItem'

type GuaranteeId = keyof Messages['rentals']['protection']['guarantees']

/** The guarantees in the design's order, each with its icon. */
const GUARANTEES: readonly { id: GuaranteeId; icon: string }[] = [
  { id: 'backupVehicle', icon: 'autorenew' },
  { id: 'freeWaiting', icon: 'hourglass_top' },
  { id: 'payAfterSale', icon: 'price_check' },
]

/** AgriScan's guarantees to farmers renting machinery or transport (static copy from the design). */
export function KisanProtectionCard() {
  const { t } = useI18n()
  const { title, guarantees } = t.rentals.protection

  return (
    <section className="px-margin mb-space-md">
      <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm shadow-sm">
        <div className="flex items-center gap-2">
          <Icon name="verified" className="text-primary text-[22px]" />
          <h2 className="font-title-md text-title-md text-on-surface font-bold">{title}</h2>
        </div>
        <ul className="flex flex-col gap-2.5">
          {GUARANTEES.map(({ id, icon }) => (
            <GuaranteeItem key={id} icon={icon} {...guarantees[id]} />
          ))}
        </ul>
      </div>
    </section>
  )
}
