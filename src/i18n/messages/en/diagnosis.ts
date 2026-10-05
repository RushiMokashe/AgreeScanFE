/** Diagnosis & treatment summary (farm & crop health): the result, its prescription and the next steps. */
export const diagnosis = {
  /** The address holds something that cannot be a scan id, e.g. /diagnosis/abc. */
  noSuchScan: (id: string) => `There is no scan "${id}".`,
  triage: {
    priority: 'Priority Triage Result',
    healthy: 'Healthy Result',
  },
  severity: {
    title: 'Severity',
    stage: (stage: number) => `Severity Stage ${stage}`,
    none: 'No Disease',
  },
  confidence: {
    title: 'Confidence',
    high: 'High pattern match',
    moderate: 'Moderate pattern match',
  },
  audio: {
    title: 'Hear Diagnostic Advice',
    /** Follows the clip's languages, e.g. "Hindi, English • Audio clip". */
    clip: 'Audio clip',
    clipLength: (seconds: number) => `${seconds}s audio clip`,
    play: 'Play',
    stop: 'Stop',
  },
  /** The spoken advice, one sentence per text around the report's own sentences. */
  advice: {
    result: (crop: string, disease: string) => `${crop}: ${disease}.`,
    /** `dose` is the dilution read out, e.g. "2.5g per Liter". */
    treatment: (ingredient: string, dose: string) => `Recommended treatment: ${ingredient}, ${dose}.`,
    /** Reads the slash of a dilution: "2.5g / Liter" -> "2.5g per Liter". */
    per: 'per',
  },
  cause: {
    title: 'Why This Happened',
    climateTrigger: (trigger: string) => `Field climate trigger: ${trigger}`,
  },
  prescription: {
    title: 'Prescribed Treatment',
    standard: 'Standard Rx',
    recommended: 'Recommended',
    activeComposition: 'Active Composition',
    marketBrands: (brands: string) => `Market brands: ${brands}`,
    dilution: 'Standard Dilution',
    applicationWindow: 'Application Window',
    preHarvestInterval: 'Pre-Harvest Interval (Withholding)',
    organic: 'Bio / Organic Alternative',
  },
  sanitation: {
    field: 'Field Sanitation Steps',
    preventive: 'Preventive Care Tips',
  },
  actions: {
    findStores: (product: string) => `Find Nearby Stores with ${product}`,
    order: (product: string) => `Order ${product} Rx Now • Direct Delivery`,
    callAgronomist: 'Call Agronomist (Free)',
    sprayAlert: 'Set Spray Alert',
    scanAnother: 'Scan Another Crop',
  },
}
