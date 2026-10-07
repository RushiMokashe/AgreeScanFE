import type { AppNotification } from '../lib/types'

/** Whether this device can show alerts: unsupported, not asked yet ('default'), 'granted' or 'denied'. */
export type AlertPermission = NotificationPermission | 'unsupported'

const ALERT_ICON = '/images/brand/agriscan-mark.svg'

export function alertPermission(): AlertPermission {
  return 'Notification' in window ? Notification.permission : 'unsupported'
}

/** Asks for permission to show alerts; browsers allow asking only in response to a tap or click. */
export async function requestAlertPermission(): Promise<AlertPermission> {
  return 'Notification' in window ? Notification.requestPermission() : 'unsupported'
}

/**
 * Shows a live notification as a system alert while AgriScan is in a background tab, if the user allowed it;
 * clicking the alert brings the tab back and calls `onOpen`. In a visible tab the in-app toast is enough.
 */
export function showSystemAlert(notification: AppNotification, onOpen: () => void): void {
  if (alertPermission() !== 'granted' || document.visibilityState === 'visible') return
  const alert = new Notification(notification.title, {
    body: notification.body,
    tag: `agriscan-notification-${notification.id}`,
    icon: ALERT_ICON,
  })
  alert.onclick = () => {
    window.focus()
    onOpen()
    alert.close()
  }
}
