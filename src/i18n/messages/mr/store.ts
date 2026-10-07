import type { Translation } from '../../translation'
import type { store as en } from '../en/store'

/** 1 -> "1 वस्तू", 4 -> "4 वस्तू" */
const items = (count: number) => `${count} वस्तू`

export const store: Translation<typeof en> = {
  loading: 'कृषी दुकान उघडत आहे…',
  depot: {
    open: 'आता सुरू',
    closed: 'बंद',
  },
  search: {
    label: 'औषधे, बियाणे आणि पशुखाद्य शोधा',
    placeholder: 'औषधे, बियाणे, पशुखाद्य शोधा…',
    scanBarcode: 'औषधाचा बारकोड किंवा बियाण्याच्या पाकिटावरील बॅच नंबर स्कॅन करा',
    scanComingSoon: 'बारकोड स्कॅन करण्याची सोय लवकरच येत आहे',
  },
  voice: {
    label: 'बोलून शोधा',
    listening: 'बोला… आम्ही ऐकत आहोत',
    heard: (transcript) => `शोध: ${transcript}`,
    cancel: 'रद्द करा',
    clear: 'साफ करा',
    unsupported: 'या ब्राउझरवर बोलून शोधण्याची सोय नाही',
    errors: {
      noSpeech: 'नीट ऐकू आले नाही. माइकवर टॅप करून पुन्हा बोला.',
      noMicrophone: 'या डिव्हाइसवर मायक्रोफोन सापडला नाही.',
      micBlocked: 'बोलून शोधण्यासाठी मायक्रोफोनची परवानगी द्या.',
      offline: 'बोलून शोधण्यासाठी इंटरनेट कनेक्शन लागते.',
      failed: 'बोलून शोधता आले नाही. कृपया टाइप करून शोधा.',
    },
  },
  filters: {
    label: 'विभागानुसार निवडा',
    all: 'सर्व वस्तू',
    cropMedicine: 'पीक औषधे व शिफारस',
    seeds: 'प्रमाणित बियाणे',
    tools: 'अवजारे व फवारणी पंप',
    dairy: 'पशुपालन',
  },
  rx: {
    badge: 'Rx',
    prescribed: (timeAgo) => `${timeAgo} सुचवले`,
    save: (percent) => `${percent}% बचत`,
    add: (price) => `डॉक्टरांनी सुचवलेले किट कार्टमध्ये घाला • ${price}`,
    added: (price) => `किट कार्टमध्ये जोडले (${price})`,
    inCart: 'कार्टमध्ये आहे (आणखी एक घालण्यासाठी टॅप करा)',
  },
  departments: {
    title: 'विभाग',
    viewCatalog: 'संपूर्ण यादी पहा',
    catalogComingSoon: 'संपूर्ण उत्पादन यादी लवकरच येत आहे',
  },
  flashDeals: {
    title: 'डेपोच्या खास ऑफर',
    endsIn: (countdown) => `संपायला ${countdown}`,
  },
  results: {
    loading: 'डेपोमध्ये शोधत आहे…',
    found: (count) => `${items(count)} ${count === 1 ? 'सापडली' : 'सापडल्या'}`,
    empty: 'काहीही सापडले नाही',
    emptyHint: 'दुसरे नाव किंवा विभाग निवडून पहा.',
    clearFilters: 'फिल्टर काढा',
  },
  product: {
    add: (price) => `जोडा ${price}`,
    addLabel: (price, name) => `${name} कार्टमध्ये जोडा, ${price}`,
    soldBy: (shop) => `विक्रेता: ${shop}`,
    rating: (rating) => `5 पैकी ${rating} स्टार`,
  },
  cart: {
    itemCount: items,
    countLabel: 'कार्टमधील वस्तू:',
    freeDelivery: 'मोफत डिलिव्हरी',
    lastAdded: (name) => `जोडले: ${name}`,
    view: 'कार्ट पहा',
    title: 'तुमचे कार्ट',
    close: 'कार्ट बंद करा',
    total: 'एकूण',
    paymentMethod: 'पैसे कसे भरणार?',
    methods: {
      ONLINE: { title: 'ऑनलाइन पेमेंट', subtitle: 'UPI, कार्ड किंवा नेट बँकिंग' },
      CASH_ON_DELIVERY: { title: 'डिलिव्हरीवेळी रोख', subtitle: 'डेपोतून माल आल्यावर पैसे द्या' },
    },
    placeOrder: {
      ONLINE: (total) => `${total} भरा व ऑर्डर द्या`,
      CASH_ON_DELIVERY: () => 'ऑर्डर द्या • माल मिळाल्यावर पैसे',
    },
    paymentNotStarted: 'तुमची ऑर्डर नोंदवली, पण पेमेंट सुरू झाले नाही. "माझ्या ऑर्डर्स" मधून पैसे भरा.',
    from: (shop) => `${shop} कडून`,
    otherShop: {
      title: 'नवीन कार्ट सुरू करायची?',
      confirm: 'कार्ट रिकामी करून जोडा',
      cancel: 'माझी कार्ट ठेवा',
    },
    remove: (name) => `${name} काढा`,
    added: (name) => `${name} कार्टमध्ये जोडले`,
    addedToCart: 'कार्टमध्ये जोडले',
    removed: (name) => `${name} काढले`,
    updateFailed: 'कार्ट अपडेट करता आले नाही. कृपया पुन्हा प्रयत्न करा.',
    orderFailed: 'ऑर्डर देता आली नाही. कृपया पुन्हा प्रयत्न करा.',
  },
  promise: {
    title: 'AgriScan किसान सुरक्षा हमी',
    pillars: {
      genuine: {
        title: '100% अस्सल, प्रमाणित कृषी रसायने',
        description: 'परवानाधारक कंपन्यांच्या डेपोमधून थेट खरेदी. बॅच सीलवरून माल अस्सल असल्याची खात्री करता येते.',
      },
      payOnDelivery: {
        title: 'किसान क्रेडिट कार्ड (KCC) व माल मिळाल्यावर पैसे',
        description: 'पैसे देण्यापूर्वी बियाणे व फवारणी पंप तपासून घ्या. 60 दिवसांचे बिनव्याजी KCC क्रेडिट चालते.',
      },
      dosageCall: {
        title: 'कृषी तज्ज्ञ व पशुवैद्यांचा मोफत डोस सल्ला',
        description:
          'खरेदीनंतर 30 मिनिटांत आमचे कृषी शास्त्रज्ञ फोन करून औषधाचे प्रमाण व फवारणीची योग्य वेळ सांगतात.',
      },
    },
  },
}
