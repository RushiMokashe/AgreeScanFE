import { BottomSheet } from './BottomSheet'
import { Icon } from './Icon'

interface ConfirmSheetProps {
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  /** While true the confirm button spins and neither button can be pressed again. */
  busy?: boolean
  onConfirm: () => void
  onClose: () => void
}

/** Asks before something the user may not expect, e.g. emptying the cart; Escape or the backdrop cancels. */
export function ConfirmSheet({ title, message, confirmLabel, cancelLabel, busy = false, onConfirm, onClose }: ConfirmSheetProps) {
  return (
    <BottomSheet title={title} onClose={onClose}>
      <div className="flex flex-col gap-space-md pt-space-xs">
        <p className="font-body-md text-body-md text-on-surface">{message}</p>
        <button
          type="button"
          disabled={busy}
          aria-busy={busy}
          onClick={onConfirm}
          className="flex min-h-[52px] w-full items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg font-label-lg text-label-lg text-on-primary shadow-md active:scale-[0.99] disabled:opacity-60"
        >
          {busy && <Icon name="progress_activity" className="animate-spin text-[20px]" />}
          {confirmLabel}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onClose}
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-outline-variant font-label-lg text-label-lg text-primary active:bg-surface-container disabled:opacity-60"
        >
          {cancelLabel}
        </button>
      </div>
    </BottomSheet>
  )
}
