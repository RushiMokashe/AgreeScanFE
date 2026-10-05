import type { Translation } from '../../translation'
import type { store as en } from '../en/store'

/** 1 -> "1 आइटम", 4 -> "4 आइटम" */
const items = (count: number) => `${count} आइटम`

export const store: Translation<typeof en> = {
  loading: 'कृषि दुकान खुल रही है…',
  depot: {
    open: 'अभी खुला',
    closed: 'बंद',
  },
  search: {
    label: 'दवाइयाँ, बीज और पशु आहार खोजें',
    placeholder: 'दवाइयाँ, बीज, पशु आहार खोजें…',
    scanBarcode: 'दवा का बारकोड या बीज के पैकेट का बैच नंबर स्कैन करें',
    scanComingSoon: 'बारकोड स्कैन करने की सुविधा जल्द आ रही है',
  },
  voice: {
    label: 'बोलकर खोजें',
    listening: 'बोलिए… हम सुन रहे हैं',
    heard: (transcript) => `खोज: ${transcript}`,
    cancel: 'रद्द करें',
    clear: 'साफ़ करें',
    unsupported: 'इस ब्राउज़र पर बोलकर खोजने की सुविधा नहीं है',
    errors: {
      noSpeech: 'ठीक से सुनाई नहीं दिया। माइक पर टैप करके फिर से बोलें।',
      noMicrophone: 'इस डिवाइस पर माइक्रोफ़ोन नहीं मिला।',
      micBlocked: 'बोलकर खोजने के लिए माइक्रोफ़ोन की अनुमति दें।',
      offline: 'बोलकर खोजने के लिए इंटरनेट कनेक्शन ज़रूरी है।',
      failed: 'बोलकर खोज नहीं हो सकी। कृपया टाइप करके खोजें।',
    },
  },
  filters: {
    label: 'विभाग के अनुसार छाँटें',
    all: 'सभी सामान',
    cropMedicine: 'फसल दवाएँ व सिफ़ारिश',
    seeds: 'प्रमाणित बीज',
    tools: 'औज़ार और स्प्रे पंप',
    dairy: 'पशुपालन',
  },
  rx: {
    badge: 'Rx',
    prescribed: (timeAgo) => `${timeAgo} सुझाया गया`,
    save: (percent) => `${percent}% बचत`,
    add: (price) => `डॉक्टर का सुझाया किट कार्ट में डालें • ${price}`,
    added: (price) => `किट कार्ट में जुड़ गया (${price})`,
    inCart: 'कार्ट में है (एक और डालने के लिए टैप करें)',
  },
  departments: {
    title: 'विभाग',
    viewCatalog: 'पूरी सूची देखें',
    catalogComingSoon: 'पूरी उत्पाद सूची जल्द आ रही है',
  },
  flashDeals: {
    title: 'डिपो के खास ऑफ़र',
    endsIn: (countdown) => `खत्म होने में ${countdown}`,
  },
  results: {
    loading: 'डिपो में खोजा जा रहा है…',
    found: (count) => `${items(count)} ${count === 1 ? 'मिला' : 'मिले'}`,
    empty: 'कुछ नहीं मिला',
    emptyHint: 'कोई दूसरा नाम या विभाग आज़माएँ।',
    clearFilters: 'फ़िल्टर हटाएँ',
  },
  product: {
    add: (price) => `जोड़ें ${price}`,
    addLabel: (price, name) => `${name} कार्ट में जोड़ें, ${price}`,
    rating: (rating) => `5 में से ${rating} स्टार`,
  },
  cart: {
    itemCount: items,
    countLabel: 'कार्ट में आइटम:',
    freeDelivery: 'मुफ़्त डिलीवरी',
    lastAdded: (name) => `जोड़ा गया: ${name}`,
    view: 'कार्ट देखें',
    title: 'आपका कार्ट',
    close: 'कार्ट बंद करें',
    total: 'कुल',
    placeOrder: 'ऑर्डर करें • डिलीवरी पर नकद भुगतान',
    remove: (name) => `${name} हटाएँ`,
    added: (name) => `${name} कार्ट में जोड़ा गया`,
    addedToCart: 'कार्ट में जोड़ा गया',
    removed: (name) => `${name} हटाया गया`,
    updateFailed: 'कार्ट अपडेट नहीं हो सका। कृपया फिर से कोशिश करें।',
    orderFailed: 'ऑर्डर नहीं हो सका। कृपया फिर से कोशिश करें।',
  },
  promise: {
    title: 'AgriScan किसान सुरक्षा वादा',
    pillars: {
      genuine: {
        title: '100% असली, प्रमाणित कृषि रसायन',
        description: 'लाइसेंसधारी कंपनियों के डिपो से सीधी ख़रीद। बैच सील से असली माल की पहचान की जा सकती है।',
      },
      payOnDelivery: {
        title: 'किसान क्रेडिट कार्ड (KCC) और डिलीवरी पर भुगतान',
        description: 'भुगतान से पहले बीज और स्प्रे पंप जाँच लें। 60 दिन का बिना ब्याज वाला KCC क्रेडिट मान्य है।',
      },
      dosageCall: {
        title: 'कृषि विशेषज्ञ व पशु डॉक्टर से मुफ़्त खुराक सलाह',
        description:
          'ख़रीद के 30 मिनट के अंदर हमारे कृषि वैज्ञानिक फ़ोन करके घोल बनाने और छिड़काव का सही समय बताते हैं।',
      },
    },
  },
}
