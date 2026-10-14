import { useId } from 'react'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { PaymentMethod } from '../../lib/types'
import { PAYMENT_METHODS } from './store-utils'

const METHOD_ICONS: Record<PaymentMethod, string> = {
  ONLINE: 'qr_code_scanner',
  CASH_ON_DELIVERY: 'payments',
}

interface PaymentMethodPickerProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
  disabled?: boolean
}

/** How the farmer pays for an order, as two radio cards. */
export function PaymentMethodPicker({ value, onChange, disabled = false }: PaymentMethodPickerProps) {
  const { t } = useI18n()
  const name = useId()
  const methods = t.store.cart.methods

  return (
    <fieldset disabled={disabled} className="flex flex-col gap-space-xs">
      <legend className="mb-space-xs font-label-md text-label-md text-on-surface">{t.store.cart.paymentMethod}</legend>
      <div className="grid grid-cols-2 gap-space-xs">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method}
            className="relative flex min-h-[64px] cursor-pointer items-start gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest p-space-sm pr-7 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary-fixed/40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary"
          >
            <input
              type="radio"
              name={name}
              value={method}
              checked={value === method}
              onChange={() => onChange(method)}
              className="sr-only"
            />
            <Icon
              name={METHOD_ICONS[method]}
              className={`mt-0.5 text-[22px] ${value === method ? 'text-primary' : 'text-on-surface-variant'}`}
            />
            <span className="flex min-w-0 flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">{methods[method].title}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{methods[method].subtitle}</span>
            </span>
            {value === method && (
              <Icon name="check_circle" fill className="absolute right-1.5 top-1.5 text-[18px] text-primary" />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
