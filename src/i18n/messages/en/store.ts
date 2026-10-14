import type { PaymentMethod } from '../../../lib/types'

/** 1 -> "1 item", 4 -> "4 items" */
const items = (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`

/** Agro store (/store): search, departments, the prescribed bundle, flash deals and the cart. */
export const store = {
  loading: 'Opening the agro store…',
  depot: {
    open: 'Open Now',
    closed: 'Closed',
  },
  search: {
    label: 'Search medicines, seeds and cattle feed',
    placeholder: 'Search medicines, seeds, cattle feed...',
    scanBarcode: 'Scan chemical barcode or seed batch packet',
    scanComingSoon: 'Barcode scanning coming soon',
  },
  voice: {
    label: 'Search by voice',
    listening: 'Speak now… listening for crop inputs',
    heard: (transcript: string) => `Search: ${transcript}`,
    cancel: 'Cancel',
    clear: 'Clear',
    unsupported: 'Voice search is not supported on this browser',
    errors: {
      noSpeech: 'Didn’t catch that. Tap the mic and speak again.',
      noMicrophone: 'No microphone found on this device.',
      micBlocked: 'Allow microphone access to search by voice.',
      offline: 'Voice search needs an internet connection.',
      failed: 'Voice search failed. Please type your search.',
    },
  },
  filters: {
    label: 'Filter by department',
    all: 'All Items',
    cropMedicine: 'Crop Medicines & Rx',
    seeds: 'Certified Seeds',
    tools: 'Tools & Sprayers',
    dairy: 'Dairy',
  },
  rx: {
    /** The prescription mark on the bundle's photo. */
    badge: 'Rx',
    /** `timeAgo` is mid-sentence: "3 hours ago", "yesterday". */
    prescribed: (timeAgo: string) => `Prescribed ${timeAgo}`,
    save: (percent: number) => `Save ${percent}%`,
    add: (price: string) => `Add Doctor's Rx Bundle to Cart • ${price}`,
    added: (price: string) => `Rx Bundle Added to Cart (${price})`,
    inCart: 'In Cart (Tap to add another)',
  },
  departments: {
    title: 'Departments',
    viewCatalog: 'View Catalog',
    catalogComingSoon: 'Full catalog coming soon',
  },
  flashDeals: {
    title: 'Depot Flash Deals',
    endsIn: (countdown: string) => `Ends in ${countdown}`,
  },
  results: {
    loading: 'Searching the depot…',
    found: (count: number) => `${items(count)} found`,
    empty: 'No items match',
    emptyHint: 'Try another name or department.',
    clearFilters: 'Clear filters',
  },
  product: {
    add: (price: string) => `Add ${price}`,
    /** What a screen reader announces for the add button. */
    addLabel: (price: string, name: string) => `Add ${price} ${name} to cart`,
    soldBy: (shop: string) => `Sold by ${shop}`,
    rating: (rating: string) => `${rating} out of 5 stars`,
  },
  cart: {
    itemCount: items,
    /** Read before the count on the cart icon. */
    countLabel: 'Items in cart:',
    freeDelivery: 'Free Delivery',
    lastAdded: (name: string) => `Added: ${name}`,
    view: 'View Cart',
    title: 'Your Cart',
    close: 'Close cart',
    total: 'Total',
    paymentMethod: 'How will you pay?',
    methods: {
      ONLINE: { title: 'Pay online', subtitle: 'UPI, card or net banking' },
      CASH_ON_DELIVERY: { title: 'Cash on delivery', subtitle: 'Pay when the depot delivers' },
    } satisfies Record<PaymentMethod, { title: string; subtitle: string }>,
    placeOrder: {
      ONLINE: (total: string) => `Pay ${total} & place order`,
      CASH_ON_DELIVERY: () => 'Place Order • Cash on Delivery',
    } satisfies Record<PaymentMethod, (total: string) => string>,
    paymentNotStarted: 'Your order is placed, but the payment could not start. Pay for it from My Orders.',
    from: (shop: string) => `From ${shop}`,
    otherShop: {
      title: 'Start a new cart?',
      confirm: 'Empty cart and add',
      cancel: 'Keep my cart',
    },
    remove: (name: string) => `Remove ${name}`,
    added: (name: string) => `Added ${name}`,
    addedToCart: 'Added to cart',
    removed: (name: string) => `Removed ${name}`,
    updateFailed: 'Could not update your cart. Please try again.',
    orderFailed: 'Could not place your order. Please try again.',
  },
  promise: {
    title: 'AgriScan Kisan Suraksha Promise',
    pillars: {
      genuine: {
        title: '100% Genuine Certified Agrochemicals',
        description: 'Directly procured from licensed manufacturer depots with traceable batch seals.',
      },
      payOnDelivery: {
        title: 'Kisan Credit Card (KCC) & Pay on Delivery',
        description: 'Inspect your seeds & sprayers before paying. Zero-interest 60-day KCC credit accepted.',
      },
      dosageCall: {
        title: 'Free Agronomist & Vet Dosage Call',
        description: 'Our farm scientist calls within 30 minutes of purchase to guide dilution & spray timing.',
      },
    },
  },
}
