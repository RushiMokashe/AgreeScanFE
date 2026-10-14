/** The notification bell, list and live alerts of the farmer app and the owner portal (D10). */
export const notifications = {
  /** The bell's accessible name. */
  bell: (count: number) => (count === 0 ? 'Notifications' : `Notifications, ${count} unread`),
  /** On the toast of a live notification. */
  view: 'View',
  loading: 'Loading notifications…',
  markAllRead: 'Mark all as read',
  unread: 'Unread',
  loadMore: 'Show older notifications',
  empty: {
    title: 'No notifications yet',
    message: 'Updates about your bookings and payments will appear here.',
  },
  alerts: {
    title: 'Alerts on this device',
    message: 'Get booking and payment updates even while AgriScan is in the background.',
    enable: 'Turn on alerts',
    enabled: 'Alerts are on for this device.',
    blocked: 'Alerts are blocked. Allow notifications for AgriScan in your browser settings.',
  },
}
