/** How a farmer chooses to pay: by card or UPI through the payment provider, or straight to the seller's UPI QR. */
export type PaymentMethodChoice = 'UPI' | 'CARD' | 'SCAN_AND_PAY'

/** UPI first: most farmers pay that way. */
export const PAYMENT_METHOD_CHOICES: readonly PaymentMethodChoice[] = ['UPI', 'CARD', 'SCAN_AND_PAY']

export const PAYMENT_METHOD_ICONS: Record<PaymentMethodChoice, string> = {
  UPI: 'account_balance',
  CARD: 'credit_card',
  SCAN_AND_PAY: 'qr_code_scanner',
}
