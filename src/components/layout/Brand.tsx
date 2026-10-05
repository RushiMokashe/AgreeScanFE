import { APP_NAME, BRAND_MARK_URL } from './constants'

interface BrandProps {
  /** The portal's name beside "AgriScan", e.g. "Partner". */
  badge?: string
  /** The screen's name, under it. */
  subtitle?: string
}

/** Leaf mark, "AgriScan" with an optional portal badge, and the screen's name. */
export function Brand({ badge, subtitle }: BrandProps) {
  return (
    <div className="flex min-w-0 items-center gap-space-sm">
      {/* Decorative: the "AgriScan" title next to it names the app. */}
      <img alt="" className="h-8 w-8 flex-shrink-0" src={BRAND_MARK_URL} />
      <div className="flex min-w-0 flex-col">
        <span className="flex items-center gap-1.5">
          <span className="font-headline-sm text-headline-sm font-bold leading-none tracking-tight text-primary">
            {APP_NAME}
          </span>
          {badge && (
            <span className="rounded-full bg-secondary-container px-1.5 py-0.5 font-label-sm text-label-sm leading-none text-on-secondary-container">
              {badge}
            </span>
          )}
        </span>
        {subtitle && <span className="truncate font-label-sm text-label-sm text-on-surface-variant">{subtitle}</span>}
      </div>
    </div>
  )
}
