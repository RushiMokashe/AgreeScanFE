import type { ReactNode } from 'react'

interface CropPillProps {
  active: boolean
  disabled: boolean
  onClick: () => void
  children: ReactNode
}

/** One option of the crop selector; the active pill takes the dark primary style. */
export function CropPill({ active, disabled, onClick, children }: CropPillProps) {
  return (
    <button
      aria-pressed={active}
      className={`flex-shrink-0 min-h-[44px] px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all disabled:opacity-60 ${
        active ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
      }`}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
