import type { Translation } from '../../translation'
import type { mandi as en } from '../en/mandi'

export const mandi: Translation<typeof en> = {
  loading: 'मंडी भाव लोड हो रहे हैं…',
  units: {
    quintals: (amount) => `${amount} क्विंटल`,
    perQuintal: (price) => `${price} / क्विंटल`,
    tonnes: (tonnes) => `${tonnes} मीट्रिक टन`,
  },
  market: {
    photoAlt: (market) => `${market} का मंडी परिसर`,
    select: (market) => `मंडी चुनें: ${market}`,
    moreSoon: 'और मंडियाँ जल्द आ रही हैं',
    arrivals: 'आज की आवक',
    forecast: 'AgriScan AI अनुमान',
  },
  rates: {
    title: 'फसलों के मंडी भाव',
    updated: (ago) => `${ago} अपडेट हुआ`,
    perUnit: (unit) => `प्रति ${unit}`,
    demand: {
      HIGH_DEMAND: 'ज़्यादा माँग',
      HOT: 'तेज़ी',
      STABLE: 'स्थिर',
      STEADY: 'भाव टिके',
    },
  },
  inquiries: {
    title: 'खरीदारों की माँग और ऑर्डर',
    subtitle: 'बिना दलाली के, कंपनियों और संस्थाओं से सीधी खरीद',
    active: (count) => `${count} चालू`,
    verifiedBuyer: 'जाँचा-परखा खरीदार',
    volume: 'ज़रूरी मात्रा',
    submitting: 'भेजा जा रहा है…',
    registered: 'लॉट दर्ज हो गया!',
    registeredWith: (buyer) => `${buyer} के पास आपका लॉट दर्ज हो गया`,
    registerFailed: 'आपका लॉट दर्ज नहीं हो सका। कृपया फिर से कोशिश करें।',
  },
  grading: {
    title: 'मंडी के लिए ग्रेडिंग और छँटाई गाइड',
    subtitle: 'APMC नीलामी में 25-35% ज़्यादा दाम कैसे पाएँ',
    tips: {
      sortDamaged: {
        title: 'झुलसी या दाग वाली उपज अलग करें',
        body: 'ऊपरी परत में 5% भी खराब फल दिखे, तो व्यापारी **पूरे लॉट की कीमत में 30% तक** कटौती कर देते हैं। खेत पर ही अपनी उपज को A, B और C ग्रेड के क्रेट में छाँटें।',
      },
      packEarly: {
        title: 'रास्ते में वज़न न घटे, इसलिए सुबह 5:30 बजे पैक करें',
        body: 'दोपहर की तेज़ धूप में तुड़ाई करने से उपज की नमी ज़्यादा उड़ती है और मंडी तक ढुलाई में **प्रति क्विंटल 2.5 किलो तक वज़न** घट जाता है।',
      },
    },
    scanTitle: 'स्कैन करके उपज का ग्रेड जानें',
    scanHint: 'AgriScan AI कैमरा फल का आकार और रंग (%) अपने-आप जाँचता है',
    openCamera: 'कैमरा खोलें',
  },
  transport: {
    badge: 'जाँची-परखी मंडी ढुलाई',
    title: (market) => `${market} तक उपज भेजनी है?`,
    body: 'APMC की तय ढुलाई दरों पर भरोसेमंद स्थानीय Bolero पिकअप, 407 टेम्पो या ट्रैक्टर ट्रॉली बुक करें। ड्राइवर की लाइव लोकेशन देखें और माल का बीमा पाएँ।',
    book: 'अभी गाड़ी बुक करें',
    callDispatcher: 'मंडी ढुलाई डेस्क को कॉल करें',
  },
  helpline: (market) => `${market} हेल्पलाइन:`,
}
