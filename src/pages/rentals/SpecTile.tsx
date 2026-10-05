import type { RentalSpec } from '../../lib/types'

interface SpecTileProps {
  spec: RentalSpec
}

/** One cell of a machine's spec grid, e.g. "6 Feet / Rotavator Width". */
export function SpecTile({ spec }: SpecTileProps) {
  return (
    <div className="bg-surface-container p-1.5 rounded">
      <span className="block text-on-surface font-bold text-label-md">{spec.value}</span>
      <span>{spec.label}</span>
    </div>
  )
}
