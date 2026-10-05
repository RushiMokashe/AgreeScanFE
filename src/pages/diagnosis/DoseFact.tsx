interface DoseFactProps {
  label: string
  value: string
  note: string
  /** Shows the note in the accent colour (the design does this for the dilution). */
  highlightNote?: boolean
}

/** One cell of the dosage grid, e.g. "Standard Dilution" / "2.5g / Liter" / "Water mix". Rendered inside a <dl>. */
export function DoseFact({ label, value, note, highlightNote = false }: DoseFactProps) {
  return (
    <div className="flex flex-col">
      <dt className="font-label-sm text-label-sm text-on-surface-variant font-medium">{label}</dt>
      <dd className="font-label-lg text-label-lg font-bold text-on-surface mt-0.5">{value}</dd>
      <dd
        className={`font-label-sm text-label-sm ${highlightNote ? 'text-secondary font-semibold' : 'text-on-surface-variant'}`}
      >
        {note}
      </dd>
    </div>
  )
}
