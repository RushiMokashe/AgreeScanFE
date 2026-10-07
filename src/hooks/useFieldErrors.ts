import { useState } from 'react'

/**
 * Inline errors that appear at the right moment: a field shows its problem once the user has left it (blur), and
 * every field shows its problem after a submit attempt. `problems` holds each field's current problem, already
 * worded for the user, or undefined when the field is fine; recompute it on every render.
 *
 * ```tsx
 * const fields = useFieldErrors({ upiId: problemOf(upiId) })
 * <TextField error={fields.errorOf('upiId')} onBlur={() => fields.touch('upiId')} ... />
 * const submit = () => { if (fields.submit()) send() else focus(fields.firstInvalid) }
 * ```
 */
export function useFieldErrors<Field extends string>(problems: Record<Field, string | undefined>) {
  const [touched, setTouched] = useState<ReadonlySet<Field>>(() => new Set())
  const [submitted, setSubmitted] = useState(false)
  const fields = Object.keys(problems) as Field[]

  /** The field's problem when it should be shown, else undefined. */
  const errorOf = (field: Field): string | undefined =>
    submitted || touched.has(field) ? problems[field] : undefined

  /** The user left the field: its problem shows from now on. */
  const touch = (field: Field) => {
    if (!touched.has(field)) setTouched((previous) => new Set(previous).add(field))
  }

  /** Shows every problem; resolves whether the form may be sent. */
  const submit = (): boolean => {
    setSubmitted(true)
    return fields.every((field) => problems[field] === undefined)
  }

  /** Starts over, e.g. after switching to another payment method. */
  const reset = () => {
    setTouched(new Set())
    setSubmitted(false)
  }

  return { errorOf, touch, submit, reset, firstInvalid: fields.find((field) => problems[field] !== undefined) }
}
