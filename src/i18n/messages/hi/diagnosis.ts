import type { Translation } from '../../translation'
import type { diagnosis as en } from '../en/diagnosis'

export const diagnosis: Translation<typeof en> = {
  noSuchScan: (id) => `स्कैन "${id}" नहीं मिला।`,
  triage: {
    priority: 'ज़रूरी नतीजा',
    healthy: 'स्वस्थ नतीजा',
  },
  severity: {
    title: 'गंभीरता',
    stage: (stage) => `गंभीरता स्तर ${stage}`,
    none: 'कोई रोग नहीं',
  },
  confidence: {
    title: 'भरोसा',
    high: 'लक्षण अच्छी तरह मिलते हैं',
    moderate: 'लक्षण कुछ हद तक मिलते हैं',
  },
  audio: {
    title: 'निदान की सलाह सुनें',
    clip: 'ऑडियो क्लिप',
    clipLength: (seconds) => `${seconds} सेकंड की क्लिप`,
    play: 'सुनें',
    stop: 'रोकें',
  },
  advice: {
    result: (crop, disease) => `${crop}: ${disease}।`,
    treatment: (ingredient, dose) => `सुझाया गया इलाज: ${ingredient}, ${dose}।`,
    per: 'प्रति',
  },
  cause: {
    title: 'ऐसा क्यों हुआ?',
    climateTrigger: (trigger) => `खेत के मौसम का कारण: ${trigger}`,
  },
  prescription: {
    title: 'सुझाया गया इलाज',
    standard: 'मुख्य इलाज',
    recommended: 'अनुशंसित',
    activeComposition: 'सक्रिय तत्व',
    marketBrands: (brands) => `बाज़ार के ब्रांड: ${brands}`,
    dilution: 'घोल का अनुपात',
    applicationWindow: 'छिड़काव का समय',
    preHarvestInterval: 'कटाई से पहले रुकने की अवधि',
    organic: 'जैविक विकल्प',
  },
  sanitation: {
    field: 'खेत की साफ़-सफ़ाई के उपाय',
    preventive: 'रोग से बचाव के उपाय',
  },
  actions: {
    findStores: (product) => `पास की दुकानों में ${product} खोजें`,
    order: (product) => `${product} दवा अभी मँगाएँ • सीधी डिलीवरी`,
    callAgronomist: 'विशेषज्ञ को मुफ़्त कॉल',
    sprayAlert: 'छिड़काव की याद दिलाएँ',
    scanAnother: 'दूसरी फसल स्कैन करें',
  },
}
