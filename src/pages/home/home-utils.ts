import type { Messages } from '../../i18n/translation'
import type { AlertSeverity, FarmerProfile, PlotHealth, RiskAlert, Tone, WeatherSummary } from '../../lib/types'

/** Alerts shown as strips under the weather tiles; LOW alerts stay off the home screen. */
export type UrgentSeverity = Exclude<AlertSeverity, 'LOW'>

export interface UrgentAlert extends RiskAlert {
  severity: UrgentSeverity
}

export function isUrgentAlert(alert: RiskAlert): alert is UrgentAlert {
  return alert.severity !== 'LOW'
}

interface AlertStripStyle {
  container: string
  icon: string
  title: string
}

export const ALERT_STRIP_STYLE: Record<UrgentSeverity, AlertStripStyle> = {
  HIGH: { container: 'bg-error-container text-on-error-container', icon: 'text-error', title: 'text-error' },
  MODERATE: {
    container: 'bg-surface-container-high text-on-surface-variant',
    icon: 'text-on-surface-variant',
    title: 'text-on-surface',
  },
}

interface HealthPillStyle {
  icon: string
  fill: boolean
  className: string
}

/** Look of a plot's health pill; its text is t.home.plots.health[health]. */
export const PLOT_HEALTH_PILL: Record<PlotHealth, HealthPillStyle> = {
  ACTION_NEEDED: {
    icon: 'error',
    fill: true,
    className: 'bg-error-container text-on-error-container animate-pulse',
  },
  MODERATE_RISK: {
    icon: 'shield',
    fill: false,
    className: 'bg-surface-container-high text-on-surface-variant',
  },
  HEALTHY: {
    icon: 'check_circle',
    fill: true,
    className: 'bg-secondary-container text-on-secondary-container',
  },
}

/** Colour of a plot metric's value, e.g. "Yesterday (Blight)" in red. */
export const METRIC_VALUE_CLASS: Record<Tone, string> = {
  error: 'text-error',
  success: 'text-secondary',
  warning: 'text-on-surface',
  neutral: 'text-on-surface',
}

/** A plot's latest diagnosis, or the most recent scan when the plot has none. */
export function diagnosisPath(scanId: number | null): string {
  return scanId === null ? '/diagnosis' : `/diagnosis/${scanId}`
}

/** Script of the spoken daily briefing: greeting, weather and the most urgent alert (HIGH before MODERATE). */
export function farmBriefing(t: Messages, farmer: FarmerProfile, weather: WeatherSummary, alerts: RiskAlert[]): string {
  const briefing = t.home.briefing
  const alert = alerts.find((candidate) => candidate.severity === 'HIGH') ?? alerts.find(isUrgentAlert)
  return [
    briefing.greeting(farmer.name, farmer.location),
    briefing.weather(weather.temperatureC, weather.condition, weather.humidityPercent),
    briefing.rain(weather.rainInDays),
    alert ? briefing.alert(alert.title, alert.message) : briefing.noAlerts,
  ].join(' ')
}
