import type { Messages } from '../../i18n/translation'
import type { Formatter } from '../../lib/format'
import type { OwnerListing, OwnerListingInput, RateUnit, RentalCategory } from '../../lib/types'
import { EMPTY_DRAFT, fromDraft, fromOptionalDraft, toDraft, type LocalizedDraft } from '../../lib/localized-draft'

/** The server's limits on a vehicle (OwnerListingInput in lib/types.ts). */
export const MAX_RATE = 100_000
export const MAX_SPECS = 3
export const MAX_FEATURES = 4

/** Card icons an owner can choose for a vehicle shown without a photo. */
export const VEHICLE_ICONS = ['agriculture', 'local_shipping', 'rv_hookup', 'forklift'] as const
export type VehicleIcon = (typeof VEHICLE_ICONS)[number]

/** Icons of the feature chips, e.g. a badge for "APMC Direct Entry Pass". */
export const FEATURE_ICONS = [
  'badge',
  'layers',
  'verified',
  'alarm',
  'water_drop',
  'local_gas_station',
  'engineering',
  'scale',
] as const
export type FeatureIcon = (typeof FEATURE_ICONS)[number]

export interface SpecDraft {
  /** Keeps a row's inputs in place while rows above it are removed. */
  key: number
  value: LocalizedDraft
  label: LocalizedDraft
}

export interface FeatureDraft {
  key: number
  icon: string
  text: LocalizedDraft
}

/** The vehicle form as typed: numbers stay text until saved, so half-typed values are kept. */
export interface VehicleForm {
  category: RentalCategory
  hubId: number
  name: LocalizedDraft
  description: LocalizedDraft
  /** The card's icon; null for the category's default. */
  icon: string | null
  rate: string
  rateUnit: RateUnit
  rateNote: LocalizedDraft
  availability: LocalizedDraft
  online: boolean
  specs: SpecDraft[]
  features: FeatureDraft[]
}

export interface VehicleFormErrors {
  name?: string
  description?: string
  availability?: string
  rate?: string
  /** Rows missing their English text, by key. */
  rows?: ReadonlySet<number>
}

let lastRowKey = 0
const nextRowKey = () => ++lastRowKey

export function emptySpec(): SpecDraft {
  return { key: nextRowKey(), value: EMPTY_DRAFT, label: EMPTY_DRAFT }
}

export function emptyFeature(): FeatureDraft {
  return { key: nextRowKey(), icon: FEATURE_ICONS[0], text: EMPTY_DRAFT }
}

/** A new vehicle at the owner's own hub, taking bookings as soon as it is saved. */
export function newVehicleForm(hubId: number): VehicleForm {
  return {
    category: 'MACHINERY',
    hubId,
    name: EMPTY_DRAFT,
    description: EMPTY_DRAFT,
    icon: null,
    rate: '',
    rateUnit: 'HOUR',
    rateNote: EMPTY_DRAFT,
    availability: EMPTY_DRAFT,
    online: true,
    specs: [],
    features: [],
  }
}

export function vehicleFormOf(listing: OwnerListing): VehicleForm {
  return {
    category: listing.category,
    hubId: listing.hubId,
    name: toDraft(listing.name),
    description: toDraft(listing.description),
    icon: listing.icon,
    rate: String(listing.rate),
    rateUnit: listing.rateUnit,
    rateNote: toDraft(listing.rateNote),
    availability: toDraft(listing.availability),
    online: listing.online,
    specs: listing.specs.map((spec) => ({ key: nextRowKey(), value: toDraft(spec.value), label: toDraft(spec.label) })),
    features: listing.features.map((feature) => ({ key: nextRowKey(), icon: feature.icon, text: toDraft(feature.text) })),
  }
}

/** Whether any text of the form has a Marathi or Hindi version, so the translations open with it. */
export function hasTranslations(form: VehicleForm): boolean {
  const drafts = [
    form.name,
    form.description,
    form.rateNote,
    form.availability,
    ...form.specs.flatMap((spec) => [spec.value, spec.label]),
    ...form.features.map((feature) => feature.text),
  ]
  return drafts.some((draft) => draft.mr.trim() !== '' || draft.hi.trim() !== '')
}

function parseRate(text: string): number | null {
  const rate = Number(text)
  return Number.isInteger(rate) && rate >= 1 && rate <= MAX_RATE ? rate : null
}

const blank = (draft: LocalizedDraft) => draft.en.trim() === ''

/** What must be fixed before saving; empty when the form can be saved. */
export function validateVehicleForm(form: VehicleForm, t: Messages, format: Formatter): VehicleFormErrors {
  const required = t.owner.form.required
  const rows = new Set([
    ...form.specs.filter((spec) => blank(spec.value) || blank(spec.label)).map((spec) => spec.key),
    ...form.features.filter((feature) => blank(feature.text)).map((feature) => feature.key),
  ])
  const errors: VehicleFormErrors = {
    name: blank(form.name) ? required : undefined,
    description: blank(form.description) ? required : undefined,
    availability: blank(form.availability) ? required : undefined,
    rate: parseRate(form.rate) === null ? t.owner.form.rateInvalid(format.inr(MAX_RATE)) : undefined,
    rows: rows.size > 0 ? rows : undefined,
  }
  return Object.values(errors).some((error) => error !== undefined) ? errors : {}
}

/** The form as the API takes it; call it only once `validateVehicleForm` found nothing to fix. */
export function toListingInput(form: VehicleForm): OwnerListingInput {
  return {
    category: form.category,
    hubId: form.hubId,
    name: fromDraft(form.name),
    description: fromDraft(form.description),
    icon: form.icon,
    rate: Number(form.rate),
    rateUnit: form.rateUnit,
    rateNote: fromOptionalDraft(form.rateNote),
    availability: fromDraft(form.availability),
    online: form.online,
    specs: form.specs.map((spec) => ({ value: fromDraft(spec.value), label: fromDraft(spec.label) })),
    features: form.features.map((feature) => ({ icon: feature.icon, text: fromDraft(feature.text) })),
  }
}
