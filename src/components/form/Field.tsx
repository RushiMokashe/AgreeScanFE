import { useId, type ReactNode } from 'react'
import { Icon } from '../Icon'

/** What a field's control needs to be labelled and described. */
export interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}

interface FieldProps {
  label: string
  /** Guidance under the control; an error replaces it while there is one. */
  hint?: string
  error?: string
  /** Id of more text describing the control, e.g. a checklist of rules. */
  describedBy?: string
  children: (control: FieldControlProps) => ReactNode
}

/** A labelled form control with its hint or error, wired together for screen readers. */
export function Field({ label, hint, error, describedBy, children }: FieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint
  const descriptions = [message && messageId, describedBy].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-label-md text-label-md text-on-surface">
        {label}
      </label>
      {children({ id, 'aria-describedby': descriptions || undefined, 'aria-invalid': error ? true : undefined })}
      {message && (
        <p
          id={messageId}
          className={`flex items-start gap-1 font-body-sm text-body-sm ${error ? 'text-error' : 'text-on-surface-variant'}`}
        >
          {error && <Icon name="error" className="mt-0.5 text-[16px]" />}
          <span>{message}</span>
        </p>
      )}
    </div>
  )
}
