import type { Messages } from '../../i18n/translation'
import type { ScanDetail } from '../../lib/types'

/** Viewfinder magnification; the 1x / 2x toggle only scales the preview. */
export type ZoomLevel = 1 | 2

export const ZOOM_SCALE_CLASS: Record<ZoomLevel, string> = {
  1: 'scale-100',
  2: 'scale-200',
}

/** Colour scheme of a field context card below the shutter. */
export type InsightTone = 'positive' | 'alert'

interface InsightToneStyle {
  icon: string
  note: string
}

export const INSIGHT_TONE_STYLE: Record<InsightTone, InsightToneStyle> = {
  positive: { icon: 'text-primary', note: 'text-secondary' },
  alert: { icon: 'text-error', note: 'text-on-error-container' },
}

/** Second line of the floating "Live Diagnosis" card, e.g. "Early Blight pattern detected… • Tap to View Rx →". */
export function liveDiagnosisHint(t: Messages, { finding, healthy }: ScanDetail): string {
  const action = healthy ? t.scan.live.viewReport : t.scan.live.viewPrescription
  return finding ? `${finding} • ${action}` : action
}
