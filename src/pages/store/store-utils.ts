import type { Cart, ProductCategory, Tone } from '../../lib/types'

/** Chip beside the pack size: "Blight Tolerant" (success), "Systemic Fungicide" (neutral), a Hindi claim (warning). */
export const TAG_TONES = {
  success: 'bg-secondary-container text-on-secondary-container',
  neutral: 'bg-surface-container-high text-on-surface',
  warning: 'bg-tertiary-fixed/50 text-on-tertiary-fixed',
  error: 'bg-error-container text-on-error-container',
} as const satisfies Record<Tone, string>

/** Note after the price: "In Stock" in green, "Only 4 Left" in red. */
export const STOCK_TONES = {
  success: 'text-secondary',
  neutral: 'text-on-surface-variant',
  warning: 'text-on-surface-variant',
  error: 'text-error',
} as const satisfies Record<Tone, string>

interface FooterStyle {
  text: string
  /** Icon colour; empty when the icon shares the text colour. */
  icon: string
}

/** Delivery or dosage line at the foot of a product card. */
export const FOOTER_TONES = {
  neutral: { text: 'text-on-surface-variant', icon: 'text-primary' },
  success: { text: 'text-secondary font-semibold', icon: '' },
  warning: { text: 'text-on-surface-variant', icon: 'text-tertiary' },
  error: { text: 'text-error', icon: '' },
} as const satisfies Record<Tone, FooterStyle>

/** Corner of the product photo a badge sits in; the bottom corner also holds the rating. */
type PhotoCorner = 'top' | 'bottom'

interface ImageBadgeStyle {
  corner: PhotoCorner
  className: string
}

/** Badge on a product photo: offers ("28% OFF") at the top in red, seals ("Vet Seal") at the bottom. */
export const IMAGE_BADGE_TONES = {
  error: { corner: 'top', className: 'bg-error text-on-error text-[10px] px-1.5 py-0.5' },
  success: {
    corner: 'bottom',
    className: 'bg-tertiary-fixed text-on-tertiary-fixed text-[9px] px-1 py-0.5 leading-none',
  },
  neutral: {
    corner: 'top',
    className: 'bg-surface-container-lowest/90 backdrop-blur-sm text-primary text-[10px] px-1.5 py-0.5',
  },
  warning: {
    corner: 'top',
    className: 'bg-surface-container-lowest/90 backdrop-blur-sm text-primary text-[10px] px-1.5 py-0.5',
  },
} as const satisfies Record<Tone, ImageBadgeStyle>

interface DepartmentStyle {
  icon: string
  badge: string
}

/** Department tiles: icon colour and badge chip per category. */
export const DEPARTMENT_STYLES = {
  CROP_MEDICINE: { icon: 'text-primary', badge: 'text-primary bg-primary-fixed/40' },
  SEEDS: { icon: 'text-secondary', badge: 'text-secondary bg-secondary-fixed/40' },
  TOOLS: { icon: 'text-outline', badge: 'text-on-surface-variant bg-surface-container-high' },
  DAIRY: { icon: 'text-primary', badge: 'text-tertiary bg-tertiary-fixed/40' },
} as const satisfies Record<ProductCategory, DepartmentStyle>

/** Whole-percent saving on the MRP: ₹420 against ₹530 -> 21. Zero when there is no saving. */
export function savingPercent(price: number, mrp: number): number {
  return mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0
}

/** The scan a prescription was made for, or the latest diagnosis when it has none. */
export function diagnosisPath(scanId: number | null): string {
  return scanId === null ? '/diagnosis' : `/diagnosis/${scanId}`
}

export function isInCart(cart: Cart, productId: number): boolean {
  return cart.items.some((item) => item.productId === productId)
}

/** Smooth scrolling, unless the device asks for reduced motion. */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}
