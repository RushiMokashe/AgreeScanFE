import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'

/** The desk's toll-free number as printed, and as dialled (FARM is 3276 on a phone keypad). */
const MANDI_DESK_NUMBER = '1800-200-FARM'
const MANDI_DESK_TEL = 'tel:18002003276'

/** The 24x7 Kisan Mandi Desk for urgent harvest transport (static copy from the design). */
export function MandiDeskCard() {
  const { t } = useI18n()
  const desk = t.rentals.mandiDesk

  return (
    <section className="px-margin mb-space-lg">
      <div className="bg-primary text-on-primary p-space-md rounded-xl flex items-center justify-between gap-space-sm shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-on-primary-container text-on-tertiary-fixed flex items-center justify-center flex-shrink-0">
            <Icon name="support_agent" className="text-[26px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-[11px] text-primary-fixed uppercase tracking-wider font-bold">
              {desk.name}
            </span>
            <span className="font-title-md text-title-md text-on-primary font-bold">{desk.title}</span>
            <span className="font-body-sm text-[12px] text-surface-container-high">
              {desk.tollFree} <span className="whitespace-nowrap">{MANDI_DESK_NUMBER}</span>
            </span>
          </div>
        </div>
        <a
          href={MANDI_DESK_TEL}
          aria-label={desk.callLabel}
          className="min-h-[48px] px-space-md rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md flex items-center justify-center gap-1 shadow-sm flex-shrink-0 active:bg-secondary-container"
        >
          <Icon name="call" className="text-[18px]" />
          <span>{desk.call}</span>
        </a>
      </div>
    </section>
  )
}
