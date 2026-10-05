import type { ReactNode } from 'react'
import { LanguagePicker } from '../LanguagePicker'
import { Brand } from './Brand'
import { ProfileMenu } from './ProfileMenu'

interface AppHeaderProps {
  /** The screen's name, under the brand. */
  subtitle?: string
  /** The portal's name beside the brand, e.g. "Partner". */
  badge?: string
  /** Buttons between the language switch and the account menu (the farmer app's voice assistant). */
  children?: ReactNode
}

/** Top bar of the phone-framed tab screens: brand and screen name, language switch, actions, account menu. */
export function AppHeader({ subtitle, badge, children }: AppHeaderProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 mx-auto max-w-md bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
        <Brand badge={badge} subtitle={subtitle} />
        <div className="flex items-center gap-space-xs flex-shrink-0">
          <LanguagePicker />
          {children}
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
