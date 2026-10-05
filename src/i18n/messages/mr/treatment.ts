import type { Translation } from '../../translation'
import type { treatment as en } from '../en/treatment'

export const treatment: Translation<typeof en> = {
  plan: {
    loading: 'उपचार योजना लोड होत आहे…',
    loadFailed: 'उपचार योजना लोड करता आली नाही',
    outbreak: 'रोग प्रादुर्भाव – तातडीचे उपाय',
    stepsDone: (done, total) => `${total} पैकी ${done} ${done === 1 ? 'टप्पा' : 'टप्पे'} पूर्ण`,
    target: 'रोग:',
    progress: 'उपचाराची प्रगती',
    percentCompleted: (percent) => `${percent}% पूर्ण`,
  },
  timeline: {
    title: (days) => `${days} ${days === 1 ? 'दिवसाचे' : 'दिवसांचे'} उपचार वेळापत्रक`,
    timeZone: 'भारतीय वेळ',
    day: (day, label) => `दिवस ${day} • ${label}`,
    completed: 'पूर्ण',
    completedAt: (time) => `${time} ला पूर्ण`,
    checkupPhoto: 'पिकात सुधारणा झाली का, ते पाहण्यासाठी नवीन फोटो अपलोड करा',
    checkupHint: 'AI पहिल्या दिवसाशी तुलना करून डाग किती कमी झाले ते सांगेल',
  },
  step: {
    markDone: 'पूर्ण झाल्याची नोंद करा',
    markedDone: (title) => `${title} पूर्ण झाल्याची नोंद झाली`,
    updateFailed: 'हा टप्पा अपडेट करता आला नाही. कृपया पुन्हा प्रयत्न करा.',
  },
  reminder: {
    add: 'अलार्म लावा',
    addAt: (time) => `अलार्म लावा (${time})`,
    active: 'अलार्म लावला ✓',
    activeAt: (time) => `${time} चा अलार्म लावला ✓`,
    added: 'अलार्म लावला',
    addedAt: (time) => `${time} चा अलार्म लावला`,
    cancelled: 'अलार्म रद्द केला',
  },
  stores: {
    loading: 'तुमच्या जवळची दुकाने शोधत आहोत…',
    loadFailed: 'जवळची दुकाने लोड करता आली नाहीत',
    title: 'स्टॉक असलेली जवळची दुकाने',
    area: (hub, district, radiusKm) => `${hub} (${district}) - ${radiusKm} किमी परिसरात`,
    inventory: (products) => `${products} सध्या या पडताळलेल्या विक्रेत्यांकडे उपलब्ध आहे`,
    orderNow: 'आता मागवा',
    stockists: (count, hub) => `${hub} मध्ये ${count} अधिकृत ${count === 1 ? 'विक्रेता' : 'विक्रेते'}`,
  },
  dealer: {
    certification: {
      GOVT_CERTIFIED: 'शासनमान्य विक्रेता',
      AUTHORIZED_RETAILER: 'अधिकृत दुकानदार',
    },
    distance: (km, address) => `${km} किमी दूर • ${address}`,
    reviews: (count) => `${count} अभिप्राय`,
    reviewsPlus: (count) => `${count}+ अभिप्राय`,
    call: 'कॉल करा',
    callLabel: (name) => `${name} यांना कॉल करा`,
    route: 'रस्ता पाहा',
    routeLabel: (name) => `${name} पर्यंतचा रस्ता पाहा (Google Maps उघडेल)`,
  },
  agronomist: {
    loading: 'कृषी तज्ज्ञांची माहिती लोड होत आहे…',
    loadFailed: 'कृषी तज्ज्ञांची माहिती लोड करता आली नाही',
    onDuty: 'कृषी तज्ज्ञ उपलब्ध',
    offDuty: 'कृषी तज्ज्ञ सध्या उपलब्ध नाहीत',
    photoAlt: (name) => `${name} यांचा फोटो`,
    call: 'आत्ताच कॉल करा (टोल-फ्री, मोफत)',
  },
}
