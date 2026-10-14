/** The design's text input: 48px tall, outlined, a green focus ring, and a red outline while invalid. */
export const INPUT_CLASSES =
  'min-h-[48px] w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-space-md font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 aria-[invalid=true]:border-error aria-[invalid=true]:focus:ring-error/25'

/**
 * The design's checkbox: green once ticked, with the inputs' focus ring. @tailwindcss/forms draws it and fills it with
 * the text colour, so accent-color has no effect on it. Size it with h-* and w-*.
 */
export const CHECKBOX_CLASSES =
  'flex-shrink-0 cursor-pointer rounded border-outline text-primary focus:ring-2 focus:ring-primary/25 focus:ring-offset-0 disabled:cursor-default disabled:opacity-60'
