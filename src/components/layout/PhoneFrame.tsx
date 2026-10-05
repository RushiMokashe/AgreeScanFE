import type { ReactNode } from 'react'

/**
 * The farmer app and the partner portal are designed for phones (Stitch device type MOBILE). On wider screens
 * they render as a centred phone-width column; fixed bars use `inset-x-0 mx-auto max-w-md` to line up with it.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-surface shadow-[0_0_32px_rgba(0,0,0,0.08)]">
      {children}
    </div>
  )
}
