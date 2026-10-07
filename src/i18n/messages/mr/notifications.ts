import type { Translation } from '../../translation'
import type { notifications as en } from '../en/notifications'

export const notifications: Translation<typeof en> = {
  bell: (count: number) => (count === 0 ? 'सूचना' : `सूचना, ${count} न वाचलेल्या`),
  view: 'पहा',
  loading: 'सूचना आणत आहोत…',
  markAllRead: 'सर्व वाचल्या म्हणून खूण करा',
  unread: 'न वाचलेली',
  loadMore: 'जुन्या सूचना दाखवा',
  empty: {
    title: 'अजून कोणतीही सूचना नाही',
    message: 'तुमच्या बुकिंग आणि पेमेंटबद्दलच्या अपडेट्स इथे दिसतील.',
  },
  alerts: {
    title: 'या फोनवर सूचना',
    message: 'AgriScan मागे सुरू असतानाही बुकिंग आणि पेमेंटच्या अपडेट्स मिळवा.',
    enable: 'सूचना सुरू करा',
    enabled: 'या फोनवर सूचना सुरू आहेत.',
    blocked: 'सूचना बंद आहेत. ब्राउझर सेटिंग्जमध्ये AgriScan साठी सूचनांना परवानगी द्या.',
  },
}
