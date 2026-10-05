import type { Translation } from '../../translation'
import type { auth as en } from '../en/auth'

export const auth: Translation<typeof en> = {
  tagline: 'फसलों का AI डॉक्टर, मंडी भाव और खेती की सेवाएँ — एक ही ऐप में',
  title: 'लॉग इन करें',
  subtitle: 'AgriScan पर दर्ज अपना मोबाइल नंबर इस्तेमाल करें।',
  phone: 'मोबाइल नंबर',
  phoneInvalid: (digits) => `अपना ${digits} अंकों का मोबाइल नंबर डालें।`,
  password: 'पासवर्ड',
  passwordRequired: 'अपना पासवर्ड डालें।',
  showPassword: 'पासवर्ड दिखाएँ',
  submit: 'लॉग इन करें',
  submitting: 'लॉग इन हो रहा है…',
  forgotPassword: 'पासवर्ड भूल गए? उसे रीसेट करवाने के लिए अपने AgriScan प्रशासक से संपर्क करें।',
  noAccess: 'इस खाते को अभी AgriScan इस्तेमाल करने की अनुमति नहीं है। कृपया अपने प्रशासक से संपर्क करें।',
  passwordRules: {
    title: 'पासवर्ड में ये ज़रूरी हैं',
    length: (min, max) => `${min} से ${max} कैरेक्टर`,
    letter: 'कम से कम एक अक्षर',
    digit: 'कम से कम एक अंक',
    met: 'पूरा',
    unmet: 'बाकी',
  },
  demo: {
    title: 'डेमो खाते',
    hint: 'सिर्फ़ डेवलपमेंट के लिए · फ़ॉर्म भरने के लिए खाता चुनें',
  },
}
