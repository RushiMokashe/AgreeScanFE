import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { KISAN_HELPLINE_TEL } from '../../components/layout/constants'
import { useI18n } from '../../i18n/i18n-context'
import type { Prescription } from '../../lib/types'
import { productName, treatmentPath } from './diagnosis-utils'

const PRIMARY_ACTION_CLASS =
  'w-full min-h-[52px] bg-primary text-on-primary rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:bg-primary-container transition-transform active:scale-[0.99]'

interface DiagnosisActionsProps {
  prescription: Prescription | null
  treatmentPlanId: number | null
}

/**
 * Next steps after a diagnosis: find or order the prescribed product, call an agronomist and set spray alerts.
 * Without a prescription (healthy crop) the farmer is offered another scan instead.
 */
export function DiagnosisActions({ prescription, treatmentPlanId }: DiagnosisActionsProps) {
  const { t } = useI18n()
  const callAgronomist = (
    <a
      className="min-h-[48px] bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:bg-surface-container active:scale-95 transition-transform"
      href={KISAN_HELPLINE_TEL}
    >
      <Icon name="support_agent" className="text-[20px] text-secondary" />
      <span>{t.diagnosis.actions.callAgronomist}</span>
    </a>
  )

  if (!prescription) {
    return (
      <section className="flex flex-col gap-2.5 pt-2">
        <Link className={PRIMARY_ACTION_CLASS} to="/scan">
          <Icon name="photo_camera" className="text-[22px]" />
          <span>{t.diagnosis.actions.scanAnother}</span>
        </Link>
        {callAgronomist}
      </section>
    )
  }

  const product = productName(prescription.activeIngredient)
  const planPath = treatmentPath(treatmentPlanId)

  return (
    <section className="flex flex-col gap-2.5 pt-2">
      <div className="flex flex-col gap-2">
        <Link className={PRIMARY_ACTION_CLASS} to={planPath}>
          <Icon name="near_me" className="text-[22px]" />
          <span>{t.diagnosis.actions.findStores(product)}</span>
        </Link>
        <Link
          className="w-full min-h-[48px] bg-secondary-container text-on-secondary-container rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
          to="/store"
        >
          <Icon name="shopping_bag" className="text-[20px]" />
          <span>{t.diagnosis.actions.order(product)}</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {callAgronomist}
        <Link
          className="min-h-[48px] bg-surface-container-lowest text-on-surface rounded-xl font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-sm active:bg-surface-container active:scale-95 transition-transform"
          to={planPath}
        >
          <Icon name="alarm_on" className="text-[20px] text-secondary" />
          <span>{t.diagnosis.actions.sprayAlert}</span>
        </Link>
      </div>
    </section>
  )
}
