import { PORTALS } from '../auth/portals'
import { useI18n } from '../i18n/i18n-context'
import type { Role } from '../lib/types'
import { Icon } from './Icon'

/** A role as a small chip: its portal's icon and its name, e.g. a tractor and "Farmer". */
export function RoleChip({ role }: { role: Role }) {
  const { t } = useI18n()

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-space-sm py-0.5 font-label-md text-label-md text-on-secondary-container">
      <Icon name={PORTALS[role].icon} className="text-[16px]" />
      {t.common.roles[role]}
    </span>
  )
}
