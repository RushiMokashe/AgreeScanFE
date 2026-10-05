import type { ReactNode } from 'react'

interface DeckButtonProps {
  /** Visible caption under the preview tile. */
  caption: string
  label: string
  disabled: boolean
  onClick: () => void
  /** Toggle state for switch-like buttons (Bug Mode); leave out for plain actions. */
  pressed?: boolean
  /** The 36px preview tile. */
  children: ReactNode
}

/** Square side button of the shutter deck (Gallery, Bug Mode). */
export function DeckButton({ caption, label, disabled, onClick, pressed, children }: DeckButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={pressed}
      className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl text-on-surface transition-all active:scale-95 flex-shrink-0 disabled:opacity-60 ${
        pressed ? 'bg-secondary-container' : 'bg-surface-container-high active:bg-surface-container-highest'
      }`}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
      <span
        className={`font-label-sm text-label-sm font-medium ${pressed ? 'text-on-secondary-container' : 'text-on-surface-variant'}`}
      >
        {caption}
      </span>
    </button>
  )
}
