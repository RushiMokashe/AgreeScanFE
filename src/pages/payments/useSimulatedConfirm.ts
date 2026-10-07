import { useState } from 'react'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { SimulatedMethod, SimulatedOutcome } from '../../lib/types'

/**
 * Confirms a payment with the simulated provider (D5), which lets the tester choose how it ends. `busy` names the
 * outcome being sent, so only its button spins.
 */
export function useSimulatedConfirm(paymentId: number, method: SimulatedMethod, onDone: (paymentId: number) => void) {
  const { t } = useI18n()
  const [busy, setBusy] = useState<SimulatedOutcome | null>(null)
  const [failure, setFailure] = useState<string>()

  const confirm = async (outcome: SimulatedOutcome) => {
    setBusy(outcome)
    setFailure(undefined)
    try {
      await api.payments.confirm(paymentId, { simulatedOutcome: outcome, simulatedMethod: method })
      onDone(paymentId)
    } catch (error) {
      setFailure(describeError(error, t.payments.confirmFailed))
      setBusy(null)
    }
  }

  return { busy, failure, confirm }
}
