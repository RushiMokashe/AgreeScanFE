interface IconProps {
  /** Material Symbols name, e.g. "photo_camera". */
  name: string
  /** Size and colour classes, e.g. "text-[20px] text-primary". */
  className?: string
  /** Use the filled variant (the design's `font-variation-settings: 'FILL' 1`). */
  fill?: boolean
}

export function Icon({ name, className = '', fill = false }: IconProps) {
  return (
    <span aria-hidden="true" className={`material-symbol ${fill ? 'icon-fill' : ''} ${className}`}>
      {name}
    </span>
  )
}
