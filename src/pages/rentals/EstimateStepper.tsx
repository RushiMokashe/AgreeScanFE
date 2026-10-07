import { Field } from '../../components/form/Field'
import { INPUT_CLASSES } from '../../components/form/field-styles'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { RateUnit } from '../../lib/types'
import { MAX_UNITS, parseUnits } from './rentals-utils'

interface EstimateStepperProps {
  rateUnit: RateUnit
  /** The estimate as typed, so a half-typed number is not overwritten. */
  value: string
  onChange: (value: string) => void
}

const STEP_BUTTON =
  'w-12 h-12 min-w-[48px] rounded-xl bg-surface-container text-primary flex items-center justify-center active:bg-surface-container-high disabled:opacity-40'

/** How many hours, km or days the job will take: typed, or stepped with − and +. */
export function EstimateStepper({ rateUnit, value, onChange }: EstimateStepperProps) {
  const { t } = useI18n()
  const units = parseUnits(value)
  const step = (by: number) => onChange(String(Math.min(MAX_UNITS, Math.max(1, (units ?? 1) + by))))

  return (
    <Field
      label={t.rentals.booking.units[rateUnit]}
      hint={t.rentals.booking.unitsHint(MAX_UNITS)}
      error={units === null ? t.rentals.booking.unitsInvalid(MAX_UNITS) : undefined}
    >
      {(control) => (
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            aria-label={t.rentals.booking.decrease}
            disabled={units !== null && units <= 1}
            onClick={() => step(-1)}
            className={STEP_BUTTON}
          >
            <Icon name="remove" className="text-[22px]" />
          </button>
          <input
            {...control}
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_UNITS}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={`${INPUT_CLASSES} text-center font-title-md text-title-md`}
          />
          <button
            type="button"
            aria-label={t.rentals.booking.increase}
            disabled={units !== null && units >= MAX_UNITS}
            onClick={() => step(1)}
            className={STEP_BUTTON}
          >
            <Icon name="add" className="text-[22px]" />
          </button>
        </div>
      )}
    </Field>
  )
}
