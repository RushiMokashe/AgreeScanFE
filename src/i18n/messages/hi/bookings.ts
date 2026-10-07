import type { Translation } from '../../translation'
import type { bookings as en } from '../en/bookings'

export const bookings: Translation<typeof en> = {
  loading: 'आपकी बुकिंग ला रहे हैं…',
  empty: {
    title: 'अभी कोई बुकिंग नहीं',
    message: 'ट्रैक्टर या मंडी टेम्पो बुक करें और हर कदम यहाँ देखें।',
    browse: 'वाहन खोजें',
  },
  status: {
    REQUESTED: 'अनुरोध भेजा',
    ACCEPTED: 'स्वीकार हुई',
    DECLINED: 'अस्वीकार',
    IN_PROGRESS: 'रास्ते में',
    COMPLETED: 'पूरी हुई',
    CANCELLED: 'रद्द',
  },
  payment: {
    UNPAID: 'भुगतान बाकी',
    VERIFYING: 'भुगतान की पुष्टि बाकी',
    PAID: 'ऑनलाइन भुगतान हुआ',
  },
  units: {
    HOUR: (count) => `${count} ${count === 1 ? 'घंटा' : 'घंटे'}`,
    KM: (count) => `${count} किमी`,
    DAY: (count) => `${count} दिन`,
  },
  booked: (ago) => `${ago} बुक किया`,
  timeline: {
    title: 'बुकिंग के चरण',
    you: 'आप',
    actor: {
      FARMER: 'किसान',
      OWNER: 'मालिक',
      SYSTEM: 'AgriScan',
    },
    event: {
      REQUESTED: 'बुकिंग का अनुरोध',
      ACCEPTED: 'स्वीकार हुई',
      DECLINED: 'अस्वीकार हुई',
      IN_PROGRESS: 'काम शुरू – रास्ते में',
      COMPLETED: 'काम पूरा',
      CANCELLED: 'बुकिंग रद्द',
    },
  },
  reason: {
    label: 'कारण (वैकल्पिक)',
    keep: 'वापस जाएँ',
  },
  detail: {
    loading: 'बुकिंग ला रहे हैं…',
    headline: {
      REQUESTED: (owner) => `${owner} की पुष्टि का इंतज़ार`,
      ACCEPTED: (owner) => `${owner} ने बुकिंग पक्की की`,
      DECLINED: (owner) => `${owner} यह काम नहीं ले सके`,
      IN_PROGRESS: (owner) => `${owner} रास्ते में हैं`,
      COMPLETED: (owner) => `${owner} ने काम पूरा किया`,
      CANCELLED: () => 'आपने यह बुकिंग रद्द की',
    },
    slot: 'कब',
    estimate: 'अनुमान',
    amount: 'राशि',
    hub: 'किराया केंद्र',
    payment: 'भुगतान',
    callOwner: (owner) => `${owner} को कॉल करें`,
    pay: (amount) => `${amount} ऑनलाइन चुकाएँ`,
    paying: 'भुगतान खोल रहे हैं…',
    payLater: 'नकद देना है? काम के बाद सीधे मालिक को भी भुगतान कर सकते हैं।',
    verifyingHint: (owner) => `${owner} आपके स्कैन करके किए गए भुगतान की पुष्टि करेंगे, उसका इंतज़ार है।`,
    cancel: 'बुकिंग रद्द करें',
    cancelTitle: 'यह बुकिंग रद्द करें?',
    cancelMessage: 'हम मालिक को बताएँगे। छोटा-सा कारण देने से उन्हें योजना बनाने में मदद मिलेगी।',
    cancelConfirm: 'हाँ, बुकिंग रद्द करें',
    cancelling: 'रद्द कर रहे हैं…',
    cancelled: 'बुकिंग रद्द हुई',
    quickReasons: {
      plansChanged: 'मेरी योजना बदल गई',
      otherVehicle: 'दूसरा वाहन मिल गया',
      weather: 'मौसम ठीक नहीं है',
    },
    allBookings: 'मेरी सभी बुकिंग',
  },
}
