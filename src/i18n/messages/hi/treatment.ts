import type { Translation } from '../../translation'
import type { treatment as en } from '../en/treatment'

export const treatment: Translation<typeof en> = {
  plan: {
    loading: 'इलाज की योजना लोड हो रही है…',
    loadFailed: 'इलाज की योजना लोड नहीं हो सकी',
    outbreak: 'रोग प्रकोप – तुरंत उपाय',
    stepsDone: (done, total) => `${total} में से ${done} चरण ${done === 1 ? 'पूरा' : 'पूरे'}`,
    target: 'रोग:',
    progress: 'इलाज की प्रगति',
    percentCompleted: (percent) => `${percent}% पूरा`,
  },
  timeline: {
    title: (days) => `${days} दिन का इलाज शेड्यूल`,
    timeZone: 'भारतीय समय',
    day: (day, label) => `दिन ${day} • ${label}`,
    completed: 'पूरा हुआ',
    completedAt: (time) => `${time} पर पूरा`,
    checkupPhoto: 'फसल में सुधार देखने के लिए नई फ़ोटो अपलोड करें',
    checkupHint: 'AI पहले दिन से तुलना करके बताएगा कि धब्बे कितने कम हुए',
  },
  step: {
    markDone: 'पूरा हुआ दर्ज करें',
    markedDone: (title) => `${title} को पूरा दर्ज किया गया`,
    updateFailed: 'यह चरण अपडेट नहीं हो सका। कृपया फिर से कोशिश करें।',
  },
  reminder: {
    add: 'अलार्म लगाएँ',
    addAt: (time) => `अलार्म लगाएँ (${time})`,
    active: 'अलार्म लगा है ✓',
    activeAt: (time) => `${time} का अलार्म लगा है ✓`,
    added: 'अलार्म लग गया',
    addedAt: (time) => `${time} का अलार्म लग गया`,
    cancelled: 'अलार्म हटा दिया गया',
  },
  stores: {
    loading: 'आपके पास की दुकानें खोजी जा रही हैं…',
    loadFailed: 'पास की दुकानें लोड नहीं हो सकीं',
    title: 'स्टॉक वाली पास की दुकानें',
    area: (hub, district, radiusKm) => `${hub} (${district}) - ${radiusKm} किमी के दायरे में`,
    inventory: (products) => `${products} अभी इन जाँचे-परखे विक्रेताओं के पास उपलब्ध है`,
    orderNow: 'अभी मँगवाएँ',
    stockists: (count, hub) => `${hub} में ${count} अधिकृत विक्रेता`,
  },
  dealer: {
    certification: {
      GOVT_CERTIFIED: 'सरकारी प्रमाणित विक्रेता',
      AUTHORIZED_RETAILER: 'अधिकृत दुकानदार',
    },
    distance: (km, address) => `${km} किमी दूर • ${address}`,
    reviews: (count) => `${count} ${count === 1 ? 'समीक्षा' : 'समीक्षाएँ'}`,
    reviewsPlus: (count) => `${count}+ समीक्षाएँ`,
    call: 'कॉल करें',
    callLabel: (name) => `${name} को कॉल करें`,
    route: 'रास्ता देखें',
    routeLabel: (name) => `${name} तक का रास्ता देखें (Google Maps खुलेगा)`,
  },
  agronomist: {
    loading: 'कृषि विशेषज्ञ की जानकारी लोड हो रही है…',
    loadFailed: 'कृषि विशेषज्ञ की जानकारी लोड नहीं हो सकी',
    onDuty: 'कृषि विशेषज्ञ उपलब्ध',
    offDuty: 'कृषि विशेषज्ञ अभी उपलब्ध नहीं',
    photoAlt: (name) => `${name} की फ़ोटो`,
    call: 'अभी कॉल करें (टोल-फ़्री, मुफ़्त)',
  },
}
