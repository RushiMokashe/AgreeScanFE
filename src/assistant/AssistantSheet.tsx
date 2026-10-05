import { useId, useRef } from 'react'
import { Icon } from '../components/Icon'
import { useModalFocus } from '../hooks/useModalFocus'
import { useI18n } from '../i18n/i18n-context'

interface AssistantSheetProps {
  open: boolean
  onClose: () => void
}

/**
 * PLACEHOLDER (platform). The farm & crop health agent builds the voice assistant here (D6): questions to
 * POST /api/assistant/ask in the active language, speech in and out through lib/speech.ts, texts in the
 * `assistant` namespace. FarmerLayout renders this component once, closed until useAssistant().open(); it
 * stays mounted while closed, so a conversation can outlive closing the sheet.
 */
export function AssistantSheet({ open, onClose }: AssistantSheetProps) {
  return open ? <ComingSoonSheet onClose={onClose} /> : null
}

function ComingSoonSheet({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useModalFocus(sheetRef, onClose)

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[55] bg-inverse-surface/40 touch-none transition-opacity duration-200 starting:opacity-0"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fixed inset-x-0 bottom-0 z-[56] mx-auto flex max-w-md flex-col items-center gap-space-sm rounded-t-2xl bg-surface-container-lowest px-margin pb-[calc(1.5rem_+_env(safe-area-inset-bottom,0px))] pt-space-lg text-center shadow-xl outline-none transition-transform duration-200 ease-out starting:translate-y-full"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <Icon name="mic" className="text-[32px]" />
        </div>
        <h2 id={titleId} className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {t.nav.header.assistant}
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{t.common.placeholder}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-space-sm min-h-[48px] w-full rounded-xl bg-primary font-label-lg text-label-lg text-on-primary active:scale-[0.99] transition-transform"
        >
          {t.common.close}
        </button>
      </div>
    </>
  )
}
