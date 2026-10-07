import { useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import type { Messages } from '../../i18n/translation'
import { useFormat } from '../../i18n/useFormat'
import type { RxBundle } from '../../lib/types'
import { apiUrl } from '../../platform/api-base'
import { diagnosisPath, savingPercent } from './store-utils'
import { useTimedFlag } from './useTimedFlag'

/** How long the button confirms the add before it settles on "In Cart". */
const ADDED_CONFIRMATION_MS = 2000

const CONFIRMED_TONE = 'bg-primary-fixed text-on-primary-fixed'

type AddPhase = 'add' | 'added' | 'inCart'

interface AddPhaseStyle {
  icon: string
  tone: string
  label: (t: Messages, price: string) => string
}

/** The design's addBundleToCart() states: add, a brief confirmation, then "In Cart". */
const ADD_PHASES = {
  add: {
    icon: 'add_shopping_cart',
    tone: 'bg-secondary-container text-on-secondary-container',
    label: (t, price) => t.store.rx.add(price),
  },
  added: { icon: 'check_circle', tone: CONFIRMED_TONE, label: (t, price) => t.store.rx.added(price) },
  inCart: { icon: 'done', tone: CONFIRMED_TONE, label: (t) => t.store.rx.inCart },
} satisfies Record<AddPhase, AddPhaseStyle>

interface RxBundleBannerProps {
  bundle: RxBundle
  /** The bundle is in the cart right now. */
  inCart: boolean
  /** Adds the product to the cart; resolves to whether it was added. */
  onAdd: (productId: number) => Promise<boolean>
}

/** The doctor's prescription from the latest diagnosis, one tap away from the cart. */
export function RxBundleBanner({ bundle, inCart, onAdd }: RxBundleBannerProps) {
  const { t } = useI18n()
  const format = useFormat()
  const [adding, setAdding] = useState(false)
  const [addedThisVisit, setAddedThisVisit] = useState(false)
  const [justAdded, confirmAdded] = useTimedFlag(ADDED_CONFIRMATION_MS)
  const price = format.inr(bundle.price)
  const saving = savingPercent(bundle.price, bundle.mrp)
  // "In Cart" only after adding it here, and only while it stays in the cart.
  const phase: AddPhase = justAdded ? 'added' : addedThisVisit && inCart ? 'inCart' : 'add'
  const { icon, tone, label } = ADD_PHASES[phase]

  const add = async () => {
    setAdding(true)
    const added = await onAdd(bundle.productId)
    setAdding(false)
    if (!added) return
    setAddedThisVisit(true)
    confirmAdded()
  }

  return (
    <section className="px-margin my-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-tertiary text-on-primary p-4 shadow-md">
        <div className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none text-on-primary">
          <Icon name="spa" className="text-[140px]" />
        </div>
        {/* ::after widens the small pills' tap targets */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <Link
            to={diagnosisPath(bundle.scanId)}
            className="relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold uppercase tracking-wider active:scale-95 transition-transform after:absolute after:-inset-x-1 after:-inset-y-3"
          >
            <Icon name="verified" className="text-[14px]" />
            <span>{bundle.label}</span>
          </Link>
          <Link
            to="/treatment"
            className="relative font-label-sm text-label-sm text-secondary-fixed bg-surface-container-highest/20 px-2 py-0.5 rounded-md backdrop-blur-sm active:scale-95 transition-transform flex items-center gap-1 after:absolute after:-inset-x-1 after:-inset-y-3"
          >
            <span>{t.store.rx.prescribed(format.timeAgo(bundle.prescribedAt))}</span>
            <Icon name="arrow_forward" className="text-[14px]" />
          </Link>
        </div>
        <div className="flex gap-3 my-2">
          <div className="w-20 h-20 rounded-xl bg-surface-container-lowest p-1 flex-shrink-0 overflow-hidden relative shadow-sm">
            <img className="w-full h-full object-cover rounded-lg" src={apiUrl(bundle.imageUrl)} alt={bundle.name} />
            <div className="absolute top-1 left-1 bg-primary text-on-primary rounded text-[9px] font-bold px-1 py-0.5 leading-none">
              {t.store.rx.badge}
            </div>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-primary leading-tight truncate">
              {bundle.name}
            </h2>
            <p className="font-body-sm text-body-sm text-on-primary-container line-clamp-1">{bundle.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-headline-sm text-headline-sm font-bold text-secondary-fixed">{price}</span>
              {saving > 0 && (
                <>
                  <span className="font-label-sm text-label-sm line-through text-on-primary/60">
                    {format.inr(bundle.mrp)}
                  </span>
                  <span className="font-label-sm text-label-sm font-bold px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed leading-none">
                    {t.store.rx.save(saving)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 pt-2 text-on-primary/90 font-label-sm text-label-sm border-t border-on-primary/10">
          <div className="flex items-center gap-1">
            <Icon name="eco" className="text-[16px] text-tertiary-fixed" />
            <span>{bundle.genuineLabel}</span>
          </div>
          <span aria-hidden="true">•</span>
          <div className="flex items-center gap-1 text-tertiary-fixed font-semibold">
            <Icon name="account_balance" className="text-[16px]" />
            <span>{bundle.subsidyLabel}</span>
          </div>
        </div>
        <button
          type="button"
          disabled={adding}
          aria-busy={adding}
          onClick={add}
          className={`w-full mt-3 min-h-[48px] rounded-xl ${tone} font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-transform`}
        >
          <Icon name={adding ? 'progress_activity' : icon} className={`text-[20px] ${adding ? 'animate-spin' : ''}`} />
          <span>{label(t, price)}</span>
        </button>
      </div>
    </section>
  )
}
