import { useRef, type ChangeEvent } from 'react'
import { Icon } from '../../components/Icon'
import { useI18n } from '../../i18n/i18n-context'
import { DeckButton } from './DeckButton'

const GALLERY_THUMBNAIL_URL = '/images/scans/gallery-sugarcane.jpg'

interface ShutterDeckProps {
  /** Grabs the live camera frame. Left out without a live camera: the shutter then opens the phone's camera. */
  captureFrame?: () => Promise<File>
  onPhoto: (photo: File | Promise<File>) => void
  pestMode: boolean
  onTogglePestMode: () => void
  disabled: boolean
}

/** Main input deck: gallery picker, the "Capture & Analyze" shutter and the Bug Mode switch. */
export function ShutterDeck({ captureFrame, onPhoto, pestMode, onTogglePestMode, disabled }: ShutterDeckProps) {
  const { t } = useI18n()
  const cameraInput = useRef<HTMLInputElement>(null)
  const galleryInput = useRef<HTMLInputElement>(null)

  const shoot = () => {
    if (captureFrame) onPhoto(captureFrame())
    else cameraInput.current?.click()
  }

  const pickPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const photo = input.files?.[0]
    // Clearing the input lets the farmer choose the same photo again after a failed upload.
    input.value = ''
    if (photo) onPhoto(photo)
  }

  return (
    <div className="bg-surface-container rounded-3xl p-4 flex items-center justify-between shadow-sm">
      <DeckButton
        caption={t.scan.shutter.gallery}
        label={t.scan.shutter.galleryLabel}
        disabled={disabled}
        onClick={() => galleryInput.current?.click()}
      >
        <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-inner">
          <img alt="" className="w-full h-full object-cover" src={GALLERY_THUMBNAIL_URL} />
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <Icon name="photo_library" className="text-[16px] text-surface-container-lowest" />
          </div>
        </div>
      </DeckButton>

      <div className="flex flex-col items-center">
        <button
          aria-label={t.scan.shutter.captureLabel}
          className="group relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg active:scale-90 transition-all p-1 disabled:opacity-60"
          disabled={disabled}
          type="button"
          onClick={shoot}
        >
          <div className="absolute -inset-1.5 rounded-full bg-secondary-container/40 animate-pulse pointer-events-none" />
          <div className="w-full h-full rounded-full bg-primary-container flex flex-col items-center justify-center text-on-primary">
            <Icon name="scan" className="text-[32px] group-hover:scale-110 transition-transform" />
          </div>
        </button>
        <span className="font-label-md text-label-md text-primary font-bold mt-1.5 flex items-center gap-1">
          {t.scan.shutter.capture}
        </span>
      </div>

      <DeckButton
        caption={t.scan.shutter.bugMode}
        label={t.scan.shutter.bugModeLabel}
        pressed={pestMode}
        disabled={disabled}
        onClick={onTogglePestMode}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            pestMode ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-secondary'
          }`}
        >
          <Icon name="pest_control" fill={pestMode} className="text-[20px]" />
        </div>
      </DeckButton>

      <input
        ref={cameraInput}
        accept="image/*"
        capture="environment"
        className="hidden"
        type="file"
        onChange={pickPhoto}
      />
      <input ref={galleryInput} accept="image/*" className="hidden" type="file" onChange={pickPhoto} />
    </div>
  )
}
