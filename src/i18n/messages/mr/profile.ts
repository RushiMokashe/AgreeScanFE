import type { Translation } from '../../translation'
import type { profile as en } from '../en/profile'

export const profile: Translation<typeof en> = {
  access: 'तुमच्या भूमिका',
  details: {
    title: 'खात्याची माहिती',
    name: 'पूर्ण नाव',
    nameRequired: 'तुमचे नाव टाका.',
    email: 'ईमेल (ऐच्छिक)',
    emailInvalid: 'योग्य ईमेल पत्ता टाका, किंवा ही जागा रिकामी ठेवा.',
    phone: 'मोबाइल नंबर',
    phoneHint: 'तुम्ही या नंबरने लॉग इन करता. तो बदलण्यासाठी प्रशासकांशी संपर्क साधा.',
    save: 'बदल जतन करा',
    saving: 'जतन होत आहे…',
    saved: 'प्रोफाइल जतन झाले',
  },
  language: {
    title: 'ॲपची भाषा',
    hint: 'स्क्रीन, बोलून दिलेला सल्ला आणि आवाज सहाय्यक याच भाषेत असतील.',
  },
  password: {
    title: 'पासवर्ड बदला',
    current: 'सध्याचा पासवर्ड',
    currentRequired: 'तुमचा सध्याचा पासवर्ड टाका.',
    new: 'नवीन पासवर्ड',
    newInvalid: 'नवीन पासवर्ड खालील नियमांनुसार नाही.',
    submit: 'पासवर्ड बदला',
    submitting: 'बदलत आहे…',
    changed: 'पासवर्ड बदलला',
  },
  signOutHint: 'या डिव्हाइसवरून AgriScan मधून लॉग आउट करा.',
}
