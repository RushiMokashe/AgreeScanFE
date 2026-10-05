import { ROLE_PRIORITY } from '../../auth/portals'
import { ProfileAvatar } from '../../components/layout/ProfileAvatar'
import { RoleChip } from '../../components/RoleChip'
import { useI18n } from '../../i18n/i18n-context'
import type { CurrentUser } from '../../lib/types'

/** Who is signed in: avatar, name, and the roles the account holds. */
export function ProfileSummary({ user }: { user: CurrentUser }) {
  const { t } = useI18n()
  const roles = ROLE_PRIORITY.filter((role) => user.roles.includes(role))

  return (
    <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex items-center gap-space-md">
        <ProfileAvatar size="lg" />
        <h1 className="min-w-0 truncate font-headline-sm text-headline-sm font-bold text-on-surface">{user.name}</h1>
      </div>
      <div className="flex flex-col gap-space-xs">
        <h2 className="font-label-md text-label-md text-on-surface-variant">{t.profile.access}</h2>
        <ul className="flex flex-wrap gap-space-xs">
          {roles.map((role) => (
            <li key={role}>
              <RoleChip role={role} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
