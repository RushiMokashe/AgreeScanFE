import { useState } from 'react'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import type { CartItem } from '../../lib/types'

interface CartItemRowProps {
  item: CartItem
  onRemove: (item: CartItem) => Promise<void>
}

/** A cart line: product, quantity × unit price, line total, and remove. */
export function CartItemRow({ item, onRemove }: CartItemRowProps) {
  const { t } = useI18n()
  const format = useFormat()
  const [removing, setRemoving] = useState(false)

  const remove = async () => {
    setRemoving(true)
    await onRemove(item)
    setRemoving(false)
  }

  return (
    <li className="flex items-center gap-3 py-3">
      <div className="flex-1 min-w-0">
        <p className="font-label-lg text-label-lg text-on-surface truncate">{item.name}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {item.quantity} × {format.inr(item.unitPrice)}
        </p>
      </div>
      <span className="font-title-md text-title-md font-bold text-on-surface">{format.inr(item.lineTotal)}</span>
      <button
        type="button"
        aria-label={t.store.cart.remove(item.name)}
        aria-busy={removing}
        disabled={removing}
        onClick={remove}
        className="w-11 h-11 rounded-full text-error flex items-center justify-center flex-shrink-0 active:bg-error-container disabled:opacity-60"
      >
        <Icon name={removing ? 'progress_activity' : 'delete'} className={`text-[22px] ${removing ? 'animate-spin' : ''}`} />
      </button>
    </li>
  )
}
