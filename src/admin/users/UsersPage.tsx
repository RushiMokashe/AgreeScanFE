import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/** PLACEHOLDER (platform): the admin & assistant agent builds the user list here (/admin/users) with GET /api/admin/users. */
export default function UsersPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="group" title={t.nav.screens.users} />
}
