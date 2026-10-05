import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { useSpeech } from '../../hooks/useSpeech'
import { useI18n } from '../../i18n/i18n-context'
import type { Messages } from '../../i18n/translation'
import { HowToStep } from './HowToStep'
import { ServiceTile } from './ServiceTile'

const INTRO_CLIP = 'agriscan-intro'
const SCAN_GUIDE_CLIP = 'scan-guide'

/** Picks the title and description of a guide step or a service from the messages. */
type TileText = (t: Messages) => { title: string; description: string }

interface GuideStep {
  icon: string
  text: TileText
}

const HOW_TO_STEPS: readonly GuideStep[] = [
  { icon: 'photo_camera', text: (t) => t.home.intro.steps.photo },
  { icon: 'neurology', text: (t) => t.home.intro.steps.diagnosis },
  { icon: 'medication', text: (t) => t.home.intro.steps.medicine },
]

interface Service {
  to: string
  icon: string
  text: TileText
}

const SERVICES: readonly Service[] = [
  { to: '/scan', icon: 'local_florist', text: (t) => t.home.intro.services.cropDoctor },
  { to: '/store', icon: 'shopping_bag', text: (t) => t.home.intro.services.store },
  { to: '/treatment', icon: 'support_agent', text: (t) => t.home.intro.services.scientist },
  { to: '/treatment', icon: 'storefront', text: (t) => t.home.intro.services.dealers },
]

/** "What is AgriScan?": audio explainer, 3-step guide, the main scan CTA and the service grid. */
export function AgriScanIntroCard() {
  const { t } = useI18n()
  const speech = useSpeech()
  const introPlaying = speech.playing === INTRO_CLIP
  const guidePlaying = speech.playing === SCAN_GUIDE_CLIP
  const scanGuideScript = t.home.intro.scanGuideScript(t.scan.shutter.capture, t.scan.shutter.bugMode)

  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-md overflow-hidden">
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <Icon name="psychiatry" fill className="text-primary text-[20px]" />
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                {t.home.intro.title}
              </h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant font-semibold mt-0.5">
              {t.home.intro.tagline}
            </p>
          </div>
          <button
            aria-label={t.home.intro.listenLabel}
            aria-pressed={introPlaying}
            className="flex-shrink-0 min-h-[44px] px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            type="button"
            onClick={() => speech.toggle(INTRO_CLIP, t.home.intro.script)}
          >
            <Icon name={introPlaying ? 'stop_circle' : 'volume_up'} className="text-[18px]" />
            <span>{t.home.intro.listen}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-3">
        <div className="flex items-center gap-1.5 text-primary">
          <Icon name="lightbulb" fill className="text-[18px]" />
          <span className="font-label-md text-label-md font-bold text-on-surface">{t.home.intro.howTo}</span>
        </div>
        <ol className="flex flex-col gap-2 mt-1">
          {HOW_TO_STEPS.map((step, index) => {
            const { title, description } = step.text(t)
            return (
              <HowToStep key={step.icon} number={index + 1} icon={step.icon} title={title} description={description} />
            )
          })}
        </ol>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          className="w-full min-h-[56px] py-3.5 px-space-md rounded-xl bg-primary text-on-primary font-title-md text-title-md font-bold flex items-center justify-center gap-space-sm shadow-lg active:scale-[0.98] transition-transform"
          to="/scan"
        >
          <Icon name="photo_camera" fill className="text-[28px]" />
          <span>{t.home.intro.scanCta}</span>
        </Link>
        <button
          aria-pressed={guidePlaying}
          className="min-h-[44px] flex items-center justify-center gap-1.5 py-1 text-secondary font-label-md text-label-md active:opacity-80 transition-opacity"
          type="button"
          onClick={() => speech.toggle(SCAN_GUIDE_CLIP, scanGuideScript)}
        >
          <Icon name={guidePlaying ? 'stop_circle' : 'play_circle'} className="text-[18px]" />
          <span>{t.home.intro.scanGuide}</span>
        </button>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md font-bold text-on-surface">{t.home.intro.servicesTitle}</span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">{t.home.intro.allServices}</span>
        </div>
        <div className="grid grid-cols-2 gap-space-xs">
          {SERVICES.map((service) => {
            const { title, description } = service.text(t)
            return (
              <ServiceTile
                key={service.icon}
                to={service.to}
                icon={service.icon}
                title={title}
                description={description}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
