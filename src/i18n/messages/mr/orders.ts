import type { Translation } from '../../translation'
import type { orders as en } from '../en/orders'

export const orders: Translation<typeof en> = {
  loading: 'तुमच्या ऑर्डर्स येत आहेत…',
  empty: {
    title: 'अजून ऑर्डर नाही',
    message: 'ॲग्रो स्टोअरमधून मागवलेली बियाणे, खते आणि फवारणी औषधे इथे दिसतील.',
    shop: 'ॲग्रो स्टोअरमध्ये जा',
  },
  order: (id) => `ऑर्डर #${id}`,
  placed: (when) => `${when} दिली`,
  items: (count) => `${count} वस्तू`,
  status: {
    AWAITING_PAYMENT: 'पेमेंट बाकी',
    PLACED: 'ऑर्डर नोंदवली',
    PAID: 'पैसे भरले',
    CANCELLED: 'रद्द',
  },
  method: {
    ONLINE: 'ऑनलाइन पेमेंट',
    CASH_ON_DELIVERY: 'डिलिव्हरीवेळी रोख',
  },
  lineQuantity: (quantity, price) => `${quantity} × ${price}`,
  total: 'एकूण',
  payHint: 'ही ऑर्डर पूर्ण करण्यासाठी ऑनलाइन पैसे भरा.',
  payNow: (amount) => `आता ${amount} भरा`,
  paying: 'पेमेंट उघडत आहोत…',
}
