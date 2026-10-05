import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { ScanSummary } from '../../lib/types'
import { DiseasedScanCard } from './DiseasedScanCard'
import { HealthyScanCard } from './HealthyScanCard'

interface RecentScansSectionProps {
  scans: ScanSummary[]
}

/** "Recent Scans & Rx": diseased scans get the large prescription card, healthy ones the compact card. */
export function RecentScansSection({ scans }: RecentScansSectionProps) {
  const { t } = useI18n()

  return (
    <section className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{t.home.scans.title}</h3>
        <Link
          className="min-h-[44px] font-label-md text-label-md text-secondary font-bold flex items-center gap-0.5"
          to="/diagnosis"
        >
          <span>{t.home.scans.history}</span>
          <Icon name="chevron_right" className="text-[18px]" />
        </Link>
      </div>
      <div className="flex flex-col gap-space-sm">
        {scans.length === 0 && (
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.home.scans.empty(t.nav.tabs.scan)}</p>
        )}
        {scans.map((scan) =>
          scan.healthy ? <HealthyScanCard key={scan.id} scan={scan} /> : <DiseasedScanCard key={scan.id} scan={scan} />,
        )}
      </div>
    </section>
  )
}
