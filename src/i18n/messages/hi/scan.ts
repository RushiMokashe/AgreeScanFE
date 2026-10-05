import type { Translation } from '../../translation'
import type { scan as en } from '../en/scan'

export const scan: Translation<typeof en> = {
  photoAlt: (crop, diagnosis) => `${crop} स्कैन: ${diagnosis}`,
  scanned: (when) => `${when} स्कैन किया`,
  status: {
    live: (model) => `${model} चालू`,
    fieldReady: 'तैयार',
    naturalLight: 'रोशनी ठीक',
    macroLock: 'पास से फ़ोकस',
    offlineCache: 'ऑफ़लाइन भी चलेगा',
  },
  crops: {
    label: 'फसल',
    autoDetect: 'अपने-आप पहचान',
    autoDetectActive: 'अपने-आप पहचान (चालू)',
  },
  camera: {
    preview: 'कैमरे का लाइव दृश्य',
    sampleAlt: 'अगेती झुलसा के धब्बों वाली टमाटर की नमूना पत्ती',
    distanceHint: 'कैमरा पत्ती से 15-20 सेमी दूर रखें',
    naturalLighting: 'प्राकृतिक रोशनी',
    focusLocked: 'फ़ोकस लॉक',
    unavailable: 'कैमरा उपलब्ध नहीं — फ़ोटो अपलोड करें',
    torch: 'टॉर्च चालू/बंद करें',
    torchFailed: 'टॉर्च चालू या बंद नहीं हो सकी',
    zoom: 'ज़ूम बदलें',
    grid: 'ग्रिड दिखाएँ/छिपाएँ',
    analyzing: 'पत्ती की जाँच हो रही है…',
  },
  live: {
    title: 'लाइव निदान',
    match: (percent) => `${percent}% मिलान`,
    viewPrescription: 'दवा देखने के लिए टैप करें →',
    viewReport: 'रिपोर्ट देखने के लिए टैप करें →',
  },
  shutter: {
    gallery: 'गैलरी',
    galleryLabel: 'गैलरी से पत्ती की फ़ोटो चुनें',
    capture: 'फ़ोटो लें और जाँचें',
    captureLabel: 'फ़ोटो लेकर फसल की हालत जाँचें',
    bugMode: 'कीट मोड',
    bugModeLabel: 'कीट जाँच मोड चालू करें',
    captureFailed: 'फ़ोटो नहीं ली जा सकी। कृपया फिर से कोशिश करें।',
    analyzeFailed: 'फ़ोटो की जाँच नहीं हो सकी',
  },
  voice: {
    title: 'वॉइस असिस्टेंट',
    hint: 'अपनी फसल की समस्या हिंदी में बोलकर बताएँ',
    start: 'अपनी भाषा में बोलकर खोजें',
    listen: 'सुनें',
    comingSoon: 'वॉइस असिस्टेंट जल्द शुरू होगा',
  },
  insights: {
    moisture: 'खेत की नमी',
    outbreaks: 'आसपास रोग का प्रकोप',
    alerts: (count) => `${count} ${count === 1 ? 'चेतावनी' : 'चेतावनियाँ'}`,
    viewStores: 'दुकानें देखें →',
  },
}
