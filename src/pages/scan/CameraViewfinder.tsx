import { useState, type RefObject } from 'react'
import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import type { ScanDetail } from '../../lib/types'
import { HudButton } from './HudButton'
import { LiveDiagnosisCard } from './LiveDiagnosisCard'
import { ZOOM_SCALE_CLASS, type ZoomLevel } from './scan-utils'
import { ThirdsGridOverlay } from './ThirdsGridOverlay'
import type { CameraStatus } from './useCameraStream'
import { ViewfinderFrame } from './ViewfinderFrame'

/** Sample leaf shown when there is no live camera (plain-http origin, permission denied, no camera). */
const FALLBACK_PHOTO_URL = '/images/scans/scanner-tomato-leaf.jpg'
const MEDIA_CLASS = 'absolute inset-0 w-full h-full object-cover transition-transform duration-300'

interface CameraViewfinderProps {
  cameraStatus: CameraStatus
  videoRef: RefObject<HTMLVideoElement | null>
  setTorch: (on: boolean) => Promise<void>
  latestScan: ScanDetail | null
  analyzing: boolean
}

/** Camera HUD: live preview (or the sample photo), scan overlays, torch/zoom/grid controls and the live diagnosis. */
export function CameraViewfinder({ cameraStatus, videoRef, setTorch, latestScan, analyzing }: CameraViewfinderProps) {
  const { t } = useI18n()
  const toast = useToast()
  const [torchOn, setTorchOn] = useState(false)
  const [zoom, setZoom] = useState<ZoomLevel>(1)
  const [gridOn, setGridOn] = useState(false)
  const cameraUnavailable = cameraStatus === 'unavailable'
  const mediaClass = `${MEDIA_CLASS} ${ZOOM_SCALE_CLASS[zoom]}`
  const captureChecks = [t.scan.camera.naturalLighting, t.scan.camera.focusLocked]

  const toggleTorch = () => {
    const on = !torchOn
    setTorchOn(on)
    setTorch(on).catch(() => {
      setTorchOn(!on)
      toast.show(t.scan.camera.torchFailed, 'error')
    })
  }

  return (
    <div className="px-margin">
      {/* `isolate` makes Safari clip the zoomed video to the rounded corners */}
      <div className="relative isolate w-full aspect-[4/5] rounded-3xl overflow-hidden bg-inverse-surface shadow-xl flex items-center justify-center">
        {cameraUnavailable ? (
          <img alt={t.scan.camera.sampleAlt} className={mediaClass} src={FALLBACK_PHOTO_URL} />
        ) : (
          <video ref={videoRef} aria-label={t.scan.camera.preview} autoPlay className={mediaClass} muted playsInline />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-inverse-surface/60 via-transparent to-inverse-surface/80 pointer-events-none" />
        {gridOn && <ThirdsGridOverlay />}
        <div className="absolute inset-x-4 h-1 bg-gradient-to-r from-transparent via-secondary-container to-transparent shadow-[0_0_16px_#a0f399] pointer-events-none animate-scan-laser" />
        <ViewfinderFrame />

        <div className="absolute top-4 inset-x-4 flex flex-col items-center gap-2 pointer-events-none">
          <div className="bg-inverse-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
            <span aria-hidden="true" className="text-base">🌿</span>
            <span className="font-label-md text-label-md text-inverse-on-surface">{t.scan.camera.distanceHint}</span>
          </div>
          <div className="flex items-center gap-2">
            {captureChecks.map((check) => (
              <div
                key={check}
                className="bg-primary-container/85 backdrop-blur-sm text-on-primary-container px-2.5 py-0.5 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-sm"
              >
                <Icon name="check_circle" className="text-[14px]" />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 inset-x-4 flex flex-col items-center gap-2 pointer-events-none">
          {cameraUnavailable && (
            <span
              className="bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-lg"
              role="status"
            >
              <Icon name="no_photography" className="text-[14px]" />
              {t.scan.camera.unavailable}
            </span>
          )}
          {latestScan && <LiveDiagnosisCard scan={latestScan} />}
        </div>

        <div className="absolute top-20 right-3 flex flex-col gap-3 pointer-events-auto z-10">
          <HudButton
            label={t.scan.camera.torch}
            pressed={torchOn}
            activeClassName="bg-secondary-fixed text-on-secondary-fixed"
            onClick={toggleTorch}
          >
            <Icon name={torchOn ? 'flash_on' : 'flash_off'} className="text-[22px]" />
          </HudButton>
          <HudButton
            label={t.scan.camera.zoom}
            pressed={zoom === 2}
            activeClassName="bg-primary text-on-primary"
            onClick={() => setZoom(zoom === 1 ? 2 : 1)}
          >
            <span className="font-label-md text-label-md font-bold">{zoom}x</span>
          </HudButton>
          <HudButton
            label={t.scan.camera.grid}
            pressed={gridOn}
            activeClassName="bg-primary text-on-primary"
            onClick={() => setGridOn(!gridOn)}
          >
            <Icon name="grid_on" className="text-[20px]" />
          </HudButton>
        </div>

        {analyzing && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-space-sm bg-inverse-surface/75 backdrop-blur-sm text-inverse-on-surface"
            role="status"
          >
            <Icon name="progress_activity" className="text-[40px] text-secondary-fixed animate-spin" />
            <span className="font-title-md text-title-md font-bold">{t.scan.camera.analyzing}</span>
          </div>
        )}
      </div>
    </div>
  )
}
