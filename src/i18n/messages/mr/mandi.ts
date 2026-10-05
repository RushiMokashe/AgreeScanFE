import type { Translation } from '../../translation'
import type { mandi as en } from '../en/mandi'

export const mandi: Translation<typeof en> = {
  loading: 'बाजारभाव लोड होत आहेत…',
  units: {
    quintals: (amount) => `${amount} क्विंटल`,
    perQuintal: (price) => `${price} / क्विंटल`,
    tonnes: (tonnes) => `${tonnes} मेट्रिक टन`,
  },
  market: {
    photoAlt: (market) => `${market} चे बाजार आवार`,
    select: (market) => `मंडी निवडा: ${market}`,
    moreSoon: 'आणखी मंड्या लवकरच येत आहेत',
    arrivals: 'आजची आवक',
    forecast: 'AgriScan AI अंदाज',
  },
  rates: {
    title: 'शेतमाल बाजारभाव',
    updated: (ago) => `${ago} अपडेट केले`,
    perUnit: (unit) => `प्रति ${unit}`,
    demand: {
      HIGH_DEMAND: 'जास्त मागणी',
      HOT: 'तेजी',
      STABLE: 'स्थिर',
      STEADY: 'दर टिकून',
    },
  },
  inquiries: {
    title: 'खरेदीदारांच्या मागण्या व ऑर्डर',
    subtitle: 'दलालीशिवाय कंपन्या व संस्थांकडून थेट खरेदी',
    active: (count) => `${count} चालू`,
    verifiedBuyer: 'पडताळलेले खरेदीदार',
    volume: 'लागणारा माल',
    submitting: 'पाठवत आहे…',
    registered: 'लॉट नोंदवला!',
    registeredWith: (buyer) => `${buyer} कडे तुमचा लॉट नोंदवला`,
    registerFailed: 'तुमचा लॉट नोंदवता आला नाही. कृपया पुन्हा प्रयत्न करा.',
  },
  grading: {
    title: 'मंडीसाठी प्रतवारी मार्गदर्शक',
    subtitle: 'APMC लिलावात 25-35% जास्त दर कसा मिळवावा',
    tips: {
      sortDamaged: {
        title: 'करपा / डाग असलेला माल वेगळा करा',
        body: 'वरच्या थरात 5% जरी खराब फळे दिसली, तरी व्यापारी **संपूर्ण लॉटच्या किमतीत 30% पर्यंत** कपात करतात. शेतातच मालाची A, B आणि C ग्रेडच्या क्रेटमध्ये प्रतवारी करा.',
      },
      packEarly: {
        title: 'वाहतुकीत वजन घटू नये म्हणून पहाटे 5:30 ला पॅकिंग करा',
        body: 'भर दुपारच्या उन्हात तोडणी केल्यास मालातील ओलावा जास्त उडतो आणि मंडीपर्यंतच्या वाहतुकीत **प्रति क्विंटल 2.5 किलोपर्यंत वजन** घटते.',
      },
    },
    scanTitle: 'स्कॅन करून मालाची ग्रेड जाणून घ्या',
    scanHint: 'AgriScan AI कॅमेरा फळाचा आकार आणि रंग (%) आपोआप तपासतो',
    openCamera: 'कॅमेरा उघडा',
  },
  transport: {
    badge: 'पडताळलेली मंडी वाहतूक',
    title: (market) => `${market} ला माल पाठवायचा आहे?`,
    body: 'APMC च्या ठरलेल्या भाड्यात खात्रीशीर स्थानिक Bolero पिकअप, 407 टेम्पो किंवा ट्रॅक्टर ट्रॉली बुक करा. चालकाचे थेट लोकेशन पाहा आणि मालाला विमा संरक्षण मिळवा.',
    book: 'आत्ताच गाडी बुक करा',
    callDispatcher: 'मंडी वाहतूक कक्षाला कॉल करा',
  },
  helpline: (market) => `${market} हेल्पलाइन:`,
}
