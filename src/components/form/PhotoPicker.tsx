import { useEffect, useId, useState, type ChangeEvent } from 'react'
import { useI18n } from '../../i18n/i18n-context'
import { apiUrl } from '../../platform/api-base'
import { Icon } from '../Icon'

const SVG_TYPE = 'image/svg+xml'
/** The largest photo the server takes (spring.servlet.multipart.max-file-size). */
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024

interface PhotoPickerProps {
  /** What the photo is, e.g. "Photo" or "Your UPI QR". */
  label: string
  /** Describes the preview to screen readers, e.g. "Vehicle photo". */
  previewAlt: string
  /** The photo shown now, if any. */
  currentUrl: string | null
  /** Called with the photo chosen to replace it, which the form uploads when saved. */
  onChange: (photo: File) => void
  /** Shows the whole picture instead of filling the frame: a QR code must not be cropped. */
  contain?: boolean
}

/** Chooses a photo (JPEG, PNG or WebP up to 10 MB) and previews it before it is uploaded. */
export function PhotoPicker({ label, previewAlt, currentUrl, onChange, contain = false }: PhotoPickerProps) {
  const { t } = useI18n()
  const inputId = useId()
  const [error, setError] = useState<string>()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // A chosen photo shows through an object URL, released once it is replaced or the picker goes away.
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    },
    [previewUrl],
  )

  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/') || file.type === SVG_TYPE) {
      setError(t.common.photo.notImage)
    } else if (file.size > MAX_PHOTO_BYTES) {
      setError(t.common.photo.tooLarge)
    } else {
      setError(undefined)
      setPreviewUrl(URL.createObjectURL(file))
      onChange(file)
    }
  }

  const shown = previewUrl ?? currentUrl

  return (
    <div className="flex flex-col gap-space-xs">
      <span className="font-title-md text-title-md font-bold text-on-surface">{label}</span>
      <div className="relative w-full h-44 overflow-hidden rounded-xl bg-surface-container-high">
        {shown ? (
          <img
            src={apiUrl(shown)}
            alt={previewAlt}
            className={`w-full h-full ${contain ? 'object-contain bg-surface-container-lowest' : 'object-cover'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            <Icon name="add_a_photo" className="text-[48px]" />
          </div>
        )}
      </div>
      <label
        htmlFor={inputId}
        className="self-start min-h-[44px] flex cursor-pointer items-center gap-1 rounded-lg bg-surface-container px-space-md font-label-md text-label-md text-primary active:bg-surface-container-high focus-within:ring-2 focus-within:ring-primary/40"
      >
        <Icon name="photo_camera" className="text-[20px]" />
        {shown ? t.common.photo.change : t.common.photo.choose}
        <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" onChange={choose} className="sr-only" />
      </label>
      <p
        role={error ? 'alert' : undefined}
        className={`font-body-sm text-body-sm ${error ? 'text-error' : 'text-on-surface-variant'}`}
      >
        {error ?? t.common.photo.hint}
      </p>
    </div>
  )
}
