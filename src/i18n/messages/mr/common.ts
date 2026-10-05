import type { Translation } from '../../translation'
import type { common as en } from '../en/common'

export const common: Translation<typeof en> = {
  loading: 'लोड होत आहे…',
  loadFailed: 'ही स्क्रीन उघडता आली नाही',
  retry: 'पुन्हा प्रयत्न करा',
  close: 'बंद करा',
  placeholder: 'ही स्क्रीन अजून तयार होत आहे. पुढच्या अपडेटमध्ये ती उपलब्ध होईल.',
  errors: {
    serverUnreachable: 'सध्या AgriScan सर्व्हरशी संपर्क होत नाही. थोड्या वेळाने पुन्हा प्रयत्न करा.',
    noConnection: 'कनेक्ट होता आले नाही. इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.',
    sessionExpired: 'तुमचे लॉगिन संपले आहे. कृपया पुन्हा लॉग इन करा.',
    requestFailed: (status) => `विनंती पूर्ण होऊ शकली नाही (${status})`,
    unexpected: 'काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.',
  },
  language: {
    label: 'भाषा',
    loadFailed: (language) => `${language} भाषा सुरू करता आली नाही. कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.`,
  },
  speech: {
    unsupported: 'या डिव्हाइसवर आवाजात ऐकण्याची सोय उपलब्ध नाही',
  },
  roles: {
    FARMER: 'शेतकरी',
    VEHICLE_OWNER: 'वाहन मालक',
    ADMIN: 'प्रशासक',
  },
  notFound: {
    title: 'हे शेत रिकामे आहे',
    message: 'तुम्ही उघडलेले पान अस्तित्वात नाही.',
    home: 'मुख्य पानावर परत जा',
  },
  crash: {
    title: 'काहीतरी चुकले',
    message: 'ही स्क्रीन काम करेनाशी झाली. पुढे जाण्यासाठी ॲप पुन्हा लोड करा.',
    reload: 'पुन्हा लोड करा',
  },
}
