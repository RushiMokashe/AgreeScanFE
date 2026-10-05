import type { DealerCertification } from '../../../lib/types'

/** Treatment tracker & agro stores: the plan's daily protocol, stockists near the farmer, the agronomist on duty. */
export const treatment = {
  plan: {
    loading: 'Loading treatment plan…',
    loadFailed: 'Could not load the treatment plan',
    outbreak: 'Active Outbreak Action',
    stepsDone: (done: number, total: number) => `Step ${done} of ${total} Done`,
    target: 'Target:',
    progress: 'Course Progress',
    percentCompleted: (percent: number) => `${percent}% Completed`,
  },
  timeline: {
    title: (days: number) => `${days}-Day Protocol Timeline`,
    timeZone: 'IST +05:30',
    day: (day: number, label: string) => `Day ${day} • ${label}`,
    completed: 'Completed',
    completedAt: (time: string) => `Completed at ${time}`,
    checkupPhoto: 'Upload Check-up Photo to Verify Recovery',
    checkupHint: 'AI will compare lesion surface area reduction against Day 1 baseline',
  },
  step: {
    markDone: 'Mark as Done',
    markedDone: (title: string) => `${title} marked as done`,
    updateFailed: 'Could not update this step. Please try again.',
  },
  /** The next step's reminder button (add / active) and the toasts after toggling it (added / cancelled). */
  reminder: {
    add: 'Set Alarm Reminder',
    addAt: (time: string) => `Set Alarm Reminder (${time})`,
    active: 'Reminder Set ✓',
    activeAt: (time: string) => `Reminder Set for ${time} ✓`,
    added: 'Reminder set',
    addedAt: (time: string) => `Reminder set for ${time}`,
    cancelled: 'Reminder cancelled',
  },
  stores: {
    loading: 'Finding stores near you…',
    loadFailed: 'Could not load nearby stores',
    title: 'Stores with Stock Near You',
    area: (hub: string, district: string, radiusKm: number) => `${hub} (${district}) - Radius ${radiusKm} km`,
    inventory: (products: string) => `Verified live dealer inventory for ${products}`,
    orderNow: 'Order Now',
    stockists: (count: number, hub: string) =>
      `${count} authorized ${count === 1 ? 'stockist' : 'stockists'} in ${hub}`,
  },
  dealer: {
    certification: {
      GOVT_CERTIFIED: 'Govt Certified Dealer',
      AUTHORIZED_RETAILER: 'Authorized Retailer',
    } satisfies Record<DealerCertification, string>,
    distance: (km: number, address: string) => `${km} km away • ${address}`,
    reviews: (count: number) => `${count} ${count === 1 ? 'review' : 'reviews'}`,
    /** A large count, shown as a lower bound. */
    reviewsPlus: (count: number) => `${count}+ reviews`,
    call: 'Call Dealer',
    callLabel: (name: string) => `Call Dealer, ${name}`,
    route: 'Get Route',
    routeLabel: (name: string) => `Get Route to ${name} (opens Google Maps)`,
  },
  agronomist: {
    loading: 'Loading agronomist…',
    loadFailed: 'Could not load the agronomist on duty',
    onDuty: 'Agronomist on Duty',
    offDuty: 'Agronomist Off Duty',
    photoAlt: (name: string) => `Portrait of ${name}`,
    call: 'Connect Call Now (Free Toll-Free)',
  },
}
