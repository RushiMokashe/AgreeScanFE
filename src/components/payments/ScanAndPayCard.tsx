import { useState } from 'react'
import { useI18n } from '../../i18n/i18n-context'
import { BottomSheet } from '../BottomSheet'
import { Icon } from '../Icon'
import { ScanAndPaySettings } from './ScanAndPaySettings'

interface ScanAndPayCardProps {
  acceptsScanAndPay: boolean
  upiId: string | null
  upiQrUrl: string | null
  onSaveUpiId: (upiId: string | null) => Promise<void>
  onUploadQr: (image: File) => Promise<void>
  onRemoveQr: () => Promise<void>
}

/** Whether farmers can pay the seller by Scan & Pay, with the settings a tap away in a sheet. */
export function ScanAndPayCard({ acceptsScanAndPay, upiId, upiQrUrl, ...settings }: ScanAndPayCardProps) {
  const { t } = useI18n()
  const texts = t.payments.setup
  const [editing, setEditing] = useState(false)

  return (
    <section className="flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
          acceptsScanAndPay ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        <Icon name="qr_code_scanner" className="text-[24px]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-title-md text-title-md font-bold text-on-surface">
          {acceptsScanAndPay ? texts.on : texts.off}
        </span>
        <span className="truncate font-body-sm text-body-sm text-on-surface-variant">{upiId ?? texts.needsOne}</span>
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="min-h-[44px] flex-shrink-0 rounded-lg bg-surface-container px-space-md font-label-md text-label-md font-bold text-primary active:bg-surface-container-high"
      >
        {acceptsScanAndPay ? texts.change : texts.edit}
      </button>
      {editing && (
        <BottomSheet title={texts.title} onClose={() => setEditing(false)}>
          <div className="pt-space-xs">
            <ScanAndPaySettings upiId={upiId} upiQrUrl={upiQrUrl} {...settings} onSaved={() => setEditing(false)} />
          </div>
        </BottomSheet>
      )}
    </section>
  )
}
