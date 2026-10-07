import { useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useToast } from '../../components/toast/toast-context'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import { inLanguage } from '../../lib/localized-draft'
import type { ShopProduct } from '../../lib/types'
import { ShopProductCard } from './ShopProductCard'

const ADD_BUTTON =
  'flex min-h-[52px] items-center justify-center gap-space-xs rounded-xl bg-primary px-space-lg font-label-lg text-label-lg text-on-primary shadow-sm'

/** The shop's products (/shop/products), newest first, with an in-stock switch on each and a way to add more. */
export default function ShopProductsPage() {
  const { t, lang } = useI18n()
  const toast = useToast()
  const texts = t.shop.products
  const { data: products, error, reload, setData } = useApi(() => api.shop.products())
  const [switchingId, setSwitchingId] = useState<number | null>(null)

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!products) return <LoadingState label={texts.loading} />

  const toggleStock = async (product: ShopProduct) => {
    setSwitchingId(product.id)
    try {
      const updated = await api.shop.setProductStock(product.id, !product.inStock)
      setData((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      const name = inLanguage(updated.name, lang)
      toast.show(updated.inStock ? texts.nowInStock(name) : texts.nowOutOfStock(name), 'info')
    } catch (failure) {
      toast.show(describeError(failure, texts.stockFailed), 'error')
    } finally {
      setSwitchingId(null)
    }
  }

  if (products.length === 0) {
    return (
      <section className="mx-margin my-space-lg flex flex-col items-center gap-space-sm rounded-2xl bg-surface-container-lowest px-space-md py-space-xl text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <Icon name="inventory_2" className="text-[32px]" />
        </div>
        <h1 className="font-title-md text-title-md font-bold text-on-surface">{texts.empty.title}</h1>
        <p className="max-w-sm font-body-sm text-body-sm text-on-surface-variant">{texts.empty.message}</p>
        <Link to="/shop/products/new" className={`mt-space-xs ${ADD_BUTTON}`}>
          <Icon name="add_circle" className="text-[20px]" />
          {texts.empty.add}
        </Link>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-space-sm px-margin py-space-sm">
      <Link to="/shop/products/new" className={ADD_BUTTON}>
        <Icon name="add_circle" className="text-[20px]" />
        {texts.add}
      </Link>
      <ul className="flex flex-col gap-space-sm">
        {products.map((product) => (
          <ShopProductCard
            key={product.id}
            product={product}
            switching={switchingId === product.id}
            onToggleStock={(item) => void toggleStock(item)}
          />
        ))}
      </ul>
    </div>
  )
}
