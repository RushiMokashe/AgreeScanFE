import { useRef, useState } from 'react'
import { useToast } from '../../components/toast/toast-context'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { Cart, CartItem } from '../../lib/types'

/** The cart after checkout: the order took every item. */
const EMPTY_CART: Cart = { items: [], itemCount: 0, total: 0, freeDelivery: false, summary: '' }

/**
 * The farmer's cart. Every cart endpoint returns the whole updated cart, which replaces the loaded one.
 * Requests are queued so they reach the server one at a time: each response then includes every earlier
 * change, and a late response can never overwrite a newer cart.
 */
export function useCart() {
  const { t } = useI18n()
  const toast = useToast()
  const { data, error: loadError, reload, setData } = useApi(() => api.cart())
  // Short name of the product added last; the cart bar shows it until the cart changes some other way.
  const [lastAdded, setLastAdded] = useState<string>()
  const queue = useRef<Promise<unknown>>(Promise.resolve())

  const enqueue = <T>(request: () => Promise<T>): Promise<T> => {
    const response = queue.current.then(request)
    queue.current = response.catch(() => undefined)
    return response
  }

  /** Adds one of the product; resolves to whether it was added. */
  const add = async (productId: number): Promise<boolean> => {
    try {
      const cart = await enqueue(() => api.addToCart(productId))
      const added = cart.items.find((item) => item.productId === productId)
      setData(cart)
      setLastAdded(added?.shortName)
      toast.show(added ? t.store.cart.added(added.shortName) : t.store.cart.addedToCart)
      return true
    } catch (error) {
      toast.show(describeError(error, t.store.cart.updateFailed), 'error')
      return false
    }
  }

  /** Removes the line; resolves to the updated cart, or undefined if the removal failed. */
  const remove = async (item: CartItem): Promise<Cart | undefined> => {
    try {
      const cart = await enqueue(() => api.removeFromCart(item.id))
      setData(cart)
      setLastAdded(undefined)
      toast.show(t.store.cart.removed(item.shortName), 'info')
      return cart
    } catch (error) {
      toast.show(describeError(error, t.store.cart.updateFailed), 'error')
      return undefined
    }
  }

  /** Places a Cash-on-Delivery order for the whole cart; resolves to whether it was placed. */
  const checkout = async (): Promise<boolean> => {
    try {
      const order = await enqueue(() => api.checkout({ paymentMethod: 'CASH_ON_DELIVERY' }))
      setData(EMPTY_CART)
      setLastAdded(undefined)
      toast.show(order.message)
      return true
    } catch (error) {
      toast.show(describeError(error, t.store.cart.orderFailed), 'error')
      return false
    }
  }

  return { data, error: loadError, reload, lastAdded, add, remove, checkout }
}
