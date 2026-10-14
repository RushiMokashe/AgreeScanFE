import type { OrderStatus, PaymentMethod } from '../../../lib/types'

/** The farmer's Agro Store orders (/orders), newest first. */
export const orders = {
  loading: 'Loading your orders…',
  empty: {
    title: 'No orders yet',
    message: 'Seeds, fertilizer and sprays you order from the Agro Store show up here.',
    shop: 'Go to Agro Store',
  },
  order: (id: number) => `Order #${id}`,
  /** "Placed 3 hours ago". */
  placed: (when: string) => `Placed ${when}`,
  items: (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`,
  status: {
    AWAITING_PAYMENT: 'Awaiting payment',
    VERIFYING_PAYMENT: 'Payment to verify',
    PLACED: 'Placed',
    PAID: 'Paid',
    CANCELLED: 'Cancelled',
  } satisfies Record<OrderStatus, string>,
  method: {
    ONLINE: 'Online payment',
    CASH_ON_DELIVERY: 'Cash on delivery',
  } satisfies Record<PaymentMethod, string>,
  /** "2 × ₹365". */
  lineQuantity: (quantity: number, price: string) => `${quantity} × ${price}`,
  total: 'Total',
  payHint: 'Pay online to complete this order.',
  from: (shop: string) => `From ${shop}`,
  verifyingHint: (shop: string) => `Waiting for ${shop} to confirm your Scan & Pay payment.`,
  payNow: (amount: string) => `Pay ${amount} now`,
  paying: 'Opening payment…',
}
