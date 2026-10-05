import { Link } from 'react-router'
import { useAuth } from '../auth/auth-context'
import { PORTALS } from '../auth/portals'
import { Icon } from '../components/Icon'
import { useI18n } from '../i18n/i18n-context'

/** Unknown paths in any portal, with a way back to that portal's home. */
export default function NotFoundPage() {
  const { t } = useI18n()
  const { activeRole } = useAuth()

  return (
    <div className="flex flex-col items-center gap-space-sm px-margin py-space-xl text-center">
      <Icon name="grass" className="text-[48px] text-primary" />
      <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">{t.common.notFound.title}</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{t.common.notFound.message}</p>
      <Link
        to={PORTALS[activeRole ?? 'FARMER'].home}
        className="mt-space-sm min-h-[48px] px-space-md rounded-lg bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-space-xs"
      >
        <Icon name="home" className="text-[20px]" />
        {t.common.notFound.home}
      </Link>
    </div>
  )
}
