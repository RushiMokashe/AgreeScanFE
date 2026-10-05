import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { OrganicAlternative, Prescription } from '../../lib/types'
import { ChemicalTreatmentCard } from './ChemicalTreatmentCard'
import { OrganicAlternativeCard } from './OrganicAlternativeCard'

interface PrescriptionSectionProps {
  prescription: Prescription
  organicAlternative: OrganicAlternative | null
}

/** "Prescribed Treatment": the standard Rx card and, when there is one, the organic alternative. */
export function PrescriptionSection({ prescription, organicAlternative }: PrescriptionSectionProps) {
  const { t } = useI18n()

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="prescriptions" fill className="text-secondary text-[24px]" />
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            {t.diagnosis.prescription.title}
          </h3>
        </div>
        <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-label-sm text-label-sm font-bold">
          {t.diagnosis.prescription.standard}
        </span>
      </div>
      <ChemicalTreatmentCard prescription={prescription} />
      {organicAlternative && <OrganicAlternativeCard alternative={organicAlternative} />}
    </section>
  )
}
