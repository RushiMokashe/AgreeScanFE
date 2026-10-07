import { EMPTY_DRAFT, fromDraft, fromOptionalDraft, toDraft, type LocalizedDraft } from '../../lib/localized-draft'
import type { ProductCategory, ShopProduct, ShopProductInput } from '../../lib/types'

/** Highest price or MRP the server takes, in rupees (Product.MAX_PRICE). */
export const MAX_PRICE = 1_000_000

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = ['CROP_MEDICINE', 'SEEDS', 'TOOLS', 'DAIRY']

/** A product being added or edited; prices stay text while they are typed. */
export interface ProductForm {
  name: LocalizedDraft
  category: ProductCategory
  packSize: LocalizedDraft
  description: LocalizedDraft
  price: string
  mrp: string
  inStock: boolean
  barcode: string
}

export function newProductForm(): ProductForm {
  return {
    name: EMPTY_DRAFT,
    category: 'CROP_MEDICINE',
    packSize: EMPTY_DRAFT,
    description: EMPTY_DRAFT,
    price: '',
    mrp: '',
    inStock: true,
    barcode: '',
  }
}

export function productFormOf(product: ShopProduct): ProductForm {
  return {
    name: toDraft(product.name),
    category: product.category,
    packSize: toDraft(product.packSize),
    description: toDraft(product.description),
    price: String(product.price),
    mrp: product.mrp === null ? '' : String(product.mrp),
    inStock: product.inStock,
    barcode: product.barcode ?? '',
  }
}

/** Whole rupees from what was typed, or undefined when it is not a whole number from 1 to MAX_PRICE. */
export function rupees(text: string): number | undefined {
  if (!/^\d+$/.test(text.trim())) return undefined
  const value = Number(text.trim())
  return value >= 1 && value <= MAX_PRICE ? value : undefined
}

/** The form as the API takes it; call only once the form has no problems. */
export function toProductInput(form: ProductForm): ShopProductInput {
  return {
    name: fromDraft(form.name),
    category: form.category,
    packSize: fromOptionalDraft(form.packSize),
    description: fromDraft(form.description),
    price: rupees(form.price) ?? 0,
    mrp: form.mrp.trim() ? (rupees(form.mrp) ?? null) : null,
    inStock: form.inStock,
    barcode: form.barcode.trim() || null,
  }
}
