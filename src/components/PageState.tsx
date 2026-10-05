import { useI18n } from '../i18n/i18n-context'
import { Icon } from './Icon'

/** A spinner while a screen or section loads; `label` defaults to "Loading…" in the active language. */
export function LoadingState({ label }: { label?: string }) {
  const { t } = useI18n()
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-space-sm py-space-xl text-on-surface-variant">
      <Icon name="progress_activity" className="text-[32px] text-primary animate-spin" />
      <span className="font-label-md text-label-md">{label ?? t.common.loading}</span>
    </div>
  )
}

interface ErrorStateProps {
  error: Error
  onRetry?: () => void
  /** Defaults to a whole-screen message; sections pass their own, e.g. "Could not load nearby stores". */
  title?: string
}

export function ErrorState({ error, onRetry, title }: ErrorStateProps) {
  const { t } = useI18n()
  return (
    <div
      role="alert"
      className="mx-margin my-space-lg flex flex-col items-center gap-space-sm rounded-xl bg-error-container p-space-md text-center text-on-error-container"
    >
      <Icon name="cloud_off" className="text-[32px] text-error" />
      <p className="font-title-md text-title-md font-bold">{title ?? t.common.loadFailed}</p>
      <p className="font-body-sm text-body-sm">{error.message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-space-xs min-h-[44px] rounded-lg bg-primary px-space-md font-label-md text-label-md font-bold text-on-primary active:scale-95 transition-transform"
        >
          {t.common.retry}
        </button>
      )}
    </div>
  )
}
