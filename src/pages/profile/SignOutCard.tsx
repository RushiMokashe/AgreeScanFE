import { useSignOut } from '../../auth/useSignOut'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'

/** Signing out of this device, at the end of the profile page. */
export function SignOutCard() {
  const { t } = useI18n()
  const { signOut, signingOut } = useSignOut()

  return (
    <section className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
      <p className="font-body-sm text-body-sm text-on-surface-variant">{t.profile.signOutHint}</p>
      <button
        type="button"
        onClick={signOut}
        disabled={signingOut}
        aria-busy={signingOut}
        className="flex min-h-[48px] w-full items-center justify-center gap-space-sm rounded-xl border border-error/40 bg-error-container/40 font-label-lg text-label-lg text-error transition-transform active:scale-[0.99] disabled:opacity-60"
      >
        <Icon name={signingOut ? 'progress_activity' : 'logout'} className={`text-[20px] ${signingOut ? 'animate-spin' : ''}`} />
        {t.nav.account.signOut}
      </button>
    </section>
  )
}
