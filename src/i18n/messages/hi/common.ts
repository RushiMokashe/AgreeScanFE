import type { Translation } from '../../translation'
import type { common as en } from '../en/common'

export const common: Translation<typeof en> = {
  loading: 'लोड हो रहा है…',
  loadFailed: 'यह स्क्रीन खुल नहीं पाई',
  retry: 'फिर से कोशिश करें',
  close: 'बंद करें',
  placeholder: 'यह स्क्रीन अभी बन रही है। अगले अपडेट में यह उपलब्ध होगी।',
  errors: {
    serverUnreachable: 'अभी AgriScan सर्वर से संपर्क नहीं हो पा रहा है। थोड़ी देर बाद फिर से कोशिश करें।',
    noConnection: 'कनेक्ट नहीं हो सका। अपना इंटरनेट कनेक्शन जाँचें और फिर से कोशिश करें।',
    sessionExpired: 'आपका लॉगिन खत्म हो गया है। कृपया फिर से लॉग इन करें।',
    requestFailed: (status) => `अनुरोध पूरा नहीं हो सका (${status})`,
    unexpected: 'कुछ गड़बड़ हो गई। कृपया फिर से कोशिश करें।',
  },
  language: {
    label: 'भाषा',
    loadFailed: (language) => `${language} भाषा नहीं खुल सकी। कनेक्शन जाँचें और फिर से कोशिश करें।`,
  },
  speech: {
    unsupported: 'इस डिवाइस पर आवाज़ में सुनने की सुविधा नहीं है',
  },
  roles: {
    FARMER: 'किसान',
    VEHICLE_OWNER: 'वाहन मालिक',
    SHOPKEEPER: 'दुकानदार',
    ADMIN: 'प्रशासक',
  },
  photo: {
    choose: 'फ़ोटो चुनें',
    change: 'फ़ोटो बदलें',
    hint: 'JPEG, PNG या WebP, 10 MB तक',
    notImage: 'फ़ोटो चुनें (JPEG, PNG या WebP)',
    tooLarge: 'यह फ़ोटो 10 MB से बड़ी है',
  },
  notFound: {
    title: 'यह खेत खाली है',
    message: 'आपने जो पेज खोला है, वह मौजूद नहीं है।',
    home: 'होम पर वापस जाएँ',
  },
  crash: {
    title: 'कुछ गड़बड़ हो गई',
    message: 'इस स्क्रीन ने काम करना बंद कर दिया है। आगे बढ़ने के लिए ऐप को फिर से लोड करें।',
    reload: 'फिर से लोड करें',
  },
}
