import { Link } from 'react-router'
import { Icon } from '../components/Icon'
import { ErrorState, LoadingState } from '../components/PageState'
import { StatTile } from '../components/StatTile'
import { PaymentsToConfirm } from '../components/payments/PaymentsToConfirm'
import { ScanAndPayCard } from '../components/payments/ScanAndPayCard'
import { useApi } from '../hooks/useApi'
import { useI18n } from '../i18n/i18n-context'
import { useFormat } from '../i18n/useFormat'
import { api } from '../lib/api'
import { isOwnerBookingRoute, useNotificationRefresh } from '../notifications/useNotificationRefresh'
import { OwnerBookingCard } from './bookings/OwnerBookingCard'
import { BusinessCard } from './dashboard/BusinessCard'
import { STATUS_PARAM } from './owner-utils'

const SHORTCUT =
  'flex min-h-[52px] items-center justify-center gap-space-xs rounded-xl px-space-sm font-label-lg text-label-lg'

/** The partner dashboard (/owner): business details, the numbers that matter, the next jobs and shortcuts. */
export default function OwnerDashboardPage() {
  const { t } = useI18n()
  const format = useFormat()
  const profile = useApi(() => api.owner.me())
  const dashboard = useApi(() => api.owner.dashboard())
  useNotificationRefresh(isOwnerBookingRoute, dashboard.reload)

  const error = profile.error ?? dashboard.error
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          profile.reload()
          dashboard.reload()
        }}
      />
    )
  }
  if (!profile.data || !dashboard.data) return <LoadingState label={t.owner.dashboard.loading} />

  const { listingsOnline, listingsTotal, pendingRequests, earningsThisMonth, upcoming } = dashboard.data
  const owner = profile.data

  return (
    <div className="flex flex-col gap-space-md px-margin py-space-sm">
      <BusinessCard profile={owner} onChange={profile.setData} />
      <ScanAndPayCard
        acceptsScanAndPay={owner.acceptsScanAndPay}
        upiId={owner.upiId}
        upiQrUrl={owner.upiQrUrl}
        onSaveUpiId={async (upiId) =>
          profile.setData(
            await api.owner.updateMe({ name: owner.name, businessName: owner.businessName, hubId: owner.hubId, upiId }),
          )
        }
        onUploadQr={async (image) => profile.setData(await api.owner.uploadUpiQr(image))}
        onRemoveQr={async () => profile.setData(await api.owner.removeUpiQr())}
      />
      <PaymentsToConfirm purpose="RENTAL_BOOKING" onDecided={dashboard.reload} />

      <div className="grid grid-cols-3 gap-space-sm">
        <StatTile
          icon="agriculture"
          label={t.owner.dashboard.online}
          value={t.owner.dashboard.onlineOf(format.number(listingsOnline), format.number(listingsTotal))}
          to="/owner/vehicles"
        />
        <StatTile
          icon="notifications_active"
          label={t.owner.dashboard.pending}
          value={format.number(pendingRequests)}
          to={`/owner/bookings?${STATUS_PARAM}=REQUESTED`}
          highlighted={pendingRequests > 0}
        />
        <StatTile icon="payments" label={t.owner.dashboard.earnings} value={format.inr(earningsThisMonth)} />
      </div>

      <div className="grid grid-cols-2 gap-space-sm">
        <Link to="/owner/vehicles/new" className={`${SHORTCUT} bg-primary text-on-primary shadow-sm`}>
          <Icon name="add_circle" className="text-[20px]" />
          {t.owner.dashboard.addVehicle}
        </Link>
        <Link to="/owner/bookings" className={`${SHORTCUT} bg-surface-container-high text-primary`}>
          <Icon name="event_note" className="text-[20px]" />
          {t.owner.dashboard.requests}
        </Link>
      </div>

      <section className="flex flex-col gap-space-sm">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{t.owner.dashboard.upcoming}</h2>
        {upcoming.length === 0 ? (
          <p className="rounded-xl bg-surface-container-lowest p-space-md font-body-md text-body-md text-on-surface-variant shadow-sm">
            {t.owner.dashboard.noUpcoming}
          </p>
        ) : (
          <ul className="flex flex-col gap-space-sm">
            {upcoming.map((booking) => (
              <OwnerBookingCard key={booking.id} booking={booking} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
