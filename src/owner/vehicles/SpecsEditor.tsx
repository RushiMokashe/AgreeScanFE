import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { LocalizedTextInput } from '../../components/form/LocalizedTextInput'
import { MAX_SPECS, emptySpec, type SpecDraft } from './vehicle-form'

interface SpecsEditorProps {
  specs: SpecDraft[]
  onChange: (specs: SpecDraft[]) => void
  translations: boolean
  /** Rows missing their English text, by key. */
  invalidRows?: ReadonlySet<number>
}

/** Up to three spec tiles, e.g. "6 Feet" – "Rotavator Width". */
export function SpecsEditor({ specs, onChange, translations, invalidRows }: SpecsEditorProps) {
  const { t } = useI18n()
  const update = (updated: SpecDraft) => onChange(specs.map((spec) => (spec.key === updated.key ? updated : spec)))

  return (
    <fieldset className="flex flex-col gap-space-sm">
      <legend className="font-title-md text-title-md font-bold text-on-surface">{t.owner.form.specs.title}</legend>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{t.owner.form.specs.hint(MAX_SPECS)}</p>
      {specs.map((spec, index) => (
        <div key={spec.key} className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">{index + 1}</span>
            <button
              type="button"
              aria-label={t.owner.form.specs.remove}
              onClick={() => onChange(specs.filter((other) => other.key !== spec.key))}
              className="w-11 h-11 rounded-full flex items-center justify-center text-error active:bg-error-container"
            >
              <Icon name="delete" className="text-[20px]" />
            </button>
          </div>
          <LocalizedTextInput
            label={t.owner.form.specs.value}
            value={spec.value}
            error={invalidRows?.has(spec.key) && !spec.value.en.trim() ? t.owner.form.required : undefined}
            onChange={(value) => update({ ...spec, value })}
            translations={translations}
          />
          <LocalizedTextInput
            label={t.owner.form.specs.label}
            value={spec.label}
            error={invalidRows?.has(spec.key) && !spec.label.en.trim() ? t.owner.form.required : undefined}
            onChange={(label) => update({ ...spec, label })}
            translations={translations}
          />
        </div>
      ))}
      {specs.length < MAX_SPECS && (
        <button
          type="button"
          onClick={() => onChange([...specs, emptySpec()])}
          className="self-start min-h-[44px] flex items-center gap-1 rounded-lg px-space-sm font-label-md text-label-md text-primary active:bg-surface-container"
        >
          <Icon name="add" className="text-[20px]" />
          {t.owner.form.specs.add}
        </button>
      )}
    </fieldset>
  )
}
