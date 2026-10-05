import { useAssistant } from '../../assistant/assistant-context'
import { useI18n } from '../../i18n/i18n-context'
import { Icon } from '../Icon'

/** The farmer header's mic: opens the voice assistant. */
export function AssistantButton() {
  const { t } = useI18n()
  const assistant = useAssistant()

  return (
    <button
      type="button"
      aria-label={t.nav.header.assistant}
      onClick={assistant.open}
      className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface-container-low text-primary flex items-center justify-center transition-colors active:bg-primary-container active:text-on-primary"
    >
      <Icon name="mic" className="text-[22px]" />
    </button>
  )
}
