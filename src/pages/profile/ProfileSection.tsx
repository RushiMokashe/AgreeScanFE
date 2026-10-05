import { useId, type ReactNode } from 'react'

interface ProfileSectionProps {
  title: string
  /** A sentence under the title. */
  hint?: string
  children: ReactNode
}

/** A card of the profile page, named by its heading. */
export function ProfileSection({ title, hint, children }: ProfileSectionProps) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <h2 id={titleId} className="font-title-md text-title-md font-bold text-on-surface">
          {title}
        </h2>
        {hint && <p className="font-body-sm text-body-sm text-on-surface-variant">{hint}</p>}
      </div>
      {children}
    </section>
  )
}
