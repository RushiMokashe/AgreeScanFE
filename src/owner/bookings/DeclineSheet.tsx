import { ReasonSheet } from '../../components/booking/ReasonSheet'
import { useI18n } from '../../i18n/i18n-context'

interface DeclineSheetProps {
  /** Declines with the reason; rejects with an ApiError, which the sheet shows. */
  onDecline: (reason: string | null) => Promise<void>
  onClose: () => void
}

/** Confirms turning a request down, with a reason that helps the farmer find another vehicle. */
export function DeclineSheet({ onDecline, onClose }: DeclineSheetProps) {
  const { t } = useI18n()
  const reasons = t.owner.bookings.quickReasons

  return (
    <ReasonSheet
      title={t.owner.bookings.declineTitle}
      message={t.owner.bookings.declineMessage}
      quickReasons={[reasons.busy, reasons.outsideArea, reasons.repair]}
      confirmLabel={t.owner.bookings.declineConfirm}
      busyLabel={t.owner.bookings.declining}
      onConfirm={onDecline}
      onClose={onClose}
    />
  )
}
