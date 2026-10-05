import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { BuyerInquiry } from '../../lib/types'

interface InquiryActionButtonProps {
  inquiry: BuyerInquiry
  /** This inquiry's response is being submitted. */
  pending: boolean
  /** A response is being submitted, here or on another inquiry. */
  disabled: boolean
  onRespond: (inquiry: BuyerInquiry) => void
}

const BUTTON_CLASS = 'min-h-[48px] px-space-md rounded-lg font-label-lg text-label-lg font-bold flex items-center gap-1.5'

/** The inquiry's call to action ("Sell Harvest"), its submitting state, and the registered state. */
export function InquiryActionButton({ inquiry, pending, disabled, onRespond }: InquiryActionButtonProps) {
  const { t } = useI18n()

  if (inquiry.responded) {
    return (
      <button type="button" disabled className={`${BUTTON_CLASS} bg-secondary text-on-secondary`}>
        <Icon name="done" className="text-[18px]" />
        {t.mandi.inquiries.registered}
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-busy={pending}
      onClick={() => onRespond(inquiry)}
      className={`${BUTTON_CLASS} ${
        inquiry.actionPrimary
          ? 'bg-primary text-on-primary active:bg-primary-container shadow-sm'
          : 'bg-surface-container-high text-primary active:bg-secondary-container'
      }`}
    >
      {pending ? (
        <>
          <Icon name="refresh" className="text-[18px] animate-spin" />
          {t.mandi.inquiries.submitting}
        </>
      ) : (
        <>
          <span>{inquiry.actionLabel}</span>
          {inquiry.actionIcon && <Icon name={inquiry.actionIcon} className="text-[18px]" />}
        </>
      )}
    </button>
  )
}
