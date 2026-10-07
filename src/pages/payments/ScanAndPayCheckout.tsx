import { useRef, useState, type FormEvent } from 'react'
import { FormError } from '../../components/form/FormError'
import { SubmitButton } from '../../components/form/SubmitButton'
import { TextField } from '../../components/form/TextField'
import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useFieldErrors } from '../../hooks/useFieldErrors'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { api, describeError } from '../../lib/api'
import { checkUpiReference, formatUpiReference, UPI_REFERENCE_LENGTH } from '../../lib/payment-checks'
import type { PaymentCheckout, ScanAndPayOption } from '../../lib/types'
import { apiUrl } from '../../platform/api-base'

interface ScanAndPayCheckoutProps {
  checkout: PaymentCheckout
  option: ScanAndPayOption
  /** Called with the Scan & Pay payment, which waits for the seller to confirm it. */
  onDone: (paymentId: number) => void
}

/**
 * Paying the seller directly: their UPI QR (the one they uploaded, or one drawn from their UPI ID with the amount
 * filled in), their UPI ID to copy, and on a phone a link that opens a UPI app. After paying, the farmer enters the
 * 12-digit UPI reference their app shows, and the seller confirms the money arrived.
 */
export function ScanAndPayCheckout({ checkout, option, onDone }: ScanAndPayCheckoutProps) {
  const { t } = useI18n()
  const format = useFormat()
  const toast = useToast()
  const texts = t.payments.scanAndPay
  const amount = format.inr(checkout.amount)
  const [reference, setReference] = useState('')
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)
  const problem = checkUpiReference(reference)
  const fields = useFieldErrors({ reference: problem && texts.referenceErrors[problem] })
  const qrSource = option.qrImageUrl ? apiUrl(option.qrImageUrl) : option.generatedQr

  const copyUpiId = (upiId: string) => {
    void navigator.clipboard?.writeText(upiId).then(() => toast.show(texts.copied, 'info'))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!fields.submit()) {
      inputRef.current?.focus()
      return
    }
    setBusy(true)
    setFailure(undefined)
    try {
      const payment = await api.payments.scanAndPay({
        purpose: checkout.purpose,
        referenceId: checkout.referenceId,
        upiReference: reference,
      })
      onDone(payment.paymentId)
    } catch (error) {
      setFailure(describeError(error, texts.failed))
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-space-md">
      <section className="flex flex-col items-center gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md text-center shadow-sm">
        <p className="font-title-md text-title-md font-bold text-on-surface">{texts.scan(option.payeeName)}</p>
        {qrSource && (
          <img
            src={qrSource}
            alt={texts.qrAlt(option.payeeName)}
            className="h-60 w-60 rounded-xl border border-outline-variant bg-white object-contain p-2"
          />
        )}
        <p className="font-label-sm text-label-sm text-on-surface-variant">{texts.apps}</p>
        {option.upiId && (
          <div className="flex w-full items-center justify-between gap-space-sm rounded-xl bg-surface-container px-space-md py-space-xs">
            <div className="flex min-w-0 flex-col text-left">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{texts.upiId}</span>
              <span className="truncate font-body-md text-body-md font-semibold text-on-surface">{option.upiId}</span>
            </div>
            <button
              type="button"
              onClick={() => copyUpiId(option.upiId ?? '')}
              className="flex min-h-[44px] flex-shrink-0 items-center gap-1 rounded-lg px-space-sm font-label-md text-label-md text-primary active:bg-surface-container-high"
            >
              <Icon name="content_copy" className="text-[18px]" />
              {texts.copy}
            </button>
          </div>
        )}
        {option.upiLink && (
          <a
            href={option.upiLink}
            className="flex min-h-[48px] w-full items-center justify-center gap-space-xs rounded-xl border border-primary font-label-lg text-label-lg text-primary active:bg-surface-container"
          >
            <Icon name="open_in_new" className="text-[20px]" />
            {texts.openApp(amount)}
          </a>
        )}
      </section>

      <ol className="flex flex-col gap-space-xs">
        {[texts.steps.scan, texts.steps.pay(amount), texts.steps.reference].map((step, index) => (
          <li key={step} className="flex items-start gap-space-sm font-body-md text-body-md text-on-surface">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary font-label-sm text-label-sm text-on-primary">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-space-md">
        <TextField
          ref={inputRef}
          label={texts.reference}
          hint={texts.referenceHint}
          error={fields.errorOf('reference')}
          inputMode="numeric"
          autoComplete="off"
          placeholder="412345678901"
          maxLength={UPI_REFERENCE_LENGTH}
          value={reference}
          onChange={(event) => setReference(formatUpiReference(event.target.value))}
          onBlur={() => fields.touch('reference')}
        />
        {failure && <FormError message={failure} />}
        <SubmitButton busy={busy} busyLabel={texts.submitting} icon="task_alt">
          {texts.submit(amount)}
        </SubmitButton>
        <p className="text-center font-body-sm text-body-sm text-on-surface-variant">{texts.note(option.payeeName)}</p>
      </form>
    </div>
  )
}
