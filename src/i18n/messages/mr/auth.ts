import type { Translation } from '../../translation'
import type { auth as en } from '../en/auth'

export const auth: Translation<typeof en> = {
  tagline: 'पिकांचा AI डॉक्टर, मंडी भाव आणि शेती सेवा — एकाच ॲपमध्ये',
  title: 'लॉग इन करा',
  subtitle: 'AgriScan कडे नोंदवलेला मोबाइल नंबर वापरा.',
  phone: 'मोबाइल नंबर',
  phoneInvalid: (digits) => `तुमचा ${digits} अंकी मोबाइल नंबर टाका.`,
  password: 'पासवर्ड',
  passwordRequired: 'तुमचा पासवर्ड टाका.',
  showPassword: 'पासवर्ड दाखवा',
  submit: 'लॉग इन करा',
  submitting: 'लॉग इन होत आहे…',
  forgotPassword: 'पासवर्ड विसरलात? तो रीसेट करण्यासाठी तुमच्या AgriScan प्रशासकांशी संपर्क साधा.',
  noAccess: 'या खात्याला अजून AgriScan वापरण्याची परवानगी नाही. कृपया तुमच्या प्रशासकांशी संपर्क साधा.',
  passwordRules: {
    title: 'पासवर्डमध्ये हे हवे',
    length: (min, max) => `${min} ते ${max} कॅरेक्टर`,
    letter: 'किमान एक अक्षर',
    digit: 'किमान एक अंक',
    met: 'पूर्ण',
    unmet: 'बाकी',
  },
  demo: {
    title: 'डेमो खाती',
    hint: 'फक्त डेव्हलपमेंटसाठी · फॉर्म भरण्यासाठी खाते निवडा',
  },
}
