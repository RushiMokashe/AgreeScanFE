import { useId, useRef, useState } from 'react'
import { Icon } from '../../components/Icon'
import { useModalFocus } from '../../hooks/useModalFocus'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { Cart, CartItem, PaymentMethod } from '../../lib/types'
import { CartItemRow } from './CartItemRow'
import { PaymentMethodPicker } from './PaymentMethodPicker'
import { PAYMENT_METHODS } from './store-utils'

interface CartSheetProps {
  cart: Cart
  /** Removes a line; resolves to the updated cart, or undefined if the removal failed. */
  onRemove: (item: CartItem) => Promise<Cart | undefined>
  /** Places the order, paid as chosen; resolves to whether it was placed. */
  onCheckout: (method: PaymentMethod) => Promise<boolean>
  onClose: () => void
}

/**
 * The cart as a bottom sheet docked on top of the bottom navigation. Its scrim (z-45) covers the store and
 * the sticky cart bar (z-40), while the app header and navigation (z-50) and toasts (z-60) stay on top.
 * It closes on Escape, a tap on the scrim, the close button, an order placed, or its last item removed.
 */
export function CartSheet({ cart, onRemove, onCheckout, onClose }: CartSheetProps) {
  const { t } = useI18n()
  const format = useFormat()
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [method, setMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0])
  const [placing, setPlacing] = useState(false)
  useModalFocus(sheetRef, onClose)

  const remove = async (item: CartItem) => {
    const updated = await onRemove(item)
    if (updated?.itemCount === 0) onClose()
  }

  const placeOrder = async () => {
    setPlacing(true)
    const placed = await onCheckout(method)
    setPlacing(false)
    if (placed) onClose()
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[45] bg-inverse-surface/40 touch-none transition-opacity duration-200 starting:opacity-0"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fixed inset-x-0 bottom-[calc(4rem_+_env(safe-area-inset-bottom,0px))] z-[46] mx-auto max-w-md max-h-[calc(100dvh_-_9rem)] flex flex-col rounded-t-2xl bg-surface-container-lowest shadow-xl outline-none transition-transform duration-200 ease-out starting:translate-y-full"
      >
        <div className="flex items-center justify-between gap-space-sm px-margin pt-space-md pb-space-sm">
          <div>
            <h2 id={titleId} className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {t.store.cart.title}
            </h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {t.store.cart.itemCount(cart.itemCount)}
            </p>
          </div>
          <button
            type="button"
            aria-label={t.store.cart.close}
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-surface-container text-on-surface flex items-center justify-center flex-shrink-0 active:bg-surface-container-high"
          >
            <Icon name="close" className="text-[22px]" />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto overscroll-contain px-margin divide-y divide-surface-container-high">
          {cart.items.map((item) => (
            <CartItemRow key={item.id} item={item} onRemove={remove} />
          ))}
        </ul>
        <div className="flex flex-col gap-space-sm px-margin pt-space-sm pb-space-md border-t border-surface-container-high">
          <div className="flex items-center justify-between gap-space-sm">
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg text-on-surface">{t.store.cart.total}</span>
              {cart.freeDelivery && (
                <span className="font-label-sm text-label-sm text-secondary font-semibold">
                  {t.store.cart.freeDelivery}
                </span>
              )}
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-primary">{format.inr(cart.total)}</span>
          </div>
          <PaymentMethodPicker value={method} onChange={setMethod} disabled={placing} />
          <button
            type="button"
            disabled={placing}
            aria-busy={placing}
            onClick={placeOrder}
            className="w-full min-h-[52px] rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-transform disabled:opacity-70"
          >
            <Icon
              name={placing ? 'progress_activity' : method === 'ONLINE' ? 'lock' : 'payments'}
              className={`text-[20px] ${placing ? 'animate-spin' : ''}`}
            />
            <span>{t.store.cart.placeOrder[method](format.inr(cart.total))}</span>
          </button>
        </div>
      </div>
    </>
  )
}
