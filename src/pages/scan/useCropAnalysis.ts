import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'
import type { ScanMode } from '../../lib/types'
import { CaptureError } from './useCameraStream'

interface ScanOptions {
  /** CropOption.code, or null to let the model detect the crop. */
  crop: string | null
  mode: ScanMode
}

export interface CropAnalysis {
  analyzing: boolean
  /** Uploads the photo (or the frame being captured) and opens its diagnosis. */
  analyze: (photo: File | Promise<File>, options: ScanOptions) => Promise<void>
}

/** Sends a crop photo to the AI diagnosis endpoint and navigates to the result. */
export function useCropAnalysis(): CropAnalysis {
  const { t } = useI18n()
  const navigate = useNavigate()
  const toast = useToast()
  const [analyzing, setAnalyzing] = useState(false)
  // A result that arrives after the farmer left the scanner must not navigate them away from where they went.
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const analyze = async (photo: File | Promise<File>, { crop, mode }: ScanOptions) => {
    setAnalyzing(true)
    try {
      const scan = await api.createScan({ image: await photo, crop: crop ?? undefined, mode })
      if (mounted.current) navigate(`/diagnosis/${scan.id}`)
    } catch (error) {
      if (!mounted.current) return
      setAnalyzing(false)
      const message =
        error instanceof CaptureError ? t.scan.shutter.captureFailed : describeError(error, t.scan.shutter.analyzeFailed)
      toast.show(message, 'error')
    }
  }

  return { analyzing, analyze }
}
