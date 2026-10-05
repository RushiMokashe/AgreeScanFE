import type { Ref } from 'react'
import { COUNTRY_CODE, toNationalNumber } from '../../lib/phone'
import { Field } from './Field'
import { INPUT_CLASSES } from './field-styles'
import type { InputProps } from './TextField'

interface PhoneFieldProps extends Omit<InputProps, 'type' | 'inputMode' | 'value' | 'onChange'> {
  label: string
  hint?: string
  error?: string
  /** The national number: digits only. */
  value: string
  onValueChange: (value: string) => void
  ref?: Ref<HTMLInputElement>
}

/**
 * A mobile number input: "+91" in front, the numeric keypad, and only the national digits kept (a pasted
 * "+91 98765 43210" becomes "9876543210").
 */
export function PhoneField({ label, hint, error, value, onValueChange, ref, ...input }: PhoneFieldProps) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(control) => (
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 flex h-6 -translate-y-1/2 items-center border-r border-outline-variant pl-space-md pr-space-sm font-body-md text-body-md text-on-surface-variant"
          >
            {COUNTRY_CODE}
          </span>
          <input
            ref={ref}
            {...input}
            {...control}
            type="tel"
            inputMode="numeric"
            value={value}
            onChange={(event) => onValueChange(toNationalNumber(event.target.value))}
            className={`${INPUT_CLASSES} pl-16 tracking-wider`}
          />
        </div>
      )}
    </Field>
  )
}
