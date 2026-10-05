import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { BuyerInquiry } from '../../lib/types'
import { InquiryActionButton } from './InquiryActionButton'

interface InquiryCardProps {
  inquiry: BuyerInquiry
  /** This inquiry's response is being submitted. */
  pending: boolean
  /** A response is being submitted, here or on another inquiry. */
  disabled: boolean
  onRespond: (inquiry: BuyerInquiry) => void
}

/** A buyer's purchase order: volume, offered price, grade specs and the farmer's response. */
export function InquiryCard({ inquiry, pending, disabled, onRespond }: InquiryCardProps) {
  const { t } = useI18n()
  const format = useFormat()
  const {
    buyerName,
    verified,
    subtitle,
    icon,
    badge,
    badgeHighlighted,
    volumeTonnes,
    produce,
    priceLabel,
    pricePerQuintal,
    priceNote,
    priceNoteHighlighted,
    highlighted,
    specsTitle,
    specs,
    footerIcon,
    footerText,
  } = inquiry

  return (
    <article className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
      <div className="p-space-md">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
              <Icon name={icon} className="text-primary text-[26px]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-title-md text-title-md font-bold text-on-surface">{buyerName}</h3>
                {verified && (
                  <>
                    <Icon name="verified" className="text-secondary text-[18px]" />
                    <span className="sr-only">{t.mandi.inquiries.verifiedBuyer}</span>
                  </>
                )}
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{subtitle}</span>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded ${
              badgeHighlighted ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface'
            } font-label-sm text-label-sm font-bold whitespace-nowrap`}
          >
            {badge}
          </span>
        </div>
        <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-low grid grid-cols-2 gap-space-sm">
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant block">
              {t.mandi.inquiries.volume}
            </span>
            <span className="font-body-md text-body-md font-bold text-on-surface">
              {t.mandi.units.tonnes(volumeTonnes)}
            </span>
            <span
              className={`font-label-sm text-label-sm ${highlighted ? 'text-primary font-semibold' : 'text-on-surface-variant'} block`}
            >
              {produce}
            </span>
          </div>
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant block">{priceLabel}</span>
            <span className={`font-title-md text-title-md font-bold ${highlighted ? 'text-primary' : 'text-on-surface'}`}>
              {t.mandi.units.perQuintal(format.inr(pricePerQuintal))}
            </span>
            <span
              className={`font-label-sm text-label-sm block ${
                priceNoteHighlighted ? 'text-secondary font-semibold' : 'text-on-surface-variant'
              }`}
            >
              {priceNote}
            </span>
          </div>
        </div>
        {specs.length > 0 && (
          <div className="mt-space-sm">
            {specsTitle && (
              <span className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                {specsTitle}
              </span>
            )}
            <ul className="flex flex-wrap gap-1.5">
              {specs.map((spec) => (
                <li
                  key={spec}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface"
                >
                  <Icon name="check_circle" className="text-[14px] text-secondary" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-space-md flex items-center justify-between gap-space-sm pt-space-xs">
          <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
            <Icon name={footerIcon} className="text-[18px]" />
            <span>{footerText}</span>
          </div>
          <InquiryActionButton inquiry={inquiry} pending={pending} disabled={disabled} onRespond={onRespond} />
        </div>
      </div>
    </article>
  )
}
