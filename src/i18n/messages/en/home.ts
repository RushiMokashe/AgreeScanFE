import type { PlotHealth } from '../../../lib/types'

/** Home dashboard (farm & crop health): greeting and weather, the AgriScan guide, field plots and recent scans. */
export const home = {
  welcome: {
    greeting: (name: string) => `Ram Ram, ${name}, ji !!!`,
    activePlots: (count: number) => `${count} Active ${count === 1 ? 'Plot' : 'Plots'}`,
    season: (season: string) => `Season ${season}`,
    listenBriefing: 'Listen to daily farm briefing',
    humidity: 'Humidity',
    rainForecast: 'Rain Forecast',
    /** Value of the rain tile: days until rain, null when none is expected. */
    rainOutlook: (days: number | null) =>
      days === null ? 'No Rain' : days === 0 ? 'Today' : `${days} ${days === 1 ? 'Day' : 'Days'}`,
  },
  /** The spoken daily briefing, one sentence per text. */
  briefing: {
    greeting: (name: string, location: string) => `Ram Ram ${name} ji. Here is today's farm briefing for ${location}.`,
    weather: (temperature: number, condition: string, humidity: number) =>
      `It is ${temperature} degrees Celsius and ${condition.toLowerCase()}, with ${humidity} percent humidity.`,
    rain: (days: number | null) =>
      days === null
        ? 'No rain is expected.'
        : days === 0
          ? 'Rain is expected today.'
          : `Rain is expected in ${days} ${days === 1 ? 'day' : 'days'}.`,
    alert: (title: string, message: string) => `Alert: ${title}. ${message}`,
    noAlerts: 'There are no crop alerts for your area today.',
  },
  intro: {
    title: 'What is AgriScan?',
    tagline: 'Your 24/7 AI Doctor for Crops & One-Stop Farm Store',
    listen: 'Listen (30s)',
    listenLabel: 'Listen to 30s explanation',
    script:
      'AgriScan is your AI doctor for crops, available day and night, and your one-stop farm store. ' +
      'Take a clear photo of a sick leaf, a pest or a wilting plant in daylight. ' +
      'Within seconds, AgriScan tells you the disease, how serious it is, ' +
      'and the chemical or organic cure with the right spray dose. ' +
      'Then order genuine medicine with doorstep delivery, or find a verified agro-dealer near you. ' +
      'You can also call a farm scientist for free.',
    howTo: 'How to use AgriScan (3 Simple Steps)',
    steps: {
      photo: {
        title: 'Take a Leaf Photo',
        description: 'Click a clear photo of sick leaves, pests, or wilting crops in daylight.',
      },
      diagnosis: {
        title: 'Instant AI Diagnosis',
        description: 'Within 3 seconds, discover the exact disease, severity, and chemical or organic cure.',
      },
      medicine: {
        title: 'Get Medicine & Recover',
        description: 'Order genuine medicines or find verified nearby agro-dealers with doorstep delivery.',
      },
    },
    scanCta: 'Tap to Take Photo of Crop',
    scanGuide: 'How to scan properly (30s Audio Guide)',
    /** Spoken; names the scanner's shutter and Bug Mode buttons as they are labelled. */
    scanGuideScript: (captureButton: string, bugMode: string) =>
      'How to scan properly. Scan in daylight and keep your shadow off the leaf. ' +
      'Hold the phone 15 to 20 centimetres from the leaf. ' +
      'Fill the green frame with one affected leaf so that the spots are clearly visible. ' +
      `Hold steady until the focus locks, then tap ${captureButton}. ` +
      `To check an insect, switch on ${bugMode} first. ` +
      'Gently wipe off dust or water drops before you scan for a better result.',
    servicesTitle: 'What can you do here?',
    allServices: 'All Services',
    services: {
      cropDoctor: { title: 'AI Crop Doctor', description: 'Scan diseases & calculate pump spray dosage' },
      store: { title: 'Kisan Agro Store', description: 'Seeds, sprayers & cattle feed nutrition' },
      scientist: { title: 'Farm Scientist', description: 'Free call with ICAR agronomists & vets' },
      dealers: { title: 'Agro Dealers', description: 'Locate stock & spray supplies within 5km' },
    },
  },
  plots: {
    title: 'My Field Plots',
    comingSoon: 'Plot management coming soon',
    empty: 'No field plots added yet.',
    health: {
      ACTION_NEEDED: 'Action Needed',
      MODERATE_RISK: 'Moderate Risk',
      HEALTHY: 'Healthy',
    } satisfies Record<PlotHealth, string>,
    photoAlt: (crop: string, field: string) => `${crop} crop in ${field}`,
    /** The plot's area; `acres` is already formatted ("2.5"). */
    area: (acres: string) => `${acres} Acres`,
    reviewTreatment: (crop: string) => `Review treatment for ${crop} plot`,
    viewSolution: 'View Solution',
  },
  scans: {
    title: 'Recent Scans & Rx',
    history: 'History',
    /** `scanTab` is the name of the Scan Crop tab. */
    empty: (scanTab: string) => `No scans yet. Tap ${scanTab} to check your first leaf.`,
    confidence: (percent: number) => `${percent}% Conf.`,
    prescription: (prescription: string) => `Rx: ${prescription}`,
    stockists: (count: number) =>
      count === 0
        ? 'No local store stocks this Rx yet'
        : `${count} local ${count === 1 ? 'store stocks' : 'stores stock'} this Rx`,
    viewPrescription: 'View Rx',
  },
  helpline: {
    title: 'Government Support',
    dialLabel: (helpline: string) => `One-tap dial ${helpline}`,
    dial: 'One-Tap Dial Specialist',
  },
}
