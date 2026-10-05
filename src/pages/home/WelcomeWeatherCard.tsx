import { useEffect, useState } from 'react'
import { Icon } from '../../components/Icon'
import { useSpeech } from '../../hooks/useSpeech'
import { useI18n } from '../../i18n/i18n-context'
import type { FarmerProfile, RiskAlert, WeatherSummary } from '../../lib/types'
import { AlertStrip } from './AlertStrip'
import { farmBriefing, isUrgentAlert } from './home-utils'
import { WeatherTile } from './WeatherTile'

const BRIEFING_CLIP = 'daily-briefing'
/** How long the briefing button stays enlarged after a tap (the design's "pop" micro-interaction). */
const TAP_POP_MS = 200

interface WelcomeWeatherCardProps {
  farmer: FarmerProfile
  weather: WeatherSummary
  alerts: RiskAlert[]
  plotCount: number
}

/** Greeting with the spoken daily briefing, the microclimate bar and the area's urgent crop alerts. */
export function WelcomeWeatherCard({ farmer, weather, alerts, plotCount }: WelcomeWeatherCardProps) {
  const { t } = useI18n()
  const speech = useSpeech()
  const [popped, setPopped] = useState(false)
  const urgentAlerts = alerts.filter(isUrgentAlert)
  const briefingPlaying = speech.playing === BRIEFING_CLIP

  useEffect(() => {
    if (!popped) return
    const timer = setTimeout(() => setPopped(false), TAP_POP_MS)
    return () => clearTimeout(timer)
  }, [popped])

  const toggleBriefing = () => {
    setPopped(true)
    speech.toggle(BRIEFING_CLIP, farmBriefing(t, farmer, weather, alerts))
  }

  return (
    <section className="flex flex-col rounded-xl bg-surface-container-lowest shadow-md overflow-hidden transition-all">
      <div className="p-space-md flex flex-col gap-space-sm bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container-lowest">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-secondary">
              <Icon name="location_on" className="text-[18px]" />
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold truncate">
                {farmer.location}
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight mt-0.5">
              {t.home.welcome.greeting(farmer.name)}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t.home.welcome.activePlots(plotCount)} • {t.home.welcome.season(farmer.season)}
            </p>
          </div>
          <button
            aria-label={t.home.welcome.listenBriefing}
            aria-pressed={briefingPlaying}
            className={`w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm active:scale-95 transition-transform ${popped ? 'scale-110' : ''}`}
            type="button"
            onClick={toggleBriefing}
          >
            <Icon name={briefingPlaying ? 'stop_circle' : 'volume_up'} className="text-[24px]" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-space-xs pt-space-xs">
          <WeatherTile icon={weather.conditionIcon} value={`${weather.temperatureC}°C`} label={weather.condition} />
          <WeatherTile icon="humidity_mid" value={`${weather.humidityPercent}%`} label={t.home.welcome.humidity} />
          <WeatherTile
            icon="rainy"
            value={t.home.welcome.rainOutlook(weather.rainInDays)}
            label={t.home.welcome.rainForecast}
          />
        </div>
      </div>
      {urgentAlerts.map((alert) => (
        <AlertStrip key={alert.id} alert={alert} />
      ))}
    </section>
  )
}
