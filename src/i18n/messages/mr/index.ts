import type { Messages } from '../../translation'
import { admin } from './admin'
import { assistant } from './assistant'
import { auth } from './auth'
import { bookings } from './bookings'
import { common } from './common'
import { diagnosis } from './diagnosis'
import { home } from './home'
import { mandi } from './mandi'
import { nav } from './nav'
import { notifications } from './notifications'
import { orders } from './orders'
import { owner } from './owner'
import { payments } from './payments'
import { plots } from './plots'
import { profile } from './profile'
import { rentals } from './rentals'
import { scan } from './scan'
import { store } from './store'
import { treatment } from './treatment'

/** Marathi, loaded the first time it is chosen. */
export const mr: Messages = {
  common,
  nav,
  auth,
  profile,
  home,
  scan,
  diagnosis,
  plots,
  assistant,
  treatment,
  mandi,
  rentals,
  bookings,
  notifications,
  store,
  orders,
  payments,
  owner,
  admin,
}
