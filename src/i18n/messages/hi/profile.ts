import type { Translation } from '../../translation'
import type { profile as en } from '../en/profile'

export const profile: Translation<typeof en> = {
  access: 'आपकी भूमिकाएँ',
  details: {
    title: 'खाते की जानकारी',
    name: 'पूरा नाम',
    nameRequired: 'अपना नाम डालें।',
    email: 'ईमेल (वैकल्पिक)',
    emailInvalid: 'सही ईमेल पता डालें, या इसे खाली छोड़ दें।',
    phone: 'मोबाइल नंबर',
    phoneHint: 'आप इसी नंबर से लॉग इन करते हैं। इसे बदलवाने के लिए अपने प्रशासक से संपर्क करें।',
    save: 'बदलाव सहेजें',
    saving: 'सहेजा जा रहा है…',
    saved: 'प्रोफ़ाइल सहेज ली गई',
  },
  language: {
    title: 'ऐप की भाषा',
    hint: 'स्क्रीन, बोलकर दी जाने वाली सलाह और वॉइस असिस्टेंट इसी भाषा में होंगे।',
  },
  password: {
    title: 'पासवर्ड बदलें',
    current: 'मौजूदा पासवर्ड',
    currentRequired: 'अपना मौजूदा पासवर्ड डालें।',
    new: 'नया पासवर्ड',
    newInvalid: 'नया पासवर्ड नीचे दिए नियमों के मुताबिक नहीं है।',
    submit: 'पासवर्ड बदलें',
    submitting: 'बदला जा रहा है…',
    changed: 'पासवर्ड बदल दिया गया',
  },
  signOutHint: 'इस डिवाइस पर AgriScan से लॉग आउट करें।',
}
