import type { RateUnit } from '../../../lib/types'

/** Farm rentals & mandi transport (/rentals): machinery and tempos for hire, the spotlight offer, guarantees. */
export const rentals = {
  loading: 'Finding rentals near you…',
  location: {
    radius: (km: number) => `${km} km Radius`,
    change: 'Change',
    changeLabel: 'Change location',
    changeComingSoon: 'Location change coming soon',
  },
  tabs: {
    label: 'Rental type',
    machinery: 'Tractors & Implements',
    transport: 'Mandi Tempos',
  },
  /** After a rate: "₹650/hr", "₹18/km", "₹2,800/day". */
  rateUnits: {
    HOUR: '/hr',
    KM: '/km',
    DAY: '/day',
  } satisfies Record<RateUnit, string>,
  /** Beside the locality: "2.4 km away • Kem Shivar". */
  distanceAway: (km: number) => `${km} km away`,
  spotlight: {
    fareStarts: 'Fare starts',
    /** The **starred** part is bold. */
    dispatch: (minutes: number) => `Dispatches in **${minutes} ${minutes === 1 ? 'min' : 'mins'}** to farm gate`,
    book: 'Book Tempo',
  },
  booking: {
    booked: 'Booked',
    failed: 'Could not book this rental. Please try again.',
  },
  machinery: {
    title: 'Available Machinery Near You',
    online: (count: number) => `${count} Online`,
  },
  transport: {
    title: 'Mandi Tempos & Tambos',
    gatePass: 'Gate Priority Pass',
  },
  favorite: {
    save: (name: string) => `Save ${name}`,
    saved: 'Saved to your favourites',
    removed: 'Removed from your favourites',
    failed: 'Could not update your saved rentals. Please try again.',
  },
  protection: {
    title: 'Kisan Protection & Mandi Trust',
    guarantees: {
      backupVehicle: {
        title: 'Zero Breakdown Delay Guarantee',
        description: 'If any rented tractor or tempo stalls, a nearby backup vehicle is dispatched within 45 mins.',
      },
      freeWaiting: {
        title: 'First 2 Hours Mandi Gate Waiting Free',
        description: 'No unfair detention charges while waiting for the APMC auctioneer or weighbridge turn.',
      },
      payAfterSale: {
        title: 'Post-Sale Payment Option',
        description:
          'Settle transport rent directly after obtaining your mandi sales voucher from the Adat / Commission Agent.',
      },
    },
  },
  mandiDesk: {
    name: '24x7 Kisan Mandi Desk',
    title: 'Urgent Harvest Transport?',
    /** Precedes the number: "Call Toll-Free: 1800-200-FARM". */
    tollFree: 'Call Toll-Free:',
    call: 'Call',
    callLabel: 'Call the 24x7 Kisan Mandi Desk',
  },
}
