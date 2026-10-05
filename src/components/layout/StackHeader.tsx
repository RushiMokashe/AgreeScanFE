import { useNavigate } from 'react-router'
import { useI18n } from '../../i18n/i18n-context'
import { Icon } from '../Icon'
import { KISAN_HELPLINE_TEL } from './constants'
import { ProfileMenu } from './ProfileMenu'

/** Top bar of full-screen flows (the crop scanner, payment): back button and title instead of the tab bar. */
export function StackHeader({ title }: { title: string }) {
  const { t } = useI18n()
  const navigate = useNavigate()

  const goBack = () => {
    // React Router keeps the history index in history.state; with no in-app history, go home.
    const index = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (index > 0) navigate(-1)
    else navigate('/')
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 mx-auto max-w-md bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs min-w-0">
          <button
            aria-label={t.nav.header.back}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors active:scale-95"
            type="button"
            onClick={goBack}
          >
            <Icon name="arrow_back" className="text-[24px]" />
          </button>
          <h1 className="font-title-md text-title-md text-on-surface truncate ml-1">{title}</h1>
        </div>
        <div className="flex items-center gap-space-xs flex-shrink-0">
          <a
            aria-label={t.nav.header.helpline}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface-container-low text-primary flex items-center justify-center transition-colors active:bg-primary-container active:text-on-primary"
            href={KISAN_HELPLINE_TEL}
          >
            <Icon name="support_agent" className="text-[22px]" />
          </a>
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
