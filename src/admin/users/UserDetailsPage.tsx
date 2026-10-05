import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the admin & assistant agent builds a user's details here (/admin/users/:id) with
 * PATCH /api/admin/users/{id} and POST /api/admin/users/{id}/reset-password.
 */
export default function UserDetailsPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="manage_accounts" title={t.nav.screens.userDetails} />
}
