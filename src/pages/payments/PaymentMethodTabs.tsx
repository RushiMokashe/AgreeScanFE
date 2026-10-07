import { useId } from 'react'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { PAYMENT_METHOD_CHOICES, PAYMENT_METHOD_ICONS, type PaymentMethodChoice } from './payment-methods'

interface PaymentMethodTabsProps {
  value: PaymentMethodChoice
  onChange: (method: PaymentMethodChoice) => void
  /** Whether the seller offers Scan & Pay; when not, that option shows but cannot be chosen. */
  scanAndPayOffered: boolean
}

/** How the farmer pays: UPI, card, or Scan & Pay straight to the seller, as three radio cards. */
export function PaymentMethodTabs({ value, onChange, scanAndPayOffered }: PaymentMethodTabsProps) {
  const { t } = useI18n()
  const name = useId()
  const methods = t.payments.methods

  return (
    <fieldset className="flex flex-col gap-space-xs">
      <legend className="mb-space-xs font-title-md text-title-md font-bold text-on-surface">{methods.title}</legend>
      <div className="grid grid-cols-3 gap-space-xs">
        {PAYMENT_METHOD_CHOICES.map((method) => {
          const disabled = method === 'SCAN_AND_PAY' && !scanAndPayOffered
          const selected = value === method
          return (
            <label
              key={method}
              className={`relative flex min-h-[96px] flex-col items-center justify-center gap-1 rounded-xl border p-space-xs text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
                disabled
                  ? 'cursor-not-allowed border-outline-variant bg-surface-container opacity-60'
                  : selected
                    ? 'cursor-pointer border-primary bg-primary-fixed/40'
                    : 'cursor-pointer border-outline-variant bg-surface-container-lowest'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={method}
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(method)}
                className="sr-only"
              />
              <Icon
                name={PAYMENT_METHOD_ICONS[method]}
                className={`text-[26px] ${selected ? 'text-primary' : 'text-on-surface-variant'}`}
              />
              <span className="font-label-md text-label-md font-bold text-on-surface">{methods[method].title}</span>
              <span className="font-label-sm text-label-sm leading-tight text-on-surface-variant">
                {disabled ? methods.scanUnavailable : methods[method].subtitle}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
