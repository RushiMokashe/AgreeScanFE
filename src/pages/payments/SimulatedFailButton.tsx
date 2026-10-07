import { useI18n } from '../../i18n/i18n-context'
import type { SimulatedOutcome } from '../../lib/types'

/** The test checkout's way to see what a declined payment looks like. */
export function SimulatedFailButton({ busy, onClick }: { busy: SimulatedOutcome | null; onClick: () => void }) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      disabled={busy !== null}
      onClick={onClick}
      className="self-center min-h-[44px] px-space-sm font-label-md text-label-md text-error underline disabled:opacity-50"
    >
      {busy === 'FAILED' ? t.payments.paying : t.payments.simulatedFail}
    </button>
  )
}
