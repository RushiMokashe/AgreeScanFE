import { useState } from 'react'
import { BottomSheet } from '../../components/BottomSheet'
import { FormError } from '../../components/form/FormError'
import { Icon } from '../../components/Icon'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { RentalHubOption } from '../../lib/types'

interface HubPickerSheetProps {
  currentHubId: number
  /** Called once the farmer's choice is saved. */
  onChosen: (hub: RentalHubOption) => void
  onClose: () => void
}

/** The rentals screen's "Change": every hub, and the farmer's choice saved as their preferred hub. */
export function HubPickerSheet({ currentHubId, onChosen, onClose }: HubPickerSheetProps) {
  const { t } = useI18n()
  const { data: hubs, error, reload } = useApi(() => api.rentalHubs())
  const [savingId, setSavingId] = useState<number | null>(null)
  const [saveError, setSaveError] = useState<string>()

  const choose = async (hub: RentalHubOption) => {
    if (hub.id === currentHubId) {
      onClose()
      return
    }
    setSavingId(hub.id)
    setSaveError(undefined)
    try {
      await api.updateFarmerPreferences({ rentalHubId: hub.id })
      onChosen(hub)
    } catch (reason) {
      setSaveError(describeError(reason, t.rentals.location.changeFailed))
      setSavingId(null)
    }
  }

  return (
    <BottomSheet title={t.rentals.location.hubsTitle} onClose={onClose}>
      {error && <ErrorState error={error} onRetry={reload} />}
      {!error && !hubs && <LoadingState label={t.rentals.location.hubsLoading} />}
      {hubs && (
        <ul className="flex flex-col gap-space-sm pt-space-xs">
          {hubs.map((hub) => {
            const current = hub.id === currentHubId
            return (
              <li key={hub.id}>
                <button
                  type="button"
                  aria-pressed={current}
                  disabled={savingId !== null}
                  onClick={() => void choose(hub)}
                  className={`w-full min-h-[64px] flex items-center gap-space-sm rounded-xl border p-space-sm text-left transition-colors ${
                    current ? 'border-primary bg-primary-fixed/40' : 'border-outline-variant bg-surface-container-lowest'
                  }`}
                >
                  <span className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                    <Icon name="location_on" className="text-[20px]" />
                  </span>
                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">{hub.name}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {t.rentals.location.radius(hub.radiusKm)} • {hub.routes}
                    </span>
                  </span>
                  {savingId === hub.id ? (
                    <Icon name="progress_activity" className="text-[22px] text-primary animate-spin" />
                  ) : (
                    current && <Icon name="check_circle" fill className="text-[22px] text-primary" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {saveError && (
        <div className="pt-space-sm">
          <FormError message={saveError} />
        </div>
      )}
    </BottomSheet>
  )
}
