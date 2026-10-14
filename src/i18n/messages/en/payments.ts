import type { CardBrand } from '../../../lib/payment-checks'
import type { PaymentProviderKind, PaymentPurpose, PaymentStatusCode } from '../../../lib/types'

/**
 * Paying online (/pay/:paymentId) and the outcome (/pay/:paymentId/result), for orders and bookings alike (D5); and
 * for shopkeepers and vehicle owners, confirming the Scan & Pay payments farmers send them and setting it up.
 */
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
    SCAN_AND_PAY: 'Scan & Pay',
  } satisfies Record<PaymentProviderKind, string>,
  methods: {
    title: 'How do you want to pay?',
    CARD: { title: 'Card', subtitle: 'Debit or credit card' },
    UPI: { title: 'UPI', subtitle: 'PhonePe, Google Pay, Paytm…' },
    SCAN_AND_PAY: { title: 'Scan & Pay', subtitle: 'Pay the seller directly' },
    scanUnavailable: 'Not offered by this seller',
  },
  pay: (amount: string) => `Pay ${amount}`,
  paying: 'Processing payment…',
  stripeLoading: 'Loading card and UPI options…',
  card: {
    number: 'Card number',
    numberHint: 'The 16 digits on the front of your card',
    brands: {
      VISA: 'Visa card',
      MASTERCARD: 'Mastercard',
      RUPAY: 'RuPay card',
      AMEX: 'American Express card',
    } satisfies Record<CardBrand, string>,
    numberErrors: {
      required: 'Enter your card number',
      incomplete: 'This card number is too short',
      invalid: 'This card number is not valid. Check the digits.',
    },
    expiry: 'Expiry (MM/YY)',
    expiryErrors: {
      required: 'Enter the expiry date',
      incomplete: 'Enter the expiry as MM/YY',
      month: 'The month must be 01 to 12',
      expired: 'This card has expired',
      tooFar: 'Check the year: cards do not expire that far ahead',
    },
    cvc: 'CVV',
    /** "3 digits on the back"; an Amex card has 4 on the front. */
    cvcHint: (digits: number, front: boolean) => `${digits} digits on the ${front ? 'front' : 'back'}`,
    cvcErrors: {
      required: 'Enter the CVV',
      incomplete: (digits: number) => `The CVV has ${digits} digits`,
    },
  },
  upi: {
    id: 'UPI ID',
    idHint: 'As shown in your UPI app, like name@okbank',
    idErrors: {
      required: 'Enter your UPI ID',
      invalid: 'Enter a UPI ID like name@bank',
    },
  },
  /** The test checkout lets a tester choose the outcome. */
  simulatedFail: 'Simulate a failed payment',
  razorpay: {
    open: (amount: string) => `Pay ${amount} with Razorpay`,
    failed: (reason: string) => `Payment failed: ${reason}`,
  },
  scanAndPay: {
    scan: (payee: string) => `Scan with any UPI app to pay ${payee}`,
    apps: 'PhonePe • Google Pay • Paytm • BHIM',
    qrAlt: (payee: string) => `UPI QR code of ${payee}`,
    upiId: 'UPI ID',
    copy: 'Copy',
    copied: 'UPI ID copied',
    openApp: (amount: string) => `Pay ${amount} in a UPI app`,
    steps: {
      scan: 'Scan the QR, or open your UPI app',
      pay: (amount: string) => `Pay ${amount}`,
      reference: 'Enter the 12-digit UPI reference your app shows after paying',
    },
    reference: 'UPI reference (UTR)',
    referenceHint: 'In your UPI app’s payment details, as “UPI Ref No.” or “UTR”',
    referenceErrors: {
      required: 'Enter the UPI reference',
      incomplete: 'The UPI reference has 12 digits',
    },
    submit: (amount: string) => `I have paid ${amount}`,
    submitting: 'Sending…',
    failed: 'Could not send your payment details. Please try again.',
    note: (payee: string) => `${payee} confirms once the money shows in their bank. We will notify you.`,
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
    /** A Scan & Pay payment waits for the seller rather than a bank. */
    scanAndPay: {
      title: {
        REQUIRES_PAYMENT: 'Payment not completed',
        PROCESSING: 'Waiting for the seller',
        SUCCEEDED: 'Payment confirmed',
        FAILED: 'Payment not received',
        CANCELLED: 'Payment closed',
      } satisfies Record<PaymentStatusCode, string>,
      message: {
        REQUIRES_PAYMENT: () => 'You have not finished this payment yet.',
        PROCESSING: (amount: string, payee: string) =>
          `You sent ${amount} to ${payee}. They confirm once it shows in their bank, and we will notify you.`,
        SUCCEEDED: (amount: string, payee: string) => `${payee} confirmed they received ${amount}. Thank you!`,
        FAILED: (_amount: string, payee: string) =>
          `${payee} says the payment did not reach them. If money left your account, show them the UPI reference, or pay again.`,
        CANCELLED: () => 'This payment was closed. Start a new one to pay.',
      } satisfies Record<PaymentStatusCode, (amount: string, payee: string) => string>,
    },
    reason: (reason: string) => `Reason: ${reason}`,
    amount: 'Amount',
    paidFor: 'For',
    provider: 'Via',
    upiReference: 'UPI reference',
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
  /** Shopkeepers and vehicle owners confirming Scan & Pay payments. */
  seller: {
    toConfirm: 'Payments to confirm',
    checkBank: 'Check your bank or UPI app for this amount and reference, then confirm.',
    paidBy: (name: string) => `Paid by ${name}`,
    reference: 'UPI ref',
    sent: (when: string) => `Sent ${when}`,
    call: (name: string) => `Call ${name}`,
    received: 'Received',
    notReceived: 'Not received',
    receivedDone: (amount: string) => `${amount} confirmed`,
    notReceivedDone: 'Marked as not received. The farmer can pay again.',
    failed: 'Could not save your answer. Please try again.',
    saving: 'Saving…',
    notReceivedTitle: 'Payment not received?',
    notReceivedMessage: 'The farmer is told to check their UPI app or pay again. A short reason helps them.',
    quickReasons: {
      notInAccount: 'Not in my account',
      wrongAmount: 'Wrong amount',
      wrongReference: 'Reference does not match',
    },
    notReceivedConfirm: 'Mark as not received',
  },
  /** Setting up Scan & Pay, the same for shops and vehicle owners. */
  setup: {
    title: 'Scan & Pay',
    intro: 'Farmers pay you straight to your bank by scanning your UPI QR. You confirm each payment once it arrives.',
    on: 'Scan & Pay is on',
    off: 'Scan & Pay is off',
    needsOne: 'Add your UPI ID or your QR to turn it on.',
    edit: 'Set up',
    change: 'Edit',
    upiId: 'Your UPI ID',
    upiIdHint: 'As shown in your UPI app, like name@okbank. Farmers’ apps fill in the amount.',
    upiIdInvalid: 'Enter a UPI ID like name@bank',
    qr: 'Your UPI QR (optional)',
    qrHint: 'A photo or screenshot of the QR from PhonePe, Google Pay or your bank app',
    qrAlt: 'Your UPI QR code',
    removeQr: 'Remove QR',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Scan & Pay settings saved',
    failed: 'Could not save. Please try again.',
  },
}
