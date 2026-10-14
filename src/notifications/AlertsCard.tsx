import { useState } from 'react'
import { Icon } from '../components/Icon'
import { useI18n } from '../i18n/i18n-context'
import { alertPermission, requestAlertPermission, type AlertPermission } from './system-notifications'

/**
 * Offers system alerts for background tabs. Browsers only let a page ask after a tap, so permission is asked
 * here, never on load; a device without alerts sees nothing.
 */
export function AlertsCard() {
  const { t } = useI18n()
  const [permission, setPermission] = useState<AlertPermission>(alertPermission)

  if (permission === 'unsupported') return null

  return (
    <section className="flex items-start gap-space-sm rounded-xl bg-secondary-container/50 p-space-sm">
      <Icon name="notifications_active" className="text-[22px] text-secondary mt-0.5" />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h2 className="font-label-lg text-label-lg text-on-surface font-bold">{t.notifications.alerts.title}</h2>
        {permission === 'default' && (
          <>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.notifications.alerts.message}</p>
            <button
              type="button"
              onClick={() => void requestAlertPermission().then(setPermission)}
              className="self-start mt-1 min-h-[44px] rounded-lg bg-secondary px-space-md font-label-md text-label-md font-bold text-on-secondary active:scale-95 transition-transform"
            >
              {t.notifications.alerts.enable}
            </button>
          </>
        )}
        {permission === 'granted' && (
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.notifications.alerts.enabled}</p>
        )}
        {permission === 'denied' && (
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.notifications.alerts.blocked}</p>
        )}
      </div>
    </section>
  )
}
