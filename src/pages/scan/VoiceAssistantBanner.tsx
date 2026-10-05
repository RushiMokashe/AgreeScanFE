import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'

/** Vernacular voice assistant banner (not available yet, so both controls say so). */
export function VoiceAssistantBanner() {
  const { t } = useI18n()
  const toast = useToast()
  const announceComingSoon = () => toast.show(t.scan.voice.comingSoon, 'info')

  return (
    <div className="bg-surface-container-low rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button
          aria-label={t.scan.voice.start}
          className="w-11 h-11 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          type="button"
          onClick={announceComingSoon}
        >
          <Icon name="mic" className="text-[24px]" />
        </button>
        <div className="min-w-0">
          <p className="font-title-md text-title-md text-on-surface font-semibold truncate flex items-center gap-1">
            <span>{t.scan.voice.title}</span>
            <Icon name="volume_up" className="text-[16px] text-secondary" />
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{t.scan.voice.hint}</p>
        </div>
      </div>
      <button
        className="min-h-[44px] px-3 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md flex-shrink-0 active:bg-surface-container-highest transition-colors"
        type="button"
        onClick={announceComingSoon}
      >
        {t.scan.voice.listen}
      </button>
    </div>
  )
}
