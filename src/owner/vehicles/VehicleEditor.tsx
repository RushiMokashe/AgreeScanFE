import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Field } from '../../components/form/Field'
import { FormError } from '../../components/form/FormError'
import { SubmitButton } from '../../components/form/SubmitButton'
import { TextField } from '../../components/form/TextField'
import { INPUT_CLASSES } from '../../components/form/field-styles'
import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { useFormat } from '../../i18n/useFormat'
import { api, describeError } from '../../lib/api'
import type { OwnerListing, RateUnit, RentalCategory, RentalHubOption } from '../../lib/types'
import { FeaturesEditor } from './FeaturesEditor'
import { LocalizedTextInput } from './LocalizedTextInput'
import { PhotoPicker } from './PhotoPicker'
import { SpecsEditor } from './SpecsEditor'
import {
  MAX_RATE,
  VEHICLE_ICONS,
  hasTranslations,
  toListingInput,
  validateVehicleForm,
  type VehicleForm,
  type VehicleFormErrors,
} from './vehicle-form'

const CATEGORIES: readonly RentalCategory[] = ['MACHINERY', 'TRANSPORT']
const RATE_UNITS: readonly RateUnit[] = ['HOUR', 'KM', 'DAY']
const VEHICLES_PATH = '/owner/vehicles'

interface VehicleEditorProps {
  initial: VehicleForm
  hubs: RentalHubOption[]
  /** The photo the vehicle shows now, when editing. */
  imageUrl: string | null
  /** The vehicle being edited; a new one is created when absent. */
  listingId?: number
}

/**
 * Adds or edits a vehicle: what farmers see in English (required) and, optionally, Marathi and Hindi, the rate, the
 * card's photo or icon, specs and features, and whether it takes bookings now.
 */
export function VehicleEditor({ initial, hubs, imageUrl, listingId }: VehicleEditorProps) {
  const { t } = useI18n()
  const format = useFormat()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [photo, setPhoto] = useState<File | null>(null)
  const [translations, setTranslations] = useState(() => hasTranslations(initial))
  const [errors, setErrors] = useState<VehicleFormErrors>({})
  const [formError, setFormError] = useState<string>()
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) => setForm((current) => ({ ...current, [key]: value }))

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateVehicleForm(form, t, format)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setFormError(t.owner.form.fixErrors)
      return
    }
    setFormError(undefined)
    setSaving(true)
    let saved: OwnerListing
    try {
      const input = toListingInput(form)
      saved = listingId ? await api.owner.updateListing(listingId, input) : await api.owner.createListing(input)
    } catch (error) {
      setFormError(describeError(error, t.common.errors.unexpected))
      setSaving(false)
      return
    }
    try {
      if (photo) await api.owner.uploadListingPhoto(saved.id, photo)
      toast.show(listingId ? t.owner.form.saved : t.owner.form.created)
      navigate(VEHICLES_PATH)
    } catch (error) {
      // The vehicle is saved; only its photo is missing. Its edit screen lets the owner try the photo again.
      toast.show(describeError(error, t.owner.form.photo.failed), 'error')
      navigate(`${VEHICLES_PATH}/${saved.id}`, { replace: true })
      setSaving(false)
    }
  }

  return (
    <form noValidate onSubmit={(event) => void save(event)} className="flex flex-col gap-space-md">
      <fieldset className="flex flex-col gap-space-xs">
        <legend className="mb-space-xs font-label-md text-label-md text-on-surface">{t.owner.form.category}</legend>
        <div className="grid grid-cols-2 gap-space-xs">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={form.category === category}
              onClick={() => set('category', category)}
              className={`min-h-[52px] rounded-xl border px-space-sm font-label-md text-label-md transition-colors ${
                form.category === category
                  ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                  : 'border-outline-variant bg-surface-container-lowest text-on-surface'
              }`}
            >
              {t.owner.form.categories[category]}
            </button>
          ))}
        </div>
      </fieldset>

      <Field label={t.owner.form.hub}>
        {(control) => (
          <select
            {...control}
            value={form.hubId}
            onChange={(event) => set('hubId', Number(event.target.value))}
            className={INPUT_CLASSES}
          >
            {hubs.map((hub) => (
              <option key={hub.id} value={hub.id}>
                {hub.name}
              </option>
            ))}
          </select>
        )}
      </Field>

      <button
        type="button"
        aria-expanded={translations}
        onClick={() => setTranslations((open) => !open)}
        className="flex min-h-[48px] items-center gap-space-xs rounded-xl bg-secondary-container/50 px-space-md text-left font-label-md text-label-md text-on-surface"
      >
        <Icon name="translate" className="text-[20px] text-secondary" />
        <span className="flex-1">{translations ? t.owner.form.translations.hide : t.owner.form.translations.show}</span>
        <Icon name={translations ? 'expand_less' : 'expand_more'} className="text-[20px]" />
      </button>
      {translations && (
        <p className="-mt-space-sm font-body-sm text-body-sm text-on-surface-variant">{t.owner.form.translations.hint}</p>
      )}

      <LocalizedTextInput
        label={t.owner.form.name}
        hint={t.owner.form.nameHint}
        error={errors.name}
        value={form.name}
        onChange={(name) => set('name', name)}
        translations={translations}
      />
      <LocalizedTextInput
        label={t.owner.form.description}
        hint={t.owner.form.descriptionHint}
        error={errors.description}
        value={form.description}
        onChange={(description) => set('description', description)}
        translations={translations}
      />

      <div className="grid grid-cols-2 gap-space-sm">
        <TextField
          label={t.owner.form.rate}
          error={errors.rate}
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_RATE}
          value={form.rate}
          onChange={(event) => set('rate', event.target.value)}
        />
        <Field label={t.owner.form.rateUnit}>
          {(control) => (
            <select
              {...control}
              value={form.rateUnit}
              onChange={(event) => set('rateUnit', event.target.value as RateUnit)}
              className={INPUT_CLASSES}
            >
              {RATE_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {t.owner.form.rateUnits[unit]}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>
      <LocalizedTextInput
        label={t.owner.form.rateNote}
        hint={t.owner.form.rateNoteHint}
        value={form.rateNote}
        onChange={(rateNote) => set('rateNote', rateNote)}
        translations={translations}
      />
      <LocalizedTextInput
        label={t.owner.form.availability}
        hint={t.owner.form.availabilityHint}
        error={errors.availability}
        value={form.availability}
        onChange={(availability) => set('availability', availability)}
        translations={translations}
      />

      <PhotoPicker currentUrl={imageUrl} onChange={setPhoto} />
      <Field label={t.owner.form.icon} hint={t.owner.form.iconHint}>
        {(control) => (
          <select
            {...control}
            value={form.icon ?? ''}
            onChange={(event) => set('icon', event.target.value || null)}
            className={INPUT_CLASSES}
          >
            <option value="">{t.owner.form.defaultIcon}</option>
            {VEHICLE_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {t.owner.form.vehicleIcons[icon]}
              </option>
            ))}
          </select>
        )}
      </Field>

      <SpecsEditor
        specs={form.specs}
        onChange={(specs) => set('specs', specs)}
        translations={translations}
        invalidRows={errors.rows}
      />
      <FeaturesEditor
        features={form.features}
        onChange={(features) => set('features', features)}
        translations={translations}
        invalidRows={errors.rows}
      />

      <label className="flex min-h-[56px] cursor-pointer items-center justify-between gap-space-sm rounded-xl bg-surface-container-lowest px-space-md shadow-sm">
        <span className="flex flex-col">
          <span className="font-label-lg text-label-lg text-on-surface">{t.owner.form.online}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">{t.owner.form.onlineHint}</span>
        </span>
        <input
          type="checkbox"
          role="switch"
          checked={form.online}
          onChange={(event) => set('online', event.target.checked)}
          className="h-6 w-6 accent-primary"
        />
      </label>

      {formError && <FormError message={formError} />}
      <SubmitButton busy={saving} busyLabel={t.owner.form.saving} icon="save">
        {listingId ? t.owner.form.save : t.owner.form.create}
      </SubmitButton>
    </form>
  )
}
