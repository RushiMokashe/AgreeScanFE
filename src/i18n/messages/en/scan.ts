/** Crop scanner (farm & crop health), and the texts about a scan that the home and diagnosis screens share. */
export const scan = {
  /** Alt text of a scan's photo, e.g. "Tomato scan: Early Blight". */
  photoAlt: (crop: string, diagnosis: string) => `${crop} scan: ${diagnosis}`,
  /** `when` is a relative time: "3 hours ago", "yesterday 04:30 PM". */
  scanned: (when: string) => `Scanned ${when}`,
  status: {
    /** `model` is the AI model's name, e.g. "Neural AI Vision v4.2". */
    live: (model: string) => `${model} Live`,
    fieldReady: 'Field Ready',
    naturalLight: 'Natural Light OK',
    macroLock: 'Macro Lock',
    offlineCache: 'Offline Cache On',
  },
  crops: {
    label: 'Crop',
    autoDetect: 'Auto Detect',
    autoDetectActive: 'Auto Detect (Active)',
  },
  camera: {
    preview: 'Live camera preview',
    sampleAlt: 'Sample tomato leaf with early blight lesions',
    distanceHint: 'Hold camera 15-20cm from leaf',
    naturalLighting: 'Natural Lighting',
    focusLocked: 'Focus Locked',
    unavailable: 'Camera unavailable — upload a photo',
    torch: 'Toggle Torch',
    torchFailed: 'Could not switch the torch',
    zoom: 'Toggle Zoom Factor',
    grid: 'Toggle Viewfinder Grid',
    analyzing: 'Analyzing leaf…',
  },
  live: {
    title: 'Live Diagnosis',
    match: (percent: number) => `${percent}% MATCH`,
    viewPrescription: 'Tap to View Rx →',
    viewReport: 'Tap to View Report →',
  },
  shutter: {
    gallery: 'Gallery',
    galleryLabel: 'Upload leaf photo from gallery',
    capture: 'Capture & Analyze',
    captureLabel: 'Capture and analyze crop condition',
    bugMode: 'Bug Mode',
    bugModeLabel: 'Switch to pest insect mode',
    captureFailed: 'Could not capture the photo. Please try again.',
    analyzeFailed: 'Could not analyze the photo',
  },
  voice: {
    title: 'Voice Assistant',
    hint: 'Speak your crop issue in Hindi, Punjabi, or Telugu',
    start: 'Start voice search in local vernacular dialect',
    listen: 'Listen',
    comingSoon: 'Voice assistant coming soon',
  },
  insights: {
    moisture: 'Field Moisture',
    outbreaks: 'Nearby Outbreaks',
    alerts: (count: number) => `${count} ${count === 1 ? 'Alert' : 'Alerts'}`,
    viewStores: 'View Stores →',
  },
}
