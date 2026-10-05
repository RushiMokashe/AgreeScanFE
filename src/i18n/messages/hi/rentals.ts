import type { Translation } from '../../translation'
import type { rentals as en } from '../en/rentals'

export const rentals: Translation<typeof en> = {
  loading: 'आस-पास की किराया सेवाएँ खोजी जा रही हैं…',
  location: {
    radius: (km) => `${km} किमी दायरा`,
    change: 'बदलें',
    changeLabel: 'जगह बदलें',
    changeComingSoon: 'जगह बदलने की सुविधा जल्द आ रही है',
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
    booked: 'बुक हो गया',
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
