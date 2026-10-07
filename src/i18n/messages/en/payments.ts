import type {
  PaymentProviderKind,
  PaymentPurpose,
  PaymentStatusCode,
  SimulatedMethod,
} from '../../../lib/types'

/** Paying online (/pay/:paymentId) and the outcome (/pay/:paymentId/result), for orders and bookings alike (D5). */
export const payments = {
  loading: 'Opening secure payment…',
  startFailed: 'Could not start the payment. Please try again.',
  confirmFailed: 'Could not confirm the payment. Please try again.',
  scriptFailed: 'Could not load the payment window. Check your internet connection and try again.',
  summary: {
    paying: 'You are paying',
    /** "Secured by Razorpay". */
    secure: (provider: string) => `Secured by ${provider}`,
    testMode: 'Test mode – no real money moves. Any valid-looking card or UPI ID works.',
  },
  providers: {
    STRIPE: 'Stripe',
    RAZORPAY: 'Razorpay',
    SIMULATED: 'AgriScan test checkout',
  } satisfies Record<PaymentProviderKind, string>,
  pay: (amount: string) => `Pay ${amount}`,
  paying: 'Processing payment…',
  stripeLoading: 'Loading card and UPI options…',
  simulated: {
    methodLabel: 'Pay with',
    methods: {
      CARD: 'Card',
      UPI: 'UPI',
    } satisfies Record<SimulatedMethod, string>,
    cardNumber: 'Card number',
    cardNumberInvalid: 'Enter a valid card number.',
    expiry: 'Expiry (MM/YY)',
    expiryInvalid: 'Card expired, or not MM/YY.',
    cvc: 'CVV',
    cvcInvalid: 'Enter the 3 or 4 digit CVV.',
    upiId: 'UPI ID',
    upiIdHint: 'As shown in your UPI app, like name@okbank',
    upiIdInvalid: 'Enter a UPI ID like name@bank.',
    fail: 'Simulate a failed payment',
  },
  razorpay: {
    open: (amount: string) => `Pay ${amount} with Razorpay`,
    failed: (reason: string) => `Payment failed: ${reason}`,
  },
  result: {
    checking: 'Checking your payment…',
    title: {
      REQUIRES_PAYMENT: 'Payment not completed',
      PROCESSING: 'Payment is processing',
      SUCCEEDED: 'Payment successful',
      FAILED: 'Payment failed',
      CANCELLED: 'Payment closed',
    } satisfies Record<PaymentStatusCode, string>,
    message: {
      REQUIRES_PAYMENT: () => 'You have not finished this payment yet.',
      PROCESSING: () => 'Your bank is still confirming the payment. We will notify you as soon as it completes.',
      SUCCEEDED: (amount: string) => `We received ${amount}. Thank you!`,
      FAILED: () => 'No money was taken. You can try again, with another method if you like.',
      CANCELLED: () => 'This payment was closed before it was paid. Start a new one to pay.',
    } satisfies Record<PaymentStatusCode, (amount: string) => string>,
    reason: (reason: string) => `Reason: ${reason}`,
    amount: 'Amount',
    paidFor: 'For',
    provider: 'Via',
    reference: 'Payment ID',
    updated: 'Updated',
    stillChecking: 'Checking again every few seconds…',
    refresh: 'Check again',
    tryAgain: 'Try again',
    continue: 'Continue to payment',
    viewItem: {
      STORE_ORDER: 'View my orders',
      RENTAL_BOOKING: 'View booking',
    } satisfies Record<PaymentPurpose, string>,
    home: 'Back to home',
  },
}
