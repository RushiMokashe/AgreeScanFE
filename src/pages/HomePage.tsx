import { ErrorState, LoadingState } from '../components/PageState'
import { useApi } from '../hooks/useApi'
import { api } from '../lib/api'
import { AgriScanIntroCard } from './home/AgriScanIntroCard'
import { FieldPlotsSection } from './home/FieldPlotsSection'
import { HelplineCard } from './home/HelplineCard'
import { RecentScansSection } from './home/RecentScansSection'
import { WelcomeWeatherCard } from './home/WelcomeWeatherCard'

/** Stitch screen "Home - Crop Dashboard": weather and alerts, the scan entry point, plots and recent scans. */
export default function HomePage() {
  const { data, error, reload } = useApi(() => api.dashboard())
  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!data) return <LoadingState />

  return (
    <div className="flex flex-col w-full px-margin pb-6 gap-space-lg">
      <WelcomeWeatherCard
        farmer={data.farmer}
        weather={data.weather}
        alerts={data.alerts}
        plotCount={data.plots.length}
      />
      <AgriScanIntroCard />
      <FieldPlotsSection plots={data.plots} />
      <RecentScansSection scans={data.recentScans} />
      <HelplineCard helpline={data.helpline} />
    </div>
  )
}
