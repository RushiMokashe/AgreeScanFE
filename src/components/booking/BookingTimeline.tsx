import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { BookingEvent } from '../../lib/types'
import { Icon } from '../Icon'
import { BOOKING_STATUS_STYLES } from './booking-styles'

interface BookingTimelineProps {
  timeline: BookingEvent[]
  /** Who is reading: their own steps read "You". */
  viewer: 'FARMER' | 'OWNER'
}

/** Every step of a booking, oldest first, as farmers and owners both see it (D9). */
export function BookingTimeline({ timeline, viewer }: BookingTimelineProps) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <h2 className="mb-space-sm font-title-md text-title-md font-bold text-on-surface">{t.bookings.timeline.title}</h2>
      <ol className="flex flex-col">
        {timeline.map((event, index) => {
          const { icon, tone } = BOOKING_STATUS_STYLES[event.status]
          const last = index === timeline.length - 1
          return (
            <li key={`${event.status}-${event.at}`} className="flex gap-space-sm">
              <div className="flex flex-col items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tone}`}>
                  <Icon name={icon} className="text-[16px]" />
                </span>
                {!last && <span aria-hidden="true" className="w-0.5 flex-1 min-h-[16px] bg-outline-variant" />}
              </div>
              <div className={`flex flex-col min-w-0 ${last ? '' : 'pb-space-md'}`}>
                <span className="font-label-lg text-label-lg font-bold text-on-surface">
                  {t.bookings.timeline.event[event.status]}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {event.actor === viewer ? t.bookings.timeline.you : t.bookings.timeline.actor[event.actor]} •{' '}
                  {format.dayAndTime(event.at)}
                </span>
                {event.note && (
                  <q className="mt-1 rounded-lg bg-surface-container-low px-space-sm py-1 font-body-sm text-body-sm text-on-surface">
                    {event.note}
                  </q>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
