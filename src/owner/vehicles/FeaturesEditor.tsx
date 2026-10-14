import { Field } from '../../components/form/Field'
import { INPUT_CLASSES } from '../../components/form/field-styles'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { LocalizedTextInput } from '../../components/form/LocalizedTextInput'
import { FEATURE_ICONS, MAX_FEATURES, emptyFeature, type FeatureDraft, type FeatureIcon } from './vehicle-form'

interface FeaturesEditorProps {
  features: FeatureDraft[]
  onChange: (features: FeatureDraft[]) => void
  translations: boolean
  /** Rows missing their English text, by key. */
  invalidRows?: ReadonlySet<number>
}

const isFeatureIcon = (icon: string): icon is FeatureIcon => (FEATURE_ICONS as readonly string[]).includes(icon)

/** Up to four feature chips, each with an icon, e.g. a badge and "Solapur APMC Direct Entry Pass". */
export function FeaturesEditor({ features, onChange, translations, invalidRows }: FeaturesEditorProps) {
  const { t } = useI18n()
  const update = (updated: FeatureDraft) =>
    onChange(features.map((feature) => (feature.key === updated.key ? updated : feature)))

  return (
    <fieldset className="flex flex-col gap-space-sm">
      <legend className="font-title-md text-title-md font-bold text-on-surface">{t.owner.form.features.title}</legend>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{t.owner.form.features.hint(MAX_FEATURES)}</p>
      {features.map((feature) => (
        <div key={feature.key} className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-sm">
          <div className="flex items-end gap-space-xs">
            <span className="mb-1 w-11 h-11 flex-shrink-0 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <Icon name={feature.icon} className="text-[20px]" />
            </span>
            <div className="min-w-0 flex-1">
              <Field label={t.owner.form.features.icon}>
                {(control) => (
                  <select
                    {...control}
                    value={feature.icon}
                    onChange={(event) => update({ ...feature, icon: event.target.value })}
                    className={INPUT_CLASSES}
                  >
                    {!isFeatureIcon(feature.icon) && <option value={feature.icon}>{feature.icon}</option>}
                    {FEATURE_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {t.owner.form.featureIcons[icon]}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
            <button
              type="button"
              aria-label={t.owner.form.features.remove}
              onClick={() => onChange(features.filter((other) => other.key !== feature.key))}
              className="mb-0.5 w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-error active:bg-error-container"
            >
              <Icon name="delete" className="text-[20px]" />
            </button>
          </div>
          <LocalizedTextInput
            label={t.owner.form.features.text}
            value={feature.text}
            error={invalidRows?.has(feature.key) ? t.owner.form.required : undefined}
            onChange={(text) => update({ ...feature, text })}
            translations={translations}
          />
        </div>
      ))}
      {features.length < MAX_FEATURES && (
        <button
          type="button"
          onClick={() => onChange([...features, emptyFeature()])}
          className="self-start min-h-[44px] flex items-center gap-1 rounded-lg px-space-sm font-label-md text-label-md text-primary active:bg-surface-container"
        >
          <Icon name="add" className="text-[20px]" />
          {t.owner.form.features.add}
        </button>
      )}
    </fieldset>
  )
}
