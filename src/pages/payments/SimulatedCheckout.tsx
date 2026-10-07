import { useState, type FormEvent } from 'react'
import { FormError } from '../../components/form/FormError'
import { SubmitButton } from '../../components/form/SubmitButton'
import { TextField } from '../../components/form/TextField'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { api, describeError } from '../../lib/api'
import type { PaymentCheckout, SimulatedMethod, SimulatedOutcome } from '../../lib/types'
import { digitsOnly, isCardNumber, isCvc, isFutureExpiry, isUpiId } from './payment-utils'

const METHODS: readonly SimulatedMethod[] = ['CARD', 'UPI']

interface CardErrors {
  number?: string
  expiry?: string
  cvc?: string
  upiId?: string
}

interface SimulatedCheckoutProps {
  checkout: PaymentCheckout
  /** The payment was confirmed; the result page shows how it ended. */
  onDone: () => void
}

/**
 * The simulated provider's checkout (D5): card or UPI fields checked like a real form, but no money moves; the
 * tester chooses whether the payment succeeds or fails.
 */
export function SimulatedCheckout({ checkout, onDone }: SimulatedCheckoutProps) {
  const { t } = useI18n()
  const format = useFormat()
  const [method, setMethod] = useState<SimulatedMethod>('UPI')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [upiId, setUpiId] = useState('')
  const [errors, setErrors] = useState<CardErrors>({})
  const [busy, setBusy] = useState<SimulatedOutcome | null>(null)
  const [failure, setFailure] = useState<string>()
  const texts = t.payments.simulated

  const validate = (): CardErrors =>
    method === 'CARD'
      ? {
          number: isCardNumber(digitsOnly(cardNumber)) ? undefined : texts.cardNumberInvalid,
          expiry: isFutureExpiry(expiry) ? undefined : texts.expiryInvalid,
          cvc: isCvc(cvc) ? undefined : texts.cvcInvalid,
        }
      : { upiId: isUpiId(upiId) ? undefined : texts.upiIdInvalid }

  const confirm = async (outcome: SimulatedOutcome) => {
    setBusy(outcome)
    setFailure(undefined)
    try {
      await api.payments.confirm(checkout.paymentId, { simulatedOutcome: outcome, simulatedMethod: method })
      onDone()
    } catch (error) {
      setFailure(describeError(error, t.payments.confirmFailed))
      setBusy(null)
    }
  }

  const pay = (event: FormEvent) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.values(found).every((error) => error === undefined)) void confirm('SUCCEEDED')
  }

  return (
    <form noValidate onSubmit={pay} className="flex flex-col gap-space-md">
      <fieldset className="flex flex-col gap-space-xs">
        <legend className="mb-space-xs font-label-md text-label-md text-on-surface">{texts.methodLabel}</legend>
        <div className="grid grid-cols-2 gap-space-xs rounded-xl bg-surface-container p-1">
          {METHODS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={method === option}
              onClick={() => {
                setMethod(option)
                setErrors({})
              }}
              className={`min-h-[44px] flex items-center justify-center gap-1 rounded-lg font-label-md text-label-md transition-colors ${
                method === option ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              <Icon name={option === 'CARD' ? 'credit_card' : 'qr_code_2'} className="text-[20px]" />
              {texts.methods[option]}
            </button>
          ))}
        </div>
      </fieldset>

      {method === 'CARD' ? (
        <>
          <TextField
            label={texts.cardNumber}
            error={errors.number}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4111 1111 1111 1111"
            maxLength={23}
            value={cardNumber}
            onChange={(event) => setCardNumber(event.target.value)}
          />
          <div className="grid grid-cols-2 gap-space-sm">
            <TextField
              label={texts.expiry}
              error={errors.expiry}
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              maxLength={5}
              value={expiry}
              onChange={(event) => setExpiry(event.target.value)}
            />
            <TextField
              label={texts.cvc}
              error={errors.cvc}
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              maxLength={4}
              value={cvc}
              onChange={(event) => setCvc(event.target.value)}
            />
          </div>
        </>
      ) : (
        <TextField
          label={texts.upiId}
          hint={texts.upiIdHint}
          error={errors.upiId}
          autoComplete="off"
          autoCapitalize="none"
          placeholder="farmer@upi"
          value={upiId}
          onChange={(event) => setUpiId(event.target.value)}
        />
      )}

      {failure && <FormError message={failure} />}
      <SubmitButton busy={busy === 'SUCCEEDED'} busyLabel={t.payments.paying} icon="lock" disabled={busy !== null}>
        {t.payments.pay(format.inr(checkout.amount))}
      </SubmitButton>
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => void confirm('FAILED')}
        className="self-center min-h-[44px] px-space-sm font-label-md text-label-md text-error underline disabled:opacity-50"
      >
        {busy === 'FAILED' ? t.payments.paying : texts.fail}
      </button>
    </form>
  )
}
