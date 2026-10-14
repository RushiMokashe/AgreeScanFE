import { useId } from 'react'
import { Icon } from '../components/Icon'
import { useI18n } from '../i18n/i18n-context'
import type { LoginRequest, Role } from '../lib/types'
import { PORTALS, ROLE_PRIORITY } from './portals'

interface DemoAccount extends LoginRequest {
  role: Role
  name: string
}

/** The seeded demo accounts (docs/architecture/phase-2.md §3). LoginPage loads this module in development only. */
const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  { role: 'ADMIN', name: 'AgriScan Admin', phone: '9000000001', password: 'Admin@123' },
  { role: 'FARMER', name: 'Rishikesh', phone: '9876543210', password: 'Farmer@123' },
  { role: 'FARMER', name: 'Sunita Pawar', phone: '9876543211', password: 'Farmer@123' },
  { role: 'VEHICLE_OWNER', name: 'Rameshwar Patil', phone: '9800012345', password: 'Owner@123' },
  { role: 'VEHICLE_OWNER', name: 'Shivraj Agro Service', phone: '9800098765', password: 'Owner@123' },
  { role: 'VEHICLE_OWNER', name: 'Vinod Shinde', phone: '9822233445', password: 'Owner@123' },
  { role: 'VEHICLE_OWNER', name: 'Balwant Transport Fleet', phone: '9877766554', password: 'Owner@123' },
  { role: 'VEHICLE_OWNER', name: 'AgriScan Logistics', phone: '9000000009', password: 'Owner@123' },
  { role: 'SHOPKEEPER', name: 'Sanjay Kulkarni', phone: '9800054321', password: 'Shop@123' },
  { role: 'SHOPKEEPER', name: 'Mahesh Jadhav', phone: '9800054322', password: 'Shop@123' },
]

/** One-tap chips that fill the sign-in form with a demo account, grouped by role. */
export function DemoAccounts({ onPick }: { onPick: (credentials: LoginRequest) => void }) {
  const { t } = useI18n()
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-space-sm rounded-2xl border border-dashed border-outline-variant p-space-md"
    >
      <div>
        <h2 id={titleId} className="font-title-md text-title-md text-on-surface">
          {t.auth.demo.title}
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{t.auth.demo.hint}</p>
      </div>
      {ROLE_PRIORITY.map((role) => (
        <div key={role} className="flex flex-col gap-space-xs">
          <h3 className="flex items-center gap-1 font-label-sm text-label-sm uppercase text-on-surface-variant">
            <Icon name={PORTALS[role].icon} className="text-[16px]" />
            {t.common.roles[role]}
          </h3>
          <ul className="flex flex-wrap gap-space-xs">
            {DEMO_ACCOUNTS.filter((account) => account.role === role).map(({ name, phone, password }) => (
              <li key={phone}>
                <button
                  type="button"
                  onClick={() => onPick({ phone, password })}
                  className="min-h-[44px] rounded-full bg-surface-container-lowest px-space-md font-label-md text-label-md text-on-surface shadow-sm ring-1 ring-outline-variant/50 transition-transform active:scale-95"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
