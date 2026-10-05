import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/** PLACEHOLDER (platform): the admin & assistant agent builds user creation here (/admin/users/new) with POST /api/admin/users. */
export default function UserCreatePage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="person_add" title={t.nav.screens.newUser} />
}
