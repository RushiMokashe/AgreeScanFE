import { Icon } from '../Icon'

/** Why a form could not be submitted (usually the server's explanation), announced when it appears. */
export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-space-xs rounded-xl bg-error-container px-space-md py-space-sm font-body-sm text-body-sm text-on-error-container"
    >
      <Icon name="error" className="mt-0.5 text-[18px] text-error" />
      <span>{message}</span>
    </p>
  )
}
