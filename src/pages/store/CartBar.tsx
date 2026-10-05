import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { Cart } from '../../lib/types'

interface CartBarProps {
  cart: Cart
  /** Short name of the product added last, shown in place of the cart summary. */
  lastAdded: string | undefined
  /** Briefly true after an add, when the bar pops to catch the eye. */
  bumped: boolean
  onViewCart: () => void
}

/**
 * Cart total and "View Cart", sticking 72px above the bottom of the screen (just over the 64px bottom
 * navigation, plus the safe area) while the store scrolls beneath it.
 */
export function CartBar({ cart, lastAdded, bumped, onViewCart }: CartBarProps) {
  const { t } = useI18n()
  const format = useFormat()

  return (
    <div className="sticky bottom-[calc(72px_+_env(safe-area-inset-bottom,0px))] z-40 px-margin mt-4">
      <div
        className={`bg-surface-container-lowest rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-3 transition-transform ${
          bumped ? 'scale-[1.02]' : ''
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
            <Icon name="shopping_bag" className="text-[24px]" />
            <span className="absolute -top-1.5 -right-1.5 min-w-6 h-6 px-1 rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold flex items-center justify-center shadow-xs">
              <span className="sr-only">{t.store.cart.countLabel} </span>
              {cart.itemCount}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-sm text-headline-sm font-bold text-primary">{format.inr(cart.total)}</span>
              {cart.freeDelivery && (
                <span className="font-label-sm text-label-sm text-secondary font-semibold">
                  {t.store.cart.freeDelivery}
                </span>
              )}
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
              {lastAdded ? t.store.cart.lastAdded(lastAdded) : cart.summary}
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={onViewCart}
          className="min-h-[48px] px-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 flex-shrink-0 shadow-md active:scale-95 transition-transform"
        >
          <span>{t.store.cart.view}</span>
          <Icon name="arrow_forward" className="text-[18px]" />
        </button>
      </div>
    </div>
  )
}
