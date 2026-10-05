import type { InputHTMLAttributes, Ref } from 'react'
import { Field } from './Field'
import { INPUT_CLASSES } from './field-styles'

/** Input attributes a field component passes through (the field supplies id, styling and ARIA wiring). */
export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'className' | 'aria-describedby' | 'aria-invalid'
>

interface TextFieldProps extends InputProps {
  label: string
  hint?: string
  error?: string
  ref?: Ref<HTMLInputElement>
}

/** A labelled text input (text, email, number, …) in the design's style. */
export function TextField({ label, hint, error, ref, ...input }: TextFieldProps) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(control) => <input ref={ref} {...input} {...control} className={INPUT_CLASSES} />}
    </Field>
  )
}
