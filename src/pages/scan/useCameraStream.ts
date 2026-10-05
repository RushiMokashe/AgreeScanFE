import { useEffect, useRef, useState, type RefObject } from 'react'

export type CameraStatus = 'starting' | 'live' | 'unavailable'

export interface CameraStream {
  /** 'starting' until the first frame arrives; 'unavailable' without camera API, permission or camera. */
  status: CameraStatus
  /** Attach to the <video> element that previews the stream. */
  videoRef: RefObject<HTMLVideoElement | null>
  /** Switches the torch on cameras that have one; resolves without effect on the others. */
  setTorch: (on: boolean) => Promise<void>
  /** The current frame as a JPEG file; rejects with a CaptureError when the camera has none. */
  capture: () => Promise<File>
}

/** The camera delivered no frame (not playing yet, or already stopped); the farmer can simply try again. */
export class CaptureError extends Error {
  constructor() {
    super('The camera delivered no frame')
    this.name = 'CaptureError'
  }
}

const REAR_CAMERA: MediaStreamConstraints = { video: { facingMode: 'environment' }, audio: false }
const PHOTO_TYPE = 'image/jpeg'
const PHOTO_QUALITY = 0.92

/** Image Capture additions (Chrome on Android) that lib.dom does not declare yet. */
interface TorchCapabilities extends MediaTrackCapabilities {
  torch?: boolean
}

interface TorchConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean
}

/** navigator.mediaDevices only exists in secure contexts (https:// or localhost). */
function hasCameraApi(): boolean {
  return typeof navigator.mediaDevices?.getUserMedia === 'function'
}

function stopTracks(stream: MediaStream): void {
  for (const track of stream.getTracks()) track.stop()
}

function supportsTorch(track: MediaStreamTrack): boolean {
  // Firefox does not implement getCapabilities()
  if (typeof track.getCapabilities !== 'function') return false
  const capabilities: TorchCapabilities = track.getCapabilities()
  return capabilities.torch === true
}

function captureFrame(video: HTMLVideoElement): Promise<File> {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const context = canvas.getContext('2d')
  if (!context || canvas.width === 0) return Promise.reject(new CaptureError())

  context.drawImage(video, 0, 0)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(new File([blob], `crop-scan-${Date.now()}.jpg`, { type: PHOTO_TYPE }))
        else reject(new CaptureError())
      },
      PHOTO_TYPE,
      PHOTO_QUALITY,
    )
  })
}

/**
 * Rear-camera preview for the scanner. The stream starts when the component mounts and all its tracks
 * are stopped when it unmounts, so the camera never stays on after the farmer leaves the screen.
 */
export function useCameraStream(): CameraStream {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [track, setTrack] = useState<MediaStreamTrack | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasCameraApi()) return

    let stream: MediaStream | undefined
    let cancelled = false
    const markLive = () => setTrack(stream?.getVideoTracks()[0] ?? null)
    video.addEventListener('loadeddata', markLive)

    navigator.mediaDevices.getUserMedia(REAR_CAMERA).then(
      (media) => {
        if (cancelled) {
          stopTracks(media)
          return
        }
        stream = media
        video.srcObject = media
      },
      () => {
        // Permission denied, no camera or camera busy: the scanner falls back to photo upload.
        if (!cancelled) setFailed(true)
      },
    )

    return () => {
      cancelled = true
      video.removeEventListener('loadeddata', markLive)
      video.srcObject = null
      if (stream) stopTracks(stream)
    }
  }, [])

  const status: CameraStatus = failed || !hasCameraApi() ? 'unavailable' : track ? 'live' : 'starting'

  const setTorch = async (on: boolean) => {
    if (!track || !supportsTorch(track)) return
    const torch: TorchConstraintSet = { torch: on }
    await track.applyConstraints({ advanced: [torch] })
  }

  const capture = () => {
    const video = videoRef.current
    return video ? captureFrame(video) : Promise.reject(new CaptureError())
  }

  return { status, videoRef, setTorch, capture }
}
