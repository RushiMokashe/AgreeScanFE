import type { Translation } from '../../translation'
import type { home as en } from '../en/home'

export const home: Translation<typeof en> = {
  welcome: {
    greeting: (name) => `राम राम, ${name} जी!!!`,
    activePlots: (count) => `${count} सक्रिय प्लॉट`,
    season: (season) => `सीज़न ${season}`,
    listenBriefing: 'आज की खेती की जानकारी सुनें',
    humidity: 'नमी',
    rainForecast: 'बारिश',
    rainOutlook: (days) => (days === null ? 'नहीं' : days === 0 ? 'आज' : `${days} दिन में`),
  },
  briefing: {
    greeting: (name, location) => `राम राम ${name} जी। यह है ${location} के लिए आज की खेती की जानकारी।`,
    weather: (temperature, condition, humidity) =>
      `अभी तापमान ${temperature} डिग्री सेल्सियस है और मौसम ${condition} है। हवा में ${humidity} प्रतिशत नमी है।`,
    rain: (days) =>
      days === null
        ? 'बारिश की कोई संभावना नहीं है।'
        : days === 0
          ? 'आज बारिश की संभावना है।'
          : `${days} दिन में बारिश की संभावना है।`,
    alert: (title, message) => `चेतावनी: ${title}। ${message}`,
    noAlerts: 'आज आपके इलाके में फसलों के लिए कोई चेतावनी नहीं है।',
  },
  intro: {
    title: 'AgriScan क्या है?',
    tagline: 'फसलों के लिए 24/7 AI डॉक्टर और खेती की हर ज़रूरत के लिए एक ही दुकान',
    listen: 'सुनें (30 सेकंड)',
    listenLabel: '30 सेकंड की जानकारी सुनें',
    script:
      'AgriScan आपकी फसलों का दिन-रात उपलब्ध AI डॉक्टर है, और खेती की हर ज़रूरत के लिए एक ही दुकान भी। ' +
      'दिन की रोशनी में बीमार पत्ती, कीट या मुरझाते पौधे की साफ़ फ़ोटो लें। ' +
      'कुछ ही सेकंड में AgriScan बताता है कि कौन-सा रोग है, वह कितना गंभीर है, ' +
      'और छिड़काव की सही मात्रा के साथ रासायनिक या जैविक इलाज क्या है। ' +
      'फिर असली दवा घर तक मँगाएँ, या पास का भरोसेमंद कृषि विक्रेता खोजें। ' +
      'आप कृषि वैज्ञानिक को मुफ़्त कॉल भी कर सकते हैं।',
    howTo: 'AgriScan कैसे इस्तेमाल करें (3 आसान कदम)',
    steps: {
      photo: {
        title: 'पत्ती की फ़ोटो लें',
        description: 'दिन की रोशनी में बीमार पत्तियों, कीटों या मुरझाई फसल की साफ़ फ़ोटो लें।',
      },
      diagnosis: {
        title: 'तुरंत AI जाँच',
        description: '3 सेकंड में सही रोग, उसकी गंभीरता और रासायनिक या जैविक इलाज जानें।',
      },
      medicine: {
        title: 'दवा लें, फसल बचाएँ',
        description: 'असली दवाएँ घर तक मँगाएँ या पास के भरोसेमंद कृषि विक्रेता खोजें।',
      },
    },
    scanCta: 'टैप करके फसल की फ़ोटो लें',
    scanGuide: 'सही तरीके से स्कैन कैसे करें? सुनें (30 सेकंड)',
    scanGuideScript: (captureButton, bugMode) =>
      'सही तरीके से स्कैन कैसे करें। दिन की रोशनी में स्कैन करें और अपनी परछाईं पत्ती पर न पड़ने दें। ' +
      'फ़ोन को पत्ती से 15 से 20 सेंटीमीटर दूर रखें। ' +
      'रोग वाली एक ही पत्ती को हरे फ्रेम में इस तरह रखें कि उसके धब्बे साफ़ दिखें। ' +
      `फ़ोकस लॉक होने तक फ़ोन स्थिर रखें, फिर ${captureButton} पर टैप करें। ` +
      `कीट की जाँच के लिए पहले ${bugMode} चालू करें। ` +
      'बेहतर नतीजे के लिए स्कैन से पहले पत्ती पर जमी धूल या पानी की बूँदें धीरे से पोंछ लें।',
    servicesTitle: 'यहाँ आप क्या-क्या कर सकते हैं?',
    allServices: 'सभी सेवाएँ',
    services: {
      cropDoctor: { title: 'AI फसल डॉक्टर', description: 'रोग स्कैन करें और पंप के लिए छिड़काव की मात्रा जानें' },
      store: { title: 'किसान कृषि दुकान', description: 'बीज, स्प्रेयर और पशु आहार' },
      scientist: { title: 'कृषि वैज्ञानिक', description: 'ICAR कृषि विशेषज्ञों और पशु डॉक्टरों से मुफ़्त बात' },
      dealers: { title: 'कृषि विक्रेता', description: '5 किमी के भीतर दवा और छिड़काव का सामान खोजें' },
    },
  },
  plots: {
    title: 'मेरे प्लॉट',
    comingSoon: 'प्लॉट प्रबंधन जल्द शुरू होगा',
    empty: 'अभी तक कोई प्लॉट नहीं जोड़ा गया है।',
    health: {
      ACTION_NEEDED: 'ध्यान दें',
      MODERATE_RISK: 'मध्यम खतरा',
      HEALTHY: 'स्वस्थ',
    },
    photoAlt: (crop, field) => `${field} में ${crop} की फसल`,
    area: (acres) => `${acres} एकड़`,
    reviewTreatment: (crop) => `${crop} प्लॉट का इलाज देखें`,
    viewSolution: 'उपाय देखें',
  },
  scans: {
    title: 'हाल के स्कैन और दवाएँ',
    history: 'इतिहास',
    empty: (scanTab) => `अभी तक कोई स्कैन नहीं है। पहली पत्ती जाँचने के लिए ${scanTab} पर टैप करें।`,
    confidence: (percent) => `${percent}% भरोसा`,
    prescription: (prescription) => `दवा: ${prescription}`,
    stockists: (count) =>
      count === 0
        ? 'पास की दुकानों पर अभी उपलब्ध नहीं'
        : `पास की ${count} ${count === 1 ? 'दुकान' : 'दुकानों'} पर उपलब्ध`,
    viewPrescription: 'दवा देखें',
  },
  helpline: {
    title: 'सरकारी सहायता',
    dialLabel: (helpline) => `${helpline} को सीधे कॉल करें`,
    dial: 'विशेषज्ञ को सीधे कॉल करें',
  },
}
