import { Icon } from '../../components/Icon'
import { RichText } from '../../components/RichText'
import { useI18n } from '../../i18n/i18n-context'
import type { OrganicAlternative } from '../../lib/types'

interface OrganicAlternativeCardProps {
  alternative: OrganicAlternative
}

/** Residue-free bio-control option offered next to the chemical prescription. */
export function OrganicAlternativeCard({ alternative }: OrganicAlternativeCardProps) {
  const { t } = useI18n()

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon name="nest_eco_leaf" className="text-secondary text-[20px]" />
          <h4 className="font-title-md text-title-md font-bold text-on-surface">{t.diagnosis.prescription.organic}</h4>
        </div>
        <span className="flex-shrink-0 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
          {alternative.badge}
        </span>
      </div>
      <p className="font-body-md text-body-md text-on-surface">
        <RichText text={alternative.summary} strongClassName="font-semibold text-primary" />
      </p>
      <span className="font-label-sm text-label-sm text-on-surface-variant">{alternative.note}</span>
    </div>
  )
}
