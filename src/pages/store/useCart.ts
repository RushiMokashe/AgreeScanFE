import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '../../components/toast/toast-context'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api, ApiError, describeError } from '../../lib/api'
import type { Cart, CartItem, OrderConfirmation, PaymentMethod } from '../../lib/types'
import { usePayNow } from '../payments/usePayNow'

/** The server's code for a product of another shop than the cart's. */
const OTHER_SHOP = 'store.cart.other-shop'

/** The cart after checkout: the order took every item. */
const EMPTY_CART: Cart = { items: [], itemCount: 0, total: 0, freeDelivery: false, summary: '', shopId: null, shopName: null }

/**
 * The farmer's cart. Every cart endpoint returns the whole updated cart, which replaces the loaded one.
 * Requests are queued so they reach the server one at a time: each response then includes every earlier
 * change, and a late response can never overwrite a newer cart.
 */
export function useCart() {
  const { t } = useI18n()
  const toast = useToast()
  const navigate = useNavigate()
  const { payNow } = usePayNow()
  const { data, error: loadError, reload, setData } = useApi(() => api.cart())
  // Short name of the product added last; the cart bar shows it until the cart changes some other way.
  const [lastAdded, setLastAdded] = useState<string>()
  const queue = useRef<Promise<unknown>>(Promise.resolve())
  const [replacement, setReplacement] = useState<{ productId: number; question: string } | null>(null)
  const [replacing, setReplacing] = useState(false)

  const enqueue = <T>(request: () => Promise<T>): Promise<T> => {
    const response = queue.current.then(request)
    queue.current = response.catch(() => undefined)
    return response
  }

  /**
   * Adds one of the product; resolves to whether it was added. A cart holds one shop's products, so a product of
   * another shop is not added yet: `replacement` then asks the farmer whether to empty the cart for it.
   */
  const add = async (productId: number, replaceCart = false): Promise<boolean> => {
    try {
      const cart = await enqueue(() => api.addToCart(productId, replaceCart))
      const added = cart.items.find((item) => item.productId === productId)
      setData(cart)
      setLastAdded(added?.shortName)
      toast.show(added ? t.store.cart.added(added.shortName) : t.store.cart.addedToCart)
      return true
    } catch (error) {
      if (error instanceof ApiError && error.code === OTHER_SHOP) setReplacement({ productId, question: error.message })
      else toast.show(describeError(error, t.store.cart.updateFailed), 'error')
      return false
    }
  }

  /** The farmer agreed: the cart is emptied and the other shop's product added. */
  const replaceCart = async (): Promise<boolean> => {
    if (!replacement) return false
    setReplacing(true)
    const added = await add(replacement.productId, true)
    setReplacing(false)
    setReplacement(null)
    return added
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

  /**
   * Orders the whole cart; resolves to whether the order was placed. A cash-on-delivery order is done; an online
   * one goes on to its payment, or to My Orders (where it can be paid later) if the payment cannot start.
   */
  const checkout = async (method: PaymentMethod): Promise<boolean> => {
    let order: OrderConfirmation
    try {
      order = await enqueue(() => api.checkout({ paymentMethod: method }))
    } catch (error) {
      toast.show(describeError(error, t.store.cart.orderFailed), 'error')
      return false
    }
    setData(EMPTY_CART)
    setLastAdded(undefined)
    if (method === 'CASH_ON_DELIVERY') {
      toast.show(order.message)
      return true
    }
    const opened = await payNow(
      { purpose: 'STORE_ORDER', referenceId: order.orderId },
      () => t.store.cart.paymentNotStarted,
    )
    if (!opened) navigate('/orders')
    return true
  }

  return {
    data,
    error: loadError,
    reload,
    lastAdded,
    add,
    remove,
    checkout,
    /** A product of another shop waiting for the farmer's answer, with the server's question. */
    replacement,
    replacing,
    replaceCart,
    keepCart: () => setReplacement(null),
  }
}
