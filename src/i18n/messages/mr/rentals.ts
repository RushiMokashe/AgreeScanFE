import type { Translation } from '../../translation'
import type { rentals as en } from '../en/rentals'

export const rentals: Translation<typeof en> = {
  loading: 'जवळपासच्या भाडेसेवा शोधत आहे…',
  location: {
    radius: (km) => `${km} किमी परिसर`,
    change: 'बदला',
    changeLabel: 'भाडे केंद्र बदला',
    hubsTitle: 'तुमचे भाडे केंद्र निवडा',
    hubsLoading: 'केंद्रे आणत आहोत…',
    changed: (hub) => `${hub} जवळच्या भाडेसेवा दाखवत आहोत`,
    changeFailed: 'केंद्र बदलता आले नाही. कृपया पुन्हा प्रयत्न करा.',
  },
  tabs: {
    label: 'भाड्याचा प्रकार',
    machinery: 'ट्रॅक्टर व अवजारे',
    transport: 'मंडी टेम्पो',
  },
  rateUnits: {
    HOUR: '/तास',
    KM: '/किमी',
    DAY: '/दिवस',
  },
  distanceAway: (km) => `${km} किमी दूर`,
  spotlight: {
    fareStarts: 'सुरुवातीचे भाडे',
    dispatch: (minutes) => `**${minutes} ${minutes === 1 ? 'मिनिटात' : 'मिनिटांत'}** बांधावर हजर`,
    book: 'टेम्पो बुक करा',
  },
  booking: {
    title: 'हे वाहन बुक करा',
    slot: 'तुम्हाला केव्हा हवे आहे?',
    slotHint: 'उदा. "उद्या सकाळी 6:00"',
    asap: (minutes) => `लवकरात लवकर (${minutes} मिनिटांत रवाना)`,
    units: {
      HOUR: 'कामाचे अंदाजे तास',
      KM: 'अंदाजे अंतर (किमी)',
      DAY: 'दिवसांची संख्या',
    },
    unitsHint: (max) => `1 ते ${max} दरम्यान. मालक प्रत्यक्ष झालेल्या कामाचेच पैसे घेतात.`,
    unitsInvalid: (max) => `1 ते ${max} मधील पूर्ण संख्या लिहा`,
    decrease: 'कमी',
    increase: 'जास्त',
    estimate: 'अंदाजे रक्कम',
    baseFare: (fare) => `+ ${fare} बेस भाडे`,
    payLater: 'मालकाने स्वीकारल्यावर ऑनलाइन पैसे भरा, किंवा काम झाल्यावर मालकाला थेट द्या.',
    submit: 'बुकिंग विनंती पाठवा',
    submitting: 'विनंती पाठवत आहोत…',
    failed: 'बुकिंग होऊ शकली नाही. कृपया पुन्हा प्रयत्न करा.',
  },
  machinery: {
    title: 'जवळपास उपलब्ध कृषी यंत्रे',
    online: (count) => `${count} ऑनलाइन`,
  },
  transport: {
    title: 'मंडीसाठी टेम्पो व ट्रक',
    gatePass: 'गेटवर प्राधान्य पास',
  },
  favorite: {
    save: (name) => `${name} आवडत्यांमध्ये जतन करा`,
    saved: 'तुमच्या आवडत्यांमध्ये जतन केले',
    removed: 'तुमच्या आवडत्यांमधून काढले',
    failed: 'तुमच्या आवडत्या भाडेसेवा अपडेट करता आल्या नाहीत. कृपया पुन्हा प्रयत्न करा.',
  },
  protection: {
    title: 'किसान हमी व मंडी विश्वास',
    guarantees: {
      backupVehicle: {
        title: 'गाडी बिघडली तरी उशीर नाही — हमी',
        description: 'भाड्याने घेतलेला ट्रॅक्टर किंवा टेम्पो बंद पडल्यास, 45 मिनिटांत जवळची दुसरी गाडी पाठवली जाते.',
      },
      freeWaiting: {
        title: 'मंडी गेटवर पहिले 2 तास थांबणे मोफत',
        description: 'APMC मध्ये लिलाव किंवा वजनकाट्यावर नंबर येईपर्यंत थांबण्याचे जादा पैसे घेतले जात नाहीत.',
      },
      payAfterSale: {
        title: 'माल विकल्यानंतर भाडे देण्याची सोय',
        description: 'अडत्या / कमिशन एजंटकडून मंडीतील विक्रीची पावती मिळाल्यावरच वाहतुकीचे भाडे द्या.',
      },
    },
  },
  mandiDesk: {
    name: '24x7 किसान मंडी डेस्क',
    title: 'तातडीने मंडी वाहतूक हवी?',
    tollFree: 'टोल-फ्री कॉल:',
    call: 'कॉल करा',
    callLabel: '24x7 किसान मंडी डेस्कला कॉल करा',
  },
}
