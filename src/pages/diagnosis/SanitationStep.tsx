interface SanitationStepProps {
  number: number
  text: string
}

/** Numbered field-sanitation instruction. Rendered inside an <ol>. */
export function SanitationStep({ number, text }: SanitationStepProps) {
  return (
    <li className="flex items-start gap-2.5">
      <div
        aria-hidden="true"
        className="w-6 h-6 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-label-sm flex-shrink-0 mt-0.5"
      >
        {number}
      </div>
      <span className="font-body-sm text-body-sm text-on-surface-variant">{text}</span>
    </li>
  )
}
