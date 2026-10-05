import type { DemandLevel } from '../../../lib/types'

/** Mandi market & crop demand: live APMC rates, buyer purchase orders, grading tips and mandi transport. */
export const mandi = {
  loading: 'Loading mandi rates…',
  units: {
    quintals: (amount: string) => `${amount} Qtl`,
    perQuintal: (price: string) => `${price} / Qtl`,
    tonnes: (tonnes: number) => `${tonnes} Metric ${tonnes === 1 ? 'Tonne' : 'Tonnes'}`,
  },
  market: {
    photoAlt: (market: string) => `Trading yard at ${market}`,
    select: (market: string) => `Select Mandi Location: ${market}`,
    moreSoon: 'More mandis coming soon',
    arrivals: "Today's Arrivals",
    forecast: 'AgriScan AI Forecast',
  },
  rates: {
    title: 'Commodity Rates',
    updated: (ago: string) => `Updated ${ago}`,
    perUnit: (unit: string) => `Per ${unit}`,
    demand: {
      HIGH_DEMAND: 'HIGH DEMAND',
      HOT: 'HOT',
      STABLE: 'STABLE',
      STEADY: 'STEADY',
    } satisfies Record<DemandLevel, string>,
  },
  inquiries: {
    title: 'Buyer Inquiries & POs',
    subtitle: 'Direct institutional procurement without middleman cut',
    active: (count: number) => `${count} Active`,
    verifiedBuyer: 'Verified buyer',
    volume: 'Required Volume',
    submitting: 'Submitting...',
    registered: 'Lot Registered!',
    registeredWith: (buyer: string) => `Lot registered with ${buyer}`,
    registerFailed: 'Could not register your lot. Please try again.',
  },
  grading: {
    title: 'Mandi Grading & Sorting Guide',
    subtitle: 'How to earn 25-35% higher auction price at APMC yard',
    /** **Bold** segments of a body are emphasised in the tip's colour. */
    tips: {
      sortDamaged: {
        title: 'Separate Blighted / Spotted Produce',
        body: 'Traders deduct up to **30% total lot value** if even 5% damaged fruit is spotted in the top layer. Grade your harvest into Grade A, B, and C crates at farmgate.',
      },
      packEarly: {
        title: 'Pack at 5:30 AM to Avoid Transit Weight Loss',
        body: 'Harvesting during midday heat increases moisture transpiration, shedding up to **2.5 kg weight per quintal** during mandi transport.',
      },
    },
    scanTitle: 'Scan Your Crop for Quality Grade',
    scanHint: 'AgriScan AI camera auto-detects size caliber & color break %',
    openCamera: 'Open Camera',
  },
  transport: {
    badge: 'Verified Mandi Logistics',
    title: (market: string) => `Ready to dispatch harvest to ${market}?`,
    body: 'Book verified local Bolero Pickup, 407 tempo, or tractor trolleys at fixed APMC transit tariffs. Real-time driver tracking and insured cargo.',
    book: 'Book Transport Now',
    callDispatcher: 'Call Mandi Dispatcher',
  },
  helpline: (market: string) => `${market} Helpline:`,
}
