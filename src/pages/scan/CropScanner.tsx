import { useState } from 'react'
import { useI18n } from '../../i18n/i18n-context'
import type { ScanContext, ScanMode } from '../../lib/types'
import { CameraViewfinder } from './CameraViewfinder'
import { CropSelector } from './CropSelector'
import { FieldInsightCard } from './FieldInsightCard'
import { ScannerStatusBanner } from './ScannerStatusBanner'
import { ShutterDeck } from './ShutterDeck'
import { useCameraStream } from './useCameraStream'
import { useCropAnalysis } from './useCropAnalysis'
import { VoiceAssistantBanner } from './VoiceAssistantBanner'

interface CropScannerProps {
  context: ScanContext
}

/**
 * The scanner itself: crop choice, live camera, capture/upload and the field context cards.
 * It owns the camera, so the camera runs only while the scanner is on screen.
 */
export function CropScanner({ context }: CropScannerProps) {
  const { t } = useI18n()
  const camera = useCameraStream()
  const { analyzing, analyze } = useCropAnalysis()
  // CropOption.code of the chosen crop; null lets the model detect it.
  const [crop, setCrop] = useState<string | null>(null)
  const [mode, setMode] = useState<ScanMode>('LEAF')

  return (
    <div className="flex flex-col w-full pb-6">
      <ScannerStatusBanner modelVersion={context.modelVersion} />
      <CropSelector crops={context.supportedCrops} selected={crop} onSelect={setCrop} disabled={analyzing} />
      <CameraViewfinder
        cameraStatus={camera.status}
        videoRef={camera.videoRef}
        setTorch={camera.setTorch}
        latestScan={context.latestScan}
        analyzing={analyzing}
      />
      <div className="px-margin pt-4 flex flex-col gap-4">
        <ShutterDeck
          captureFrame={camera.status === 'live' ? camera.capture : undefined}
          onPhoto={(photo) => analyze(photo, { crop, mode })}
          pestMode={mode === 'PEST'}
          onTogglePestMode={() => setMode(mode === 'PEST' ? 'LEAF' : 'PEST')}
          disabled={analyzing}
        />
        <VoiceAssistantBanner />
        <div className="grid grid-cols-2 gap-3 pt-1">
          <FieldInsightCard
            label={t.scan.insights.moisture}
            icon="water_drop"
            value={`${context.fieldMoisturePercent}%`}
            note={context.fieldMoistureNote}
            tone="positive"
          />
          <FieldInsightCard
            label={t.scan.insights.outbreaks}
            icon="warning"
            value={t.scan.insights.alerts(context.nearbyOutbreakCount)}
            note={`${context.nearbyOutbreakNote} • ${t.scan.insights.viewStores}`}
            tone="alert"
            to="/treatment"
          />
        </div>
      </div>
    </div>
  )
}
