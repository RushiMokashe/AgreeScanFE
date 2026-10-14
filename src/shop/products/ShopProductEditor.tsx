import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Field } from '../../components/form/Field'
import { FormError } from '../../components/form/FormError'
import { LocalizedTextInput } from '../../components/form/LocalizedTextInput'
import { PhotoPicker } from '../../components/form/PhotoPicker'
import { SubmitButton } from '../../components/form/SubmitButton'
import { TextField } from '../../components/form/TextField'
import { CHECKBOX_CLASSES, INPUT_CLASSES } from '../../components/form/field-styles'
import { useToast } from '../../components/toast/toast-context'
import { useFieldErrors } from '../../hooks/useFieldErrors'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import { checkBarcode, EAN13_LENGTH } from '../../lib/payment-checks'
import type { ProductCategory } from '../../lib/types'
import { PRODUCT_CATEGORIES, rupees, toProductInput, type ProductForm } from './product-form'

interface ShopProductEditorProps {
  initial: ProductForm
  /** The product being edited; a new product when left out. */
  productId?: number
  imageUrl: string | null
}

/**
 * Adds or edits one of the shop's products: name and description (with Marathi and Hindi if the shopkeeper adds them),
 * department, pack size, price and MRP, stock, barcode and photo. Each field shows its problem once it is left, and
 * all of them on save.
 */
export function ShopProductEditor({ initial, productId, imageUrl }: ShopProductEditorProps) {
  const { t } = useI18n()
  const toast = useToast()
  const navigate = useNavigate()
  const texts = t.shop.form
  const errors = texts.errors
  const [form, setForm] = useState(initial)
  const [translations, setTranslations] = useState(Boolean(initial.name.mr || initial.name.hi))
  const [photo, setPhoto] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [failure, setFailure] = useState<string>()
  const formRef = useRef<HTMLFormElement>(null)

  const price = rupees(form.price)
  const mrp = form.mrp.trim() ? rupees(form.mrp) : null
  const barcodeProblem = checkBarcode(form.barcode)
  const fields = useFieldErrors({
    name: form.name.en.trim() ? undefined : errors.nameRequired,
    description: form.description.en.trim() ? undefined : errors.descriptionRequired,
    price: price === undefined ? errors.price : undefined,
    mrp: mrp === undefined ? errors.mrp : mrp !== null && price !== undefined && mrp < price ? errors.mrpBelowPrice : undefined,
    barcode: barcodeProblem && errors.barcode[barcodeProblem],
  })

  const set = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!fields.submit()) {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setSaving(true)
    setFailure(undefined)
    let saved
    try {
      const input = toProductInput(form)
      saved = productId === undefined ? await api.shop.createProduct(input) : await api.shop.updateProduct(productId, input)
    } catch (error) {
      setFailure(describeError(error, texts.failed))
      setSaving(false)
      return
    }
    if (photo) {
      try {
        await api.shop.uploadProductPhoto(saved.id, photo)
      } catch (error) {
        toast.show(describeError(error, texts.photoFailed), 'error')
      }
    }
    toast.show(productId === undefined ? texts.created : texts.saved)
    navigate('/shop/products', { replace: true })
  }

  return (
    <form ref={formRef} noValidate onSubmit={(event) => void save(event)} className="flex flex-col gap-space-md">
      <LocalizedTextInput
        label={texts.name}
        error={fields.errorOf('name')}
        value={form.name}
        onChange={(name) => set('name', name)}
        onBlur={() => fields.touch('name')}
        translations={translations}
      />
      <button
        type="button"
        aria-expanded={translations}
        onClick={() => setTranslations((shown) => !shown)}
        className="self-start min-h-[44px] px-space-xs font-label-md text-label-md text-primary"
      >
        {translations ? texts.translations.hide : texts.translations.show}
      </button>
      {translations && <p className="-mt-space-sm font-body-sm text-body-sm text-on-surface-variant">{texts.translations.hint}</p>}

      <Field label={texts.category}>
        {(control) => (
          <select
            {...control}
            value={form.category}
            onChange={(event) => set('category', event.target.value as ProductCategory)}
            className={INPUT_CLASSES}
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {texts.categories[category]}
              </option>
            ))}
          </select>
        )}
      </Field>

      <LocalizedTextInput
        label={texts.packSize}
        hint={texts.packSizeHint}
        value={form.packSize}
        onChange={(packSize) => set('packSize', packSize)}
        translations={translations}
      />
      <LocalizedTextInput
        label={texts.description}
        hint={texts.descriptionHint}
        error={fields.errorOf('description')}
        value={form.description}
        onChange={(description) => set('description', description)}
        onBlur={() => fields.touch('description')}
        translations={translations}
      />

      <div className="grid grid-cols-2 items-start gap-space-sm">
        <TextField
          label={texts.price}
          error={fields.errorOf('price')}
          inputMode="numeric"
          value={form.price}
          onChange={(event) => set('price', event.target.value.replace(/\D/g, ''))}
          onBlur={() => fields.touch('price')}
        />
        <TextField
          label={texts.mrp}
          hint={texts.mrpHint}
          error={fields.errorOf('mrp')}
          inputMode="numeric"
          value={form.mrp}
          onChange={(event) => set('mrp', event.target.value.replace(/\D/g, ''))}
          onBlur={() => fields.touch('mrp')}
        />
      </div>

      <label className="flex min-h-[48px] cursor-pointer items-start gap-space-sm rounded-xl bg-surface-container-lowest p-space-sm shadow-sm">
        <input
          type="checkbox"
          checked={form.inStock}
          onChange={(event) => set('inStock', event.target.checked)}
          className={`mt-0.5 h-5 w-5 ${CHECKBOX_CLASSES}`}
        />
        <span className="flex flex-col">
          <span className="font-label-lg text-label-lg text-on-surface">{texts.inStock}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">{texts.inStockHint}</span>
        </span>
      </label>

      <TextField
        label={texts.barcode}
        hint={texts.barcodeHint}
        error={fields.errorOf('barcode')}
        inputMode="numeric"
        maxLength={EAN13_LENGTH}
        value={form.barcode}
        onChange={(event) => set('barcode', event.target.value.replace(/\D/g, ''))}
        onBlur={() => fields.touch('barcode')}
      />

      <PhotoPicker label={texts.photo} previewAlt={texts.photoAlt} currentUrl={imageUrl} onChange={setPhoto} />

      {failure && <FormError message={failure} />}
      <SubmitButton busy={saving} busyLabel={texts.saving} icon="save">
        {productId === undefined ? texts.create : texts.save}
      </SubmitButton>
    </form>
  )
}
