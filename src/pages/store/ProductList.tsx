import type { Product } from '../../lib/types'
import { ProductCard } from './ProductCard'

interface ProductListProps {
  products: Product[]
  onAdd: (productId: number) => Promise<boolean>
}

/** Product cards, one under the other. */
export function ProductList({ products, onAdd }: ProductListProps) {
  return (
    <ul className="flex flex-col gap-3.5 mb-1">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} onAdd={onAdd} />
        </li>
      ))}
    </ul>
  )
}
