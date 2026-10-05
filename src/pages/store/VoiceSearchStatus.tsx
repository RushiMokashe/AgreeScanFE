import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'

interface VoiceSearchStatusProps {
  /** The phrase heard; absent while still listening. */
  transcript?: string
  /** Cancels listening, or clears the search that was heard. */
  onDismiss: () => void
}

/** Strip under the search box: "listening…" with Cancel, then the phrase heard with Clear. */
export function VoiceSearchStatus({ transcript, onDismiss }: VoiceSearchStatusProps) {
  const { t } = useI18n()
  const listening = transcript === undefined

  return (
    <div className="mt-2 px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-between gap-2">
      {listening ? (
        <div className="flex items-center gap-2">
          <Icon name="graphic_eq" className="text-[18px] animate-bounce" />
          <span className="font-label-sm text-label-sm font-semibold">{t.store.voice.listening}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-secondary min-w-0">
          <Icon name="done" className="text-[18px]" />
          <span className="font-label-sm text-label-sm font-bold truncate">{t.store.voice.heard(transcript)}</span>
        </div>
      )}
      {/* ::after widens the text button's tap target */}
      <button
        type="button"
        onClick={onDismiss}
        className="relative font-label-sm text-label-sm underline flex-shrink-0 after:absolute after:-inset-3"
      >
        {listening ? t.store.voice.cancel : t.store.voice.clear}
      </button>
    </div>
  )
}
