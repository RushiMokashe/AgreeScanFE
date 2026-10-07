import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { Agronomist } from '../../lib/types'
import { apiUrl } from '../../platform/api-base'

interface AgronomistCardProps {
  agronomist: Agronomist
}

/** Direct line to the plant pathologist for help beyond the written protocol. */
export function AgronomistCard({ agronomist }: AgronomistCardProps) {
  const { t } = useI18n()
  const { name, title, photoUrl, phone, onDuty, pitch } = agronomist

  return (
    <section className="bg-primary text-on-primary rounded-xl p-space-md shadow-md flex flex-col gap-space-sm relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
      <div className="flex items-center gap-space-sm">
        <div className="relative flex-shrink-0">
          <img
            className="w-14 h-14 rounded-full object-cover shadow-sm bg-surface-container"
            alt={t.treatment.agronomist.photoAlt(name)}
            src={apiUrl(photoUrl)}
          />
          {onDuty && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-tertiary-fixed rounded-full ring-2 ring-primary" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <Icon name="verified_user" className="text-tertiary-fixed text-[16px]" />
            <span className="font-label-sm text-label-sm text-on-primary-container font-bold uppercase">
              {onDuty ? t.treatment.agronomist.onDuty : t.treatment.agronomist.offDuty}
            </span>
          </div>
          <h2 className="font-title-md text-title-md font-bold truncate">{name}</h2>
          <p className="font-body-sm text-body-sm text-on-primary-container truncate">{title}</p>
        </div>
      </div>
      <div className="bg-primary-container rounded-lg p-space-sm flex items-start gap-space-xs">
        <Icon name="calculate" className="text-tertiary-fixed text-[20px] flex-shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-primary">{pitch}</p>
      </div>
      <a
        href={`tel:${phone}`}
        className="min-h-[52px] w-full rounded-lg bg-tertiary-fixed text-on-tertiary-fixed active:bg-secondary-fixed font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm transition-transform active:scale-[0.98]"
      >
        <Icon name="phone_in_talk" className="text-[22px]" />
        <span>{t.treatment.agronomist.call}</span>
      </a>
    </section>
  )
}
