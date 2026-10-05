import { Icon } from '../../components/Icon'
import { useSpeech } from '../../hooks/useSpeech'
import { useI18n } from '../../i18n/i18n-context'
import { audioClipLabel } from './diagnosis-utils'

const ADVICE_CLIP = 'diagnostic-advice'

interface DiagnosticAudioRowProps {
  /** e.g. "Hindi, English" */
  languages: string
  durationSeconds: number | null
  /** Text read aloud by the Play button. */
  script: string
}

/** "Hear Diagnostic Advice": reads the diagnosis aloud; the button turns into Stop while speaking. */
export function DiagnosticAudioRow({ languages, durationSeconds, script }: DiagnosticAudioRowProps) {
  const { t } = useI18n()
  const speech = useSpeech()
  const playing = speech.playing === ADVICE_CLIP

  return (
    <div className="bg-surface-container-low rounded-lg p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <Icon name="volume_up" fill className="text-[20px]" />
        </div>
        <div className="flex flex-col">
          <span className="font-label-md text-label-md font-bold text-on-surface">{t.diagnosis.audio.title}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {audioClipLabel(t, languages, durationSeconds)}
          </span>
        </div>
      </div>
      <button
        className="min-h-[44px] flex-shrink-0 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold active:bg-primary-container transition-colors shadow-sm flex items-center gap-1"
        type="button"
        onClick={() => speech.toggle(ADVICE_CLIP, script)}
      >
        <Icon name={playing ? 'stop' : 'play_arrow'} className="text-[16px]" />
        <span>{playing ? t.diagnosis.audio.stop : t.diagnosis.audio.play}</span>
      </button>
    </div>
  )
}
