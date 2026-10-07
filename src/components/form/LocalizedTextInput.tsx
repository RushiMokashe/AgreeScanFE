import { LANGUAGES } from '../../i18n/languages'
import type { LocalizedDraft } from '../../lib/localized-draft'
import { TextField } from './TextField'

/** The longest text the server keeps in each language. */
const MAX_TEXT_LENGTH = 1000

interface LocalizedTextInputProps {
  label: string
  hint?: string
  error?: string
  value: LocalizedDraft
  onChange: (value: LocalizedDraft) => void
  /** Shows the Marathi and Hindi inputs under the English one. */
  translations: boolean
  /** Called when the English input is left, e.g. to show its error from then on. */
  onBlur?: () => void
}

/** One text in English (required), with optional Marathi and Hindi versions farmers see in their language. */
export function LocalizedTextInput({ label, hint, error, value, onChange, translations, onBlur }: LocalizedTextInputProps) {
  return (
    <div className="flex flex-col gap-space-xs">
      <TextField
        label={label}
        hint={hint}
        error={error}
        value={value.en}
        maxLength={MAX_TEXT_LENGTH}
        onChange={(event) => onChange({ ...value, en: event.target.value })}
        onBlur={onBlur}
      />
      {translations && (
        <div className="flex flex-col gap-space-xs border-l-2 border-secondary-container pl-space-sm">
          <TextField
            label={`${label} – ${LANGUAGES.mr.nativeName}`}
            lang="mr"
            value={value.mr}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(event) => onChange({ ...value, mr: event.target.value })}
          />
          <TextField
            label={`${label} – ${LANGUAGES.hi.nativeName}`}
            lang="hi"
            value={value.hi}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(event) => onChange({ ...value, hi: event.target.value })}
          />
        </div>
      )}
    </div>
  )
}
