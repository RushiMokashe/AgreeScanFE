import type { Translation } from '../../translation'
import type { scan as en } from '../en/scan'

export const scan: Translation<typeof en> = {
  photoAlt: (crop, diagnosis) => `${crop} स्कॅन: ${diagnosis}`,
  scanned: (when) => `${when} स्कॅन केले`,
  status: {
    live: (model) => `${model} सुरू`,
    fieldReady: 'शेतासाठी तयार',
    naturalLight: 'उजेड योग्य',
    macroLock: 'जवळून फोकस',
    offlineCache: 'ऑफलाइनही चालेल',
  },
  crops: {
    label: 'पीक',
    autoDetect: 'आपोआप ओळख',
    autoDetectActive: 'आपोआप ओळख (सुरू)',
  },
  camera: {
    preview: 'कॅमेऱ्याचे थेट दृश्य',
    sampleAlt: 'करप्याचे ठिपके असलेले टोमॅटोचे नमुना पान',
    distanceHint: 'कॅमेरा पानापासून 15-20 सेमी दूर धरा',
    naturalLighting: 'नैसर्गिक उजेड',
    focusLocked: 'फोकस लॉक',
    unavailable: 'कॅमेरा उपलब्ध नाही — फोटो अपलोड करा',
    torch: 'टॉर्च चालू/बंद करा',
    torchFailed: 'टॉर्च चालू किंवा बंद करता आला नाही',
    zoom: 'झूम बदला',
    grid: 'ग्रिड दाखवा/लपवा',
    analyzing: 'पान तपासत आहे…',
  },
  live: {
    title: 'थेट निदान',
    match: (percent) => `${percent}% जुळणी`,
    viewPrescription: 'औषध पाहण्यासाठी टॅप करा →',
    viewReport: 'अहवाल पाहण्यासाठी टॅप करा →',
  },
  shutter: {
    gallery: 'गॅलरी',
    galleryLabel: 'गॅलरीतून पानाचा फोटो निवडा',
    capture: 'फोटो घ्या आणि तपासा',
    captureLabel: 'फोटो घेऊन पिकाची स्थिती तपासा',
    bugMode: 'कीड मोड',
    bugModeLabel: 'कीड तपासणी मोड सुरू करा',
    captureFailed: 'फोटो घेता आला नाही. कृपया पुन्हा प्रयत्न करा.',
    analyzeFailed: 'फोटो तपासता आला नाही',
  },
  voice: {
    title: 'आवाज सहाय्यक',
    hint: 'तुमच्या पिकाची अडचण मराठीत बोलून सांगा',
    start: 'तुमच्या भाषेत बोलून शोधा',
    listen: 'ऐका',
    comingSoon: 'आवाज सहाय्यक लवकरच सुरू होईल',
  },
  insights: {
    moisture: 'शेतातील ओलावा',
    outbreaks: 'जवळपासचा प्रादुर्भाव',
    alerts: (count) => `${count} ${count === 1 ? 'इशारा' : 'इशारे'}`,
    viewStores: 'दुकाने पाहा →',
  },
}
