import { useId, useRef, type ReactNode } from 'react'
import { useModalFocus } from '../hooks/useModalFocus'
import { useI18n } from '../i18n/i18n-context'
import { Icon } from './Icon'

interface BottomSheetProps {
  title: string
  /** A line under the title, e.g. the vehicle being booked. */
  subtitle?: string
  onClose: () => void
  children: ReactNode
}

/**
 * A modal sheet rising from the bottom of the phone column: a title bar with a close button over scrollable
 * content. Mount it while open; focus stays inside, Escape or a tap on the backdrop closes it.
 */
export function BottomSheet({ title, subtitle, onClose, children }: BottomSheetProps) {
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
        className="fixed inset-x-0 bottom-0 z-[56] mx-auto flex max-h-[88dvh] max-w-md flex-col rounded-t-2xl bg-surface-container-lowest shadow-xl outline-none transition-transform duration-200 ease-out starting:translate-y-full"
      >
        <div className="flex items-start justify-between gap-space-sm px-margin pt-space-md pb-space-sm">
          <div className="flex min-w-0 flex-col">
            <h2 id={titleId} className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {title}
            </h2>
            {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label={t.common.close}
            onClick={onClose}
            className="-mr-2 flex h-11 w-11 min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container active:bg-surface-container-high"
          >
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-margin pb-[calc(1.5rem_+_env(safe-area-inset-bottom,0px))]">
          {children}
        </div>
      </div>
    </>
  )
}
