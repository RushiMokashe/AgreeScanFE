import type { Translation } from '../../translation'
import type { notifications as en } from '../en/notifications'

export const notifications: Translation<typeof en> = {
  bell: (count: number) => (count === 0 ? 'सूचनाएँ' : `सूचनाएँ, ${count} अपठित`),
  view: 'देखें',
  loading: 'सूचनाएँ ला रहे हैं…',
  markAllRead: 'सभी को पढ़ा हुआ करें',
  unread: 'अपठित',
  loadMore: 'पुरानी सूचनाएँ दिखाएँ',
  empty: {
    title: 'अभी कोई सूचना नहीं',
    message: 'आपकी बुकिंग और भुगतान से जुड़ी जानकारी यहाँ दिखेगी।',
  },
  alerts: {
    title: 'इस डिवाइस पर अलर्ट',
    message: 'AgriScan पीछे चलने पर भी बुकिंग और भुगतान की जानकारी पाएँ।',
    enable: 'अलर्ट चालू करें',
    enabled: 'इस डिवाइस पर अलर्ट चालू हैं।',
    blocked: 'अलर्ट ब्लॉक हैं। ब्राउज़र सेटिंग्स में AgriScan के लिए सूचनाओं की अनुमति दें।',
  },
}
