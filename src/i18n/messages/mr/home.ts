import type { Translation } from '../../translation'
import type { home as en } from '../en/home'

export const home: Translation<typeof en> = {
  welcome: {
    greeting: (name) => `राम राम, ${name} जी!!!`,
    activePlots: (count) => `${count} सक्रिय प्लॉट`,
    season: (season) => `हंगाम ${season}`,
    listenBriefing: 'आजची शेती माहिती ऐका',
    humidity: 'आर्द्रता',
    rainForecast: 'पाऊस',
    // One short word per line: the tile's text column is 44px wide on a 360px phone ("दिवसांत" needs 56px).
    rainOutlook: (days) => (days === null ? 'नाही' : days === 0 ? 'आज' : `${days} दिवस`),
  },
  briefing: {
    greeting: (name, location) => `राम राम ${name} जी. ही आहे ${location} साठी आजची शेती माहिती.`,
    weather: (temperature, condition, humidity) =>
      `आज तापमान ${temperature} अंश सेल्सिअस असून हवामान ${condition} आहे. हवेत ${humidity} टक्के आर्द्रता आहे.`,
    rain: (days) =>
      days === null
        ? 'पावसाची शक्यता नाही.'
        : days === 0
          ? 'आज पावसाची शक्यता आहे.'
          : `${days} ${days === 1 ? 'दिवसात' : 'दिवसांत'} पावसाची शक्यता आहे.`,
    alert: (title, message) => `इशारा: ${title}. ${message}`,
    noAlerts: 'आज तुमच्या भागात पिकांसाठी कोणताही इशारा नाही.',
  },
  intro: {
    title: 'AgriScan काय आहे?',
    tagline: 'पिकांसाठी 24/7 AI डॉक्टर आणि शेतीच्या सर्व गरजांसाठी एकच दुकान',
    listen: 'ऐका (30 सेकंद)',
    listenLabel: '30 सेकंदांची माहिती ऐका',
    script:
      'AgriScan हा तुमच्या पिकांसाठी दिवस-रात्र उपलब्ध असणारा AI डॉक्टर आहे, आणि शेतीच्या सर्व गरजांसाठी एकच दुकानही. ' +
      'दिवसाच्या उजेडात आजारी पान, कीड किंवा कोमेजलेल्या रोपाचा स्पष्ट फोटो घ्या. ' +
      'काही सेकंदांतच AgriScan तुम्हाला सांगते की रोग कोणता आहे, तो किती गंभीर आहे, ' +
      'आणि फवारणीच्या योग्य प्रमाणासह रासायनिक किंवा सेंद्रिय उपाय कोणता आहे. ' +
      'त्यानंतर खात्रीशीर औषध घरपोच मागवा, किंवा जवळचा विश्वासू कृषी विक्रेता शोधा. ' +
      'तुम्ही कृषी शास्त्रज्ञांना मोफत कॉलही करू शकता.',
    howTo: 'AgriScan कसे वापरावे (3 सोप्या पायऱ्या)',
    steps: {
      photo: {
        title: 'पानाचा फोटो घ्या',
        description: 'दिवसाच्या उजेडात आजारी पाने, कीड किंवा कोमेजलेल्या पिकाचा स्पष्ट फोटो घ्या.',
      },
      diagnosis: {
        title: 'लगेच AI निदान',
        description: '3 सेकंदांत नेमका रोग, त्याची तीव्रता आणि रासायनिक किंवा सेंद्रिय उपाय जाणून घ्या.',
      },
      medicine: {
        title: 'औषध मिळवा, पीक वाचवा',
        description: 'खात्रीशीर औषधे घरपोच मागवा किंवा जवळचे विश्वासू कृषी विक्रेते शोधा.',
      },
    },
    scanCta: 'टॅप करून पिकाचा फोटो घ्या',
    scanGuide: 'योग्य प्रकारे स्कॅन कसे करावे? ऐका (30 सेकंद)',
    scanGuideScript: (captureButton, bugMode) =>
      'योग्य प्रकारे स्कॅन कसे करावे. दिवसाच्या उजेडात स्कॅन करा आणि तुमची सावली पानावर पडू देऊ नका. ' +
      'फोन पानापासून 15 ते 20 सेंटिमीटर दूर धरा. ' +
      'रोग झालेले एकच पान हिरव्या चौकटीत असे घ्या की त्यावरचे ठिपके स्पष्ट दिसतील. ' +
      `फोकस लॉक होईपर्यंत फोन स्थिर धरा, मग ${captureButton} वर टॅप करा. ` +
      `कीड तपासायची असेल तर आधी ${bugMode} सुरू करा. ` +
      'चांगल्या निकालासाठी स्कॅन करण्याआधी पानावरची धूळ किंवा पाण्याचे थेंब हलकेच पुसून घ्या.',
    servicesTitle: 'इथे काय काय करता येईल?',
    allServices: 'सर्व सेवा',
    services: {
      cropDoctor: { title: 'AI पीक डॉक्टर', description: 'रोग स्कॅन करा आणि पंपासाठी फवारणीचे प्रमाण काढा' },
      store: { title: 'किसान कृषी दुकान', description: 'बियाणे, फवारणी पंप आणि पशुखाद्य' },
      scientist: { title: 'कृषी शास्त्रज्ञ', description: 'ICAR कृषी तज्ज्ञ आणि पशुवैद्यांशी मोफत कॉल' },
      dealers: { title: 'कृषी विक्रेते', description: '5 किमी परिसरात औषधे आणि फवारणीचे साहित्य शोधा' },
    },
  },
  plots: {
    title: 'माझे प्लॉट',
    comingSoon: 'प्लॉटचे व्यवस्थापन लवकरच सुरू होईल',
    empty: 'अजून एकही प्लॉट जोडलेला नाही.',
    health: {
      ACTION_NEEDED: 'लक्ष द्या',
      MODERATE_RISK: 'मध्यम धोका',
      HEALTHY: 'निरोगी',
    },
    photoAlt: (crop, field) => `${field} मधील ${crop} पीक`,
    area: (acres) => `${acres} एकर`,
    reviewTreatment: (crop) => `${crop} प्लॉटचा उपचार पाहा`,
    viewSolution: 'उपाय पाहा',
  },
  scans: {
    title: 'अलीकडील स्कॅन आणि औषधे',
    history: 'इतिहास',
    empty: (scanTab) => `अजून एकही स्कॅन नाही. पहिले पान तपासण्यासाठी ${scanTab} वर टॅप करा.`,
    confidence: (percent) => `${percent}% खात्री`,
    prescription: (prescription) => `औषध: ${prescription}`,
    stockists: (count) =>
      count === 0
        ? 'जवळच्या दुकानांत अजून उपलब्ध नाही'
        : `जवळच्या ${count} ${count === 1 ? 'दुकानात' : 'दुकानांत'} उपलब्ध`,
    viewPrescription: 'औषध पाहा',
  },
  helpline: {
    title: 'सरकारी मदत',
    dialLabel: (helpline) => `${helpline} ला थेट कॉल करा`,
    dial: 'तज्ज्ञांना थेट कॉल करा',
  },
}
