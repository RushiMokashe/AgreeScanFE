import type { Translation } from '../../translation'
import type { diagnosis as en } from '../en/diagnosis'

export const diagnosis: Translation<typeof en> = {
  noSuchScan: (id) => `"${id}" हा स्कॅन सापडला नाही.`,
  triage: {
    priority: 'तातडीचा निकाल',
    healthy: 'निरोगी निकाल',
  },
  severity: {
    title: 'तीव्रता',
    stage: (stage) => `तीव्रता टप्पा ${stage}`,
    none: 'रोग नाही',
  },
  confidence: {
    title: 'खात्री',
    high: 'लक्षणे चांगली जुळतात',
    moderate: 'लक्षणे काही प्रमाणात जुळतात',
  },
  audio: {
    title: 'निदानाचा सल्ला ऐका',
    clip: 'ऑडिओ क्लिप',
    clipLength: (seconds) => `${seconds} सेकंदांची क्लिप`,
    play: 'ऐका',
    stop: 'थांबवा',
  },
  advice: {
    result: (crop, disease) => `${crop}: ${disease}.`,
    treatment: (ingredient, dose) => `शिफारस केलेला उपचार: ${ingredient}, ${dose}.`,
    per: 'प्रति',
  },
  cause: {
    title: 'हे का झाले?',
    climateTrigger: (trigger) => `शेतातील हवामानाचे कारण: ${trigger}`,
  },
  prescription: {
    title: 'सुचवलेला उपचार',
    standard: 'मुख्य उपचार',
    recommended: 'शिफारस',
    activeComposition: 'सक्रिय घटक',
    marketBrands: (brands) => `बाजारातील ब्रँड: ${brands}`,
    dilution: 'मिसळण्याचे प्रमाण',
    applicationWindow: 'फवारणीची वेळ',
    preHarvestInterval: 'काढणीपूर्वी थांबण्याचा कालावधी',
    organic: 'जैविक / सेंद्रिय पर्याय',
  },
  sanitation: {
    field: 'शेत स्वच्छतेचे उपाय',
    preventive: 'रोग टाळण्याचे उपाय',
  },
  actions: {
    findStores: (product) => `जवळच्या दुकानांत ${product} शोधा`,
    order: (product) => `${product} औषध आत्ता मागवा • थेट घरपोच`,
    callAgronomist: 'तज्ज्ञांना मोफत कॉल',
    sprayAlert: 'फवारणीची आठवण लावा',
    scanAnother: 'दुसरे पीक स्कॅन करा',
  },
}
