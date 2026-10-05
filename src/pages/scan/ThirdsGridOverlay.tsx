/** Positions of the two vertical and two horizontal rule-of-thirds lines. */
const GRID_LINES = [
  'inset-y-0 left-1/3 w-px',
  'inset-y-0 left-2/3 w-px',
  'inset-x-0 top-1/3 h-px',
  'inset-x-0 top-2/3 h-px',
] as const

/** 3×3 composition guide drawn over the viewfinder when the grid toggle is on. */
export function ThirdsGridOverlay() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {GRID_LINES.map((position) => (
        <div key={position} className={`absolute bg-inverse-on-surface/40 ${position}`} />
      ))}
    </div>
  )
}
