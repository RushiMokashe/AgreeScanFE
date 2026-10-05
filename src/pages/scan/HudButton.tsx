import type { ReactNode } from 'react'

interface HudButtonProps {
  label: string
  pressed: boolean
  /** Colours while pressed; the design highlights each control differently. */
  activeClassName: string
  onClick: () => void
  children: ReactNode
}

/** Round camera control floating over the viewfinder (torch, zoom, grid). */
export function HudButton({ label, pressed, activeClassName, onClick, children }: HudButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={pressed}
      className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 transition-transform ${
        pressed ? activeClassName : 'bg-inverse-surface/80 text-inverse-on-surface'
      }`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
