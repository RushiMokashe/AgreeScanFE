import { useI18n } from '../../i18n/i18n-context'
import { Icon } from '../Icon'

/** The router's error screen: a screen crashed, or its code could not be downloaded (after a new release). */
export function RouteError() {
  const { t } = useI18n()

  return (
    <div role="alert" className="flex min-h-dvh flex-col items-center justify-center gap-space-sm bg-surface px-margin text-center">
      <Icon name="error" className="text-[48px] text-error" />
      <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">{t.common.crash.title}</h1>
      <p className="max-w-sm font-body-sm text-body-sm text-on-surface-variant">{t.common.crash.message}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-space-sm flex min-h-[48px] items-center gap-space-xs rounded-lg bg-primary px-space-md font-label-lg text-label-lg text-on-primary active:scale-95 transition-transform"
      >
        <Icon name="refresh" className="text-[20px]" />
        {t.common.crash.reload}
      </button>
    </div>
  )
}
