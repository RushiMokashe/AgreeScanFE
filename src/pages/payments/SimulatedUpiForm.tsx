import { useRef, useState, type FormEvent } from 'react'
import { FormError } from '../../components/form/FormError'
import { SubmitButton } from '../../components/form/SubmitButton'
import { TextField } from '../../components/form/TextField'
import { useFieldErrors } from '../../hooks/useFieldErrors'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { checkUpiId } from '../../lib/payment-checks'
import type { PaymentCheckout } from '../../lib/types'
import { SimulatedFailButton } from './SimulatedFailButton'
import { useSimulatedConfirm } from './useSimulatedConfirm'

interface SimulatedUpiFormProps {
  checkout: PaymentCheckout
  onDone: (paymentId: number) => void
}

/** The test checkout's UPI form: a UPI ID like name@bank, shown wrong once the field is left or on Pay. */
export function SimulatedUpiForm({ checkout, onDone }: SimulatedUpiFormProps) {
  const { t } = useI18n()
  const format = useFormat()
  const texts = t.payments.upi
  const [upiId, setUpiId] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { busy, failure, confirm } = useSimulatedConfirm(checkout.paymentId, 'UPI', onDone)
  const problem = checkUpiId(upiId)
  const fields = useFieldErrors({ upiId: problem && texts.idErrors[problem] })

  const pay = (event: FormEvent) => {
    event.preventDefault()
    if (fields.submit()) void confirm('SUCCEEDED')
    else inputRef.current?.focus()
  }

  return (
    <form noValidate onSubmit={pay} className="flex flex-col gap-space-md">
      <TextField
        ref={inputRef}
        label={texts.id}
        hint={texts.idHint}
        error={fields.errorOf('upiId')}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="farmer@upi"
        value={upiId}
        onChange={(event) => setUpiId(event.target.value.trim())}
        onBlur={() => fields.touch('upiId')}
      />
      {failure && <FormError message={failure} />}
      <SubmitButton busy={busy === 'SUCCEEDED'} busyLabel={t.payments.paying} icon="lock" disabled={busy !== null}>
        {t.payments.pay(format.inr(checkout.amount))}
      </SubmitButton>
      <SimulatedFailButton busy={busy} onClick={() => void confirm('FAILED')} />
    </form>
  )
}
