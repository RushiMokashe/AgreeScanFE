import { useRef, useState, type FormEvent } from 'react'
import { FormError } from '../../components/form/FormError'
import { SubmitButton } from '../../components/form/SubmitButton'
import { TextField } from '../../components/form/TextField'
import { useFieldErrors } from '../../hooks/useFieldErrors'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import {
  cardBrand,
  checkCardNumber,
  checkCvc,
  checkExpiry,
  cvcLength,
  formatCardNumber,
  formatCvc,
  formatExpiry,
} from '../../lib/payment-checks'
import type { PaymentCheckout } from '../../lib/types'
import { SimulatedFailButton } from './SimulatedFailButton'
import { useSimulatedConfirm } from './useSimulatedConfirm'

/** The longest a card number gets with its spaces: 19 digits in groups of four. */
const CARD_NUMBER_MAX_LENGTH = 23
const EXPIRY_LENGTH = 5

interface SimulatedCardFormProps {
  checkout: PaymentCheckout
  onDone: (paymentId: number) => void
}

/**
 * The test checkout's card form, checked like a real one: the number is spaced as it is typed and must pass the Luhn
 * check for its network (Visa, Mastercard, RuPay, Amex), the expiry is MM/YY and not past, the CVV has its network's
 * length. Each field shows its problem once it is left, and all of them on Pay.
 */
export function SimulatedCardForm({ checkout, onDone }: SimulatedCardFormProps) {
  const { t } = useI18n()
  const format = useFormat()
  const texts = t.payments.card
  const [number, setNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const numberRef = useRef<HTMLInputElement>(null)
  const expiryRef = useRef<HTMLInputElement>(null)
  const cvcRef = useRef<HTMLInputElement>(null)
  const { busy, failure, confirm } = useSimulatedConfirm(checkout.paymentId, 'CARD', onDone)

  const brand = cardBrand(number)
  const numberProblem = checkCardNumber(number)
  const expiryProblem = checkExpiry(expiry)
  const cvcProblem = checkCvc(cvc, brand)
  const fields = useFieldErrors({
    number: numberProblem && texts.numberErrors[numberProblem],
    expiry: expiryProblem && texts.expiryErrors[expiryProblem],
    cvc: cvcProblem && (cvcProblem === 'required' ? texts.cvcErrors.required : texts.cvcErrors.incomplete(cvcLength(brand))),
  })

  const pay = (event: FormEvent) => {
    event.preventDefault()
    if (fields.submit()) {
      void confirm('SUCCEEDED')
      return
    }
    const firstInvalid = { number: numberRef, expiry: expiryRef, cvc: cvcRef }[fields.firstInvalid ?? 'number']
    firstInvalid.current?.focus()
  }

  return (
    <form noValidate onSubmit={pay} className="flex flex-col gap-space-md">
      <TextField
        ref={numberRef}
        label={texts.number}
        hint={brand ? texts.brands[brand] : texts.numberHint}
        error={fields.errorOf('number')}
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="4111 1111 1111 1111"
        maxLength={CARD_NUMBER_MAX_LENGTH}
        value={number}
        onChange={(event) => setNumber(formatCardNumber(event.target.value))}
        onBlur={() => fields.touch('number')}
      />
      <div className="grid grid-cols-2 items-start gap-space-sm">
        <TextField
          ref={expiryRef}
          label={texts.expiry}
          error={fields.errorOf('expiry')}
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          maxLength={EXPIRY_LENGTH}
          value={expiry}
          onChange={(event) => setExpiry((previous) => formatExpiry(event.target.value, previous))}
          onBlur={() => fields.touch('expiry')}
        />
        <TextField
          ref={cvcRef}
          label={texts.cvc}
          hint={texts.cvcHint(cvcLength(brand), brand === 'AMEX')}
          error={fields.errorOf('cvc')}
          type="password"
          inputMode="numeric"
          autoComplete="cc-csc"
          maxLength={cvcLength(brand)}
          value={cvc}
          onChange={(event) => setCvc(formatCvc(event.target.value, brand))}
          onBlur={() => fields.touch('cvc')}
        />
      </div>
      {failure && <FormError message={failure} />}
      <SubmitButton busy={busy === 'SUCCEEDED'} busyLabel={t.payments.paying} icon="lock" disabled={busy !== null}>
        {t.payments.pay(format.inr(checkout.amount))}
      </SubmitButton>
      <SimulatedFailButton busy={busy} onClick={() => void confirm('FAILED')} />
    </form>
  )
}
