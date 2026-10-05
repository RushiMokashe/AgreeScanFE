import type { Messages } from '../../i18n/translation'
import type { ScanDetail, Severity } from '../../lib/types'

/** Confidence (%) from which the model's match is reported as "high". */
const HIGH_CONFIDENCE = 85

/** The slash of a dilution ("2.5g / Liter"), which the spoken advice reads as "per". */
const UNIT_SLASH = /\s*\/\s*/g

/** Colours of the result banner; its text is t.diagnosis.triage[result]. */
export const TRIAGE_BADGE = {
  priority: { dot: 'bg-error animate-ping', text: 'text-error' },
  healthy: { dot: 'bg-secondary', text: 'text-secondary' },
} as const

interface SeverityTileStyle {
  container: string
  text: string
  icon: string
  fill: boolean
}

const DISEASE_SEVERITY_TILE: SeverityTileStyle = {
  container: 'bg-error-container/40',
  text: 'text-on-error-container',
  icon: 'warning',
  fill: false,
}

export const SEVERITY_TILE_STYLE: Record<Severity, SeverityTileStyle> = {
  SEVERE: DISEASE_SEVERITY_TILE,
  MODERATE: DISEASE_SEVERITY_TILE,
  LOW: { container: 'bg-surface-container-high', text: 'text-on-surface-variant', icon: 'shield', fill: false },
  NONE: {
    container: 'bg-secondary-container/40',
    text: 'text-on-secondary-container',
    icon: 'check_circle',
    fill: true,
  },
}

/** "Severity Stage 2", or "No Disease" for a healthy scan. */
export function severityTitle(t: Messages, severity: Severity, stage: number | null): string {
  if (severity === 'NONE') return t.diagnosis.severity.none
  return stage === null ? t.diagnosis.severity.title : t.diagnosis.severity.stage(stage)
}

export function patternMatchLabel(t: Messages, confidence: number): string {
  return confidence >= HIGH_CONFIDENCE ? t.diagnosis.confidence.high : t.diagnosis.confidence.moderate
}

/** "Tomato (Solanum lycopersicum)" */
export function cropDisplayName(cropLabel: string, scientificName: string | null): string {
  return scientificName ? `${cropLabel} (${scientificName})` : cropLabel
}

/** "Hindi, English • 42s audio clip" */
export function audioClipLabel(t: Messages, languages: string, seconds: number | null): string {
  const clip = seconds === null ? t.diagnosis.audio.clip : t.diagnosis.audio.clipLength(seconds)
  return `${languages} • ${clip}`
}

/** Action buttons name the product by the first word of its active ingredient: "Mancozeb 75% WP" -> "Mancozeb". */
export function productName(activeIngredient: string): string {
  return activeIngredient.trim().split(/\s+/)[0]
}

/** The scan's treatment plan, or the farmer's active plan when the scan has none. */
export function treatmentPath(planId: number | null): string {
  return planId === null ? '/treatment' : `/treatment/${planId}`
}

/** Script of "Hear Diagnostic Advice": the disease, why it happened and the prescription in brief. */
export function diagnosticAdvice(t: Messages, { cropLabel, diseaseName, cause, prescription }: ScanDetail): string {
  const advice = t.diagnosis.advice
  const sentences = [advice.result(cropLabel, diseaseName)]
  if (cause) sentences.push(cause)
  if (prescription) {
    sentences.push(
      advice.treatment(prescription.activeIngredient, prescription.dilution.replace(UNIT_SLASH, ` ${advice.per} `)),
      prescription.applicationWindow,
      // rich text: drop the **bold** markers
      prescription.preHarvestNote.replaceAll('**', ''),
    )
  }
  return sentences.join(' ')
}
