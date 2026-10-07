import type { Translation } from '../../translation'
import type { orders as en } from '../en/orders'

export const orders: Translation<typeof en> = {
  loading: 'आपके ऑर्डर आ रहे हैं…',
  empty: {
    title: 'अभी कोई ऑर्डर नहीं',
    message: 'एग्रो स्टोर से मँगाए बीज, खाद और छिड़काव की दवाएँ यहाँ दिखेंगी।',
    shop: 'एग्रो स्टोर पर जाएँ',
  },
  order: (id) => `ऑर्डर #${id}`,
  placed: (when) => `${when} किया गया`,
  items: (count) => `${count} आइटम`,
  status: {
    AWAITING_PAYMENT: 'भुगतान बाकी',
    PLACED: 'ऑर्डर हो गया',
    PAID: 'भुगतान हुआ',
    CANCELLED: 'रद्द',
  },
  method: {
    ONLINE: 'ऑनलाइन भुगतान',
    CASH_ON_DELIVERY: 'डिलीवरी पर नकद',
  },
  lineQuantity: (quantity, price) => `${quantity} × ${price}`,
  total: 'कुल',
  payHint: 'यह ऑर्डर पूरा करने के लिए ऑनलाइन भुगतान करें।',
  payNow: (amount) => `अभी ${amount} चुकाएँ`,
  paying: 'भुगतान खोल रहे हैं…',
}
