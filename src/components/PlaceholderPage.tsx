import { useI18n } from '../i18n/i18n-context'
import { Icon } from './Icon'

interface PlaceholderPageProps {
  /** Material Symbols name of the screen's subject. */
  icon: string
  title: string
}

/** Stand-in for a screen its feature agent has not built yet; each placeholder page renders only this. */
export function PlaceholderPage({ icon, title }: PlaceholderPageProps) {
  const { t } = useI18n()
  return (
    <section className="mx-margin my-space-lg flex flex-col items-center gap-space-sm rounded-2xl bg-surface-container-lowest px-space-md py-space-xl text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
        <Icon name={icon} className="text-[32px]" />
      </div>
      <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">{title}</h1>
      <p className="max-w-sm font-body-sm text-body-sm text-on-surface-variant">{t.common.placeholder}</p>
    </section>
  )
}
