import type { Translation } from '../../translation'
import type { rentals as en } from '../en/rentals'

export const rentals: Translation<typeof en> = {
  loading: 'आस-पास की किराया सेवाएँ खोजी जा रही हैं…',
  location: {
    radius: (km) => `${km} किमी दायरा`,
    change: 'बदलें',
    changeLabel: 'किराया केंद्र बदलें',
    hubsTitle: 'अपना किराया केंद्र चुनें',
    hubsLoading: 'केंद्र ला रहे हैं…',
    changed: (hub) => `${hub} के पास की किराया सेवाएँ दिखा रहे हैं`,
    changeFailed: 'केंद्र नहीं बदला जा सका। कृपया फिर से कोशिश करें।',
  },
  tabs: {
    label: 'किराये का प्रकार',
    machinery: 'ट्रैक्टर व उपकरण',
    transport: 'मंडी टेम्पो',
  },
  rateUnits: {
    HOUR: '/घंटा',
    KM: '/किमी',
    DAY: '/दिन',
  },
  distanceAway: (km) => `${km} किमी दूर`,
  spotlight: {
    fareStarts: 'शुरुआती किराया',
    dispatch: (minutes) => `**${minutes} मिनट में** खेत पर हाज़िर`,
    book: 'टेम्पो बुक करें',
  },
  booking: {
    title: 'यह वाहन बुक करें',
    slot: 'आपको कब चाहिए?',
    slotHint: 'जैसे "कल सुबह 6:00"',
    asap: (minutes) => `जल्द से जल्द (${minutes} मिनट में रवाना)`,
    units: {
      HOUR: 'काम के अनुमानित घंटे',
      KM: 'अनुमानित दूरी (किमी)',
      DAY: 'दिनों की संख्या',
    },
    unitsHint: (max) => `1 से ${max} के बीच। मालिक असल में हुए काम का ही पैसा लेते हैं।`,
    unitsInvalid: (max) => `1 से ${max} के बीच पूरी संख्या लिखें`,
    decrease: 'कम',
    increase: 'ज़्यादा',
    estimate: 'अनुमानित राशि',
    baseFare: (fare) => `+ ${fare} बेस किराया`,
    payLater: 'मालिक के स्वीकार करने पर ऑनलाइन भुगतान करें, या काम के बाद सीधे मालिक को दें।',
    submit: 'बुकिंग अनुरोध भेजें',
    submitting: 'अनुरोध भेज रहे हैं…',
    failed: 'बुकिंग नहीं हो सकी। कृपया फिर से कोशिश करें।',
  },
  machinery: {
    title: 'आस-पास उपलब्ध कृषि यंत्र',
    online: (count) => `${count} ऑनलाइन`,
  },
  transport: {
    title: 'मंडी के लिए टेम्पो और ट्रक',
    gatePass: 'गेट पर प्राथमिकता पास',
  },
  favorite: {
    save: (name) => `${name} पसंदीदा में सहेजें`,
    saved: 'आपकी पसंदीदा सूची में सहेजा गया',
    removed: 'आपकी पसंदीदा सूची से हटाया गया',
    failed: 'आपकी पसंदीदा किराया सेवाएँ अपडेट नहीं हो सकीं। कृपया फिर से कोशिश करें।',
  },
  protection: {
    title: 'किसान गारंटी और मंडी भरोसा',
    guarantees: {
      backupVehicle: {
        title: 'गाड़ी खराब होने पर भी देरी नहीं — गारंटी',
        description:
          'किराये का ट्रैक्टर या टेम्पो बीच में बंद हो जाए, तो 45 मिनट के अंदर पास की दूसरी गाड़ी भेजी जाती है।',
      },
      freeWaiting: {
        title: 'मंडी गेट पर पहले 2 घंटे का इंतज़ार मुफ़्त',
        description: 'APMC में नीलामी या धर्मकांटे पर अपनी बारी का इंतज़ार करते समय कोई अतिरिक्त शुल्क नहीं लगता।',
      },
      payAfterSale: {
        title: 'फसल बिकने के बाद भुगतान की सुविधा',
        description: 'आढ़तिया / कमीशन एजेंट से मंडी बिक्री की पर्ची मिलने के बाद ही ढुलाई का किराया चुकाएँ।',
      },
    },
  },
  mandiDesk: {
    name: '24x7 किसान मंडी डेस्क',
    title: 'तुरंत मंडी ढुलाई चाहिए?',
    tollFree: 'टोल-फ्री कॉल करें:',
    call: 'कॉल करें',
    callLabel: '24x7 किसान मंडी डेस्क पर कॉल करें',
  },
}
