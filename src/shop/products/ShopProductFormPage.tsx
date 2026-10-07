import { useParams } from 'react-router'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useApi } from '../../hooks/useApi'
import { useI18n } from '../../i18n/i18n-context'
import { api } from '../../lib/api'
import { newProductForm, productFormOf } from './product-form'
import { ShopProductEditor } from './ShopProductEditor'

/** Adds a product (/shop/products/new) or edits one (/shop/products/:id). */
export default function ShopProductFormPage() {
  const { id } = useParams()
  return (
    <div className="px-margin py-space-sm">
      {id ? <EditProduct productId={Number(id)} /> : <ShopProductEditor initial={newProductForm()} imageUrl={null} />}
    </div>
  )
}

function EditProduct({ productId }: { productId: number }) {
  const { t } = useI18n()
  const { data: product, error, reload } = useApi(() => api.shop.product(productId), [productId])

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!product) return <LoadingState label={t.shop.form.loading} />
  return <ShopProductEditor initial={productFormOf(product)} productId={product.id} imageUrl={product.imageUrl} />
}
