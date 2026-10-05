import { useAuth } from '../auth/auth-context'
import { AccountDetailsForm } from './profile/AccountDetailsForm'
import { ChangePasswordForm } from './profile/ChangePasswordForm'
import { LanguageSection } from './profile/LanguageSection'
import { ProfileSummary } from './profile/ProfileSummary'
import { SignOutCard } from './profile/SignOutCard'

/**
 * "My profile" in every portal (/profile, /owner/profile, /admin/profile): who is signed in, account details,
 * app language, password and sign-out.
 */
export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null // the route guard renders this page for signed-in users only

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-space-lg px-margin py-space-md">
      <ProfileSummary user={user} />
      <AccountDetailsForm user={user} />
      <LanguageSection />
      <ChangePasswordForm />
      <SignOutCard />
    </div>
  )
}
