import type { Role } from '../../../lib/types'

/** Texts every screen shares (platform). */
export const common = {
  loading: 'Loading…',
  loadFailed: 'Could not load this screen',
  retry: 'Try again',
  close: 'Close',
  placeholder: 'We are still building this screen. It will be ready in an upcoming update.',
  errors: {
    serverUnreachable: 'AgriScan server is not reachable right now. Please try again in a moment.',
    noConnection: 'Could not connect. Check your internet connection and try again.',
    sessionExpired: 'Your session has expired. Please sign in again.',
    requestFailed: (status: number) => `Request failed (${status})`,
    unexpected: 'Something went wrong. Please try again.',
  },
  language: {
    label: 'Language',
    loadFailed: (language: string) => `Could not switch to ${language}. Check your connection and try again.`,
  },
  speech: {
    unsupported: 'Audio playback is not supported on this device',
  },
  roles: {
    FARMER: 'Farmer',
    VEHICLE_OWNER: 'Vehicle owner',
    SHOPKEEPER: 'Shopkeeper',
    ADMIN: 'Admin',
  } satisfies Record<Role, string>,
  photo: {
    choose: 'Choose photo',
    change: 'Change photo',
    hint: 'JPEG, PNG or WebP, up to 10 MB',
    notImage: 'Choose a photo (JPEG, PNG or WebP)',
    tooLarge: 'This photo is larger than 10 MB',
  },
  notFound: {
    title: 'This field is empty',
    message: 'The page you opened does not exist.',
    home: 'Back to Home',
  },
  crash: {
    title: 'Something went wrong',
    message: 'This screen stopped working. Reload the app to continue.',
    reload: 'Reload',
  },
}
