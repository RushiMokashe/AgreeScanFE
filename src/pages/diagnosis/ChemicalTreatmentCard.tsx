import { Icon } from '../../components/Icon'
import { RichText } from '../../components/RichText'
import { useI18n } from '../../i18n/i18n-context'
import type { Prescription } from '../../lib/types'
import { DoseFact } from './DoseFact'
import { GuidanceRow } from './GuidanceRow'

interface ChemicalTreatmentCardProps {
  prescription: Prescription
}

/** The standard prescription: active ingredient, dosage per litre and per tank, timing and withholding period. */
export function ChemicalTreatmentCard({ prescription }: ChemicalTreatmentCardProps) {
  const { t } = useI18n()

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
      <div className="bg-primary px-4 py-3 text-on-primary flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon name="sanitizer" className="text-[20px]" />
          <span className="font-label-lg text-label-lg font-bold">{prescription.category}</span>
        </div>
        {prescription.recommended && (
          <span className="bg-primary-container px-2 py-0.5 rounded text-[11px] font-bold text-on-primary-container uppercase">
            {t.diagnosis.prescription.recommended}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3.5">
        <div>
          <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider font-semibold">
            {t.diagnosis.prescription.activeComposition}
          </span>
          <h4 className="font-title-md text-title-md text-primary font-bold">{prescription.activeIngredient}</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {t.diagnosis.prescription.marketBrands(prescription.marketBrands)}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-lg">
          <DoseFact
            label={t.diagnosis.prescription.dilution}
            value={prescription.dilution}
            note={prescription.dilutionNote}
            highlightNote
          />
          <DoseFact label={prescription.tankSize} value={prescription.tankDose} note={prescription.tankNote} />
        </dl>
        <div className="flex flex-col gap-2">
          <GuidanceRow icon="schedule" title={t.diagnosis.prescription.applicationWindow}>
            {prescription.applicationWindow}
          </GuidanceRow>
          <GuidanceRow icon="hourglass_bottom" title={t.diagnosis.prescription.preHarvestInterval} critical>
            <RichText text={prescription.preHarvestNote} />
          </GuidanceRow>
        </div>
      </div>
    </div>
  )
}
