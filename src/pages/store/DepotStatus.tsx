import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'

interface DepotStatusProps {
  depotName: string
  open: boolean
  deliveryLabel: string
}

/** The depot orders ship from, whether it is open now, and its delivery promise. */
export function DepotStatus({ depotName, open, deliveryLabel }: DepotStatusProps) {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-between gap-space-sm mb-3">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${open ? 'bg-secondary animate-pulse' : 'bg-outline'}`}
        />
        <span
          className={`font-label-sm text-label-sm uppercase tracking-wider font-bold truncate ${
            open ? 'text-secondary' : 'text-on-surface-variant'
          }`}
        >
          {depotName} • {open ? t.store.depot.open : t.store.depot.closed}
        </span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant flex-shrink-0">
        <Icon name="local_shipping" className="text-[16px] text-primary" />
        <span className="font-label-sm text-label-sm font-semibold">{deliveryLabel}</span>
      </div>
    </div>
  )
}
