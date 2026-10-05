import type { ReactNode, Ref } from 'react'
import { Icon } from '../Icon'

interface SubmitButtonProps {
  /** While true the button shows a spinner and `busyLabel`, and cannot be pressed again. */
  busy: boolean
  busyLabel: string
  icon?: string
  disabled?: boolean
  ref?: Ref<HTMLButtonElement>
  children: ReactNode
}

/** A form's primary action in the design's style. */
export function SubmitButton({ busy, busyLabel, icon, disabled = false, ref, children }: SubmitButtonProps) {
  return (
    <button
      ref={ref}
      type="submit"
      disabled={busy || disabled}
      aria-busy={busy}
      className="flex min-h-[52px] w-full items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg font-label-lg text-label-lg text-on-primary shadow-md transition-transform active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100"
    >
      {busy ? (
        <Icon name="progress_activity" className="animate-spin text-[20px]" />
      ) : (
        icon && <Icon name={icon} className="text-[20px]" />
      )}
      <span>{busy ? busyLabel : children}</span>
    </button>
  )
}
