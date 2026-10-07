import type { Translation } from '../../translation'
import type { bookings as en } from '../en/bookings'

export const bookings: Translation<typeof en> = {
  loading: 'तुमची बुकिंग्स आणत आहोत…',
  empty: {
    title: 'अजून कोणतेही बुकिंग नाही',
    message: 'ट्रॅक्टर किंवा मंडी टेम्पो बुक करा आणि प्रत्येक टप्पा इथे पहा.',
    browse: 'वाहन शोधा',
  },
  status: {
    REQUESTED: 'विनंती पाठवली',
    ACCEPTED: 'स्वीकारले',
    DECLINED: 'नाकारले',
    IN_PROGRESS: 'येत आहेत',
    COMPLETED: 'पूर्ण',
    CANCELLED: 'रद्द',
  },
  payment: {
    UNPAID: 'पेमेंट बाकी',
    PAID: 'ऑनलाइन भरले',
  },
  units: {
    HOUR: (count) => `${count} तास`,
    KM: (count) => `${count} किमी`,
    DAY: (count) => `${count} दिवस`,
  },
  booked: (ago) => `${ago} बुक केले`,
  timeline: {
    title: 'बुकिंगचे टप्पे',
    you: 'तुम्ही',
    actor: {
      FARMER: 'शेतकरी',
      OWNER: 'मालक',
      SYSTEM: 'AgriScan',
    },
    event: {
      REQUESTED: 'बुकिंगची विनंती',
      ACCEPTED: 'स्वीकारले',
      DECLINED: 'नाकारले',
      IN_PROGRESS: 'काम सुरू – येत आहेत',
      COMPLETED: 'काम पूर्ण',
      CANCELLED: 'बुकिंग रद्द',
    },
  },
  reason: {
    label: 'कारण (ऐच्छिक)',
    keep: 'मागे जा',
  },
  detail: {
    loading: 'बुकिंग आणत आहोत…',
    headline: {
      REQUESTED: (owner) => `${owner} यांच्या पुष्टीची वाट पाहत आहोत`,
      ACCEPTED: (owner) => `${owner} यांनी बुकिंग निश्चित केले`,
      DECLINED: (owner) => `${owner} हे काम घेऊ शकले नाहीत`,
      IN_PROGRESS: (owner) => `${owner} येत आहेत`,
      COMPLETED: (owner) => `${owner} यांनी काम पूर्ण केले`,
      CANCELLED: () => 'तुम्ही हे बुकिंग रद्द केले',
    },
    slot: 'केव्हा',
    estimate: 'अंदाज',
    amount: 'रक्कम',
    hub: 'भाडे केंद्र',
    payment: 'पेमेंट',
    callOwner: (owner) => `${owner} यांना कॉल करा`,
    pay: (amount) => `${amount} ऑनलाइन भरा`,
    paying: 'पेमेंट उघडत आहोत…',
    payLater: 'रोख द्यायचे आहेत? काम झाल्यावर थेट मालकालाही पैसे देऊ शकता.',
    cancel: 'बुकिंग रद्द करा',
    cancelTitle: 'हे बुकिंग रद्द करायचे?',
    cancelMessage: 'आम्ही मालकाला कळवू. थोडक्यात कारण दिल्यास त्यांना नियोजन करता येईल.',
    cancelConfirm: 'होय, बुकिंग रद्द करा',
    cancelling: 'रद्द करत आहोत…',
    cancelled: 'बुकिंग रद्द झाले',
    quickReasons: {
      plansChanged: 'माझे नियोजन बदलले',
      otherVehicle: 'दुसरे वाहन मिळाले',
      weather: 'हवामान योग्य नाही',
    },
    allBookings: 'माझी सर्व बुकिंग्स',
  },
}
