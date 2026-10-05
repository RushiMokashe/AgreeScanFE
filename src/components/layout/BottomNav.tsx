import { NavLink } from 'react-router'
import { useI18n } from '../../i18n/i18n-context'
import type { MessageSelector } from '../../i18n/translation'
import { Icon } from '../Icon'

export interface NavTab {
  to: string
  icon: string
  label: MessageSelector
  /** Active only on exactly this path (a portal's first tab, whose path starts every other one). */
  end?: boolean
  /** Drawn as the raised round button in the middle of the bar (the farmer's "Scan Crop"). */
  raised?: boolean
}

/** The phone portals' tab bar, from the Stitch design. */
export function BottomNav({ tabs }: { tabs: readonly NavTab[] }) {
  const { t } = useI18n()

  return (
    <nav
      aria-label={t.nav.mainNavigation}
      className="fixed bottom-0 inset-x-0 z-50 mx-auto max-w-md pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) =>
          tab.raised ? (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="relative -top-2.5 min-h-[48px] flex flex-col items-center justify-center px-1 flex-shrink-0 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary shadow-[0_6px_14px_rgba(0,69,13,0.35)] flex items-center justify-center transition-transform active:scale-95">
                <Icon name={tab.icon} className="text-[26px]" />
              </div>
              <span className="font-label-sm text-[10px] tracking-tight text-primary font-bold text-center mt-0.5 leading-tight">
                {tab.label(t)}
              </span>
            </NavLink>
          ) : (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center justify-center w-6 h-6">
                    <Icon name={tab.icon} fill={isActive} className="text-[22px]" />
                  </div>
                  <span className="font-label-sm text-[10px] tracking-tight text-center leading-tight">{tab.label(t)}</span>
                </>
              )}
            </NavLink>
          ),
        )}
      </div>
    </nav>
  )
}
