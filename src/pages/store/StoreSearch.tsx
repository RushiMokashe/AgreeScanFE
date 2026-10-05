import { useState } from 'react'
import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { useSpeechSearch } from './useSpeechSearch'
import { VoiceSearchStatus } from './VoiceSearchStatus'

interface StoreSearchProps {
  query: string
  onQueryChange: (query: string) => void
}

/** Search box with voice search (in the app language) and barcode scanning, and the voice search feedback strip. */
export function StoreSearch({ query, onQueryChange }: StoreSearchProps) {
  const { t } = useI18n()
  const toast = useToast()
  const [heard, setHeard] = useState<string>()
  const voice = useSpeechSearch((transcript) => {
    setHeard(transcript)
    onQueryChange(transcript)
  })
  // The last voice search stays on show until the search box is edited or cleared.
  const heardSearch = !voice.listening && heard === query ? heard : undefined

  const clearVoiceSearch = () => {
    setHeard(undefined)
    onQueryChange('')
  }

  return (
    <>
      <div
        role="search"
        className="relative w-full flex items-center bg-surface-container-lowest rounded-xl shadow-sm p-1.5 focus-within:shadow-md transition-shadow"
      >
        <div className="w-10 h-10 flex items-center justify-center text-primary flex-shrink-0">
          <Icon name="search" className="text-[24px]" />
        </div>
        {/* border-0 and focus:ring-0 undo the @tailwindcss/forms input styling the design does not use */}
        <input
          type="search"
          enterKeyHint="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-label={t.store.search.label}
          placeholder={t.store.search.placeholder}
          className="w-full min-h-[44px] bg-transparent border-0 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-0 px-1 py-2 min-w-0"
        />
        <div className="flex items-center gap-1 flex-shrink-0 pr-1">
          <button
            type="button"
            aria-label={t.store.voice.label}
            aria-pressed={voice.listening}
            onClick={voice.toggle}
            className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center active:scale-95 transition-transform ${
              voice.listening ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-primary'
            }`}
          >
            <Icon name="mic" className="text-[22px]" />
          </button>
          <button
            type="button"
            aria-label={t.store.search.scanBarcode}
            onClick={() => toast.show(t.store.search.scanComingSoon, 'info')}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-primary-container text-on-primary flex items-center justify-center active:scale-95 transition-transform"
          >
            <Icon name="qr_code_scanner" className="text-[20px]" />
          </button>
        </div>
      </div>
      <div aria-live="polite">
        {voice.listening && <VoiceSearchStatus onDismiss={voice.cancel} />}
        {heardSearch !== undefined && <VoiceSearchStatus transcript={heardSearch} onDismiss={clearVoiceSearch} />}
      </div>
    </>
  )
}
