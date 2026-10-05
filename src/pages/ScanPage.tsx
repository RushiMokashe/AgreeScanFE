import { StackHeader } from '../components/layout/StackHeader'
import { ErrorState, LoadingState } from '../components/PageState'
import { useApi } from '../hooks/useApi'
import { useI18n } from '../i18n/i18n-context'
import { api } from '../lib/api'
import { CropScanner } from './scan/CropScanner'

/** Stitch screen "Crop Scanner & Camera AI": a full-screen flow with a back header instead of the tab bar. */
export default function ScanPage() {
  const { t } = useI18n()
  const { data, error, reload } = useApi(() => api.scanContext())

  return (
    <>
      <StackHeader title={t.nav.screens.scan} />
      <main className="flex flex-col relative w-full pt-16 bg-surface pb-safe">
        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : data ? (
          <CropScanner context={data} />
        ) : (
          <LoadingState />
        )}
      </main>
    </>
  )
}
