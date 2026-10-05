import { useCallback, useEffect, useEffectEvent, useState } from 'react'
import { useI18n } from '../i18n/i18n-context'
import type { LanguageCode } from '../lib/types'

type Dep = string | number | boolean | null | undefined

/** A replacement value, or a function deriving it from the current data (safe for overlapping mutations). */
export type DataUpdate<T> = T | ((current: T) => T)

export interface ApiState<T> {
  /** Last loaded value for the current deps (kept while a reload or a language switch is in flight). */
  data: T | undefined
  error: Error | undefined
  loading: boolean
  /** Re-runs the loader. */
  reload: () => void
  /** Updates the data, e.g. with the fresh object a mutation endpoint returned. */
  setData: (update: DataUpdate<T>) => void
}

interface Loaded<T> {
  depsKey: string
  lang: LanguageCode
  version: number
  data?: T
  error?: Error
}

/**
 * Loads data from the API when the component mounts and whenever `deps` or the app language change: the
 * server localizes its texts per request (Accept-Language), so a language switch re-fetches in the new one.
 * `deps` are the primitive values the loader reads (route params, filters).
 *
 * ```tsx
 * const { data, error, reload } = useApi(() => api.scan(id), [id])
 * if (error) return <ErrorState error={error} onRetry={reload} />
 * if (!data) return <LoadingState />
 * ```
 */
export function useApi<T>(load: () => Promise<T>, deps: readonly Dep[] = []): ApiState<T> {
  const { lang } = useI18n()
  const depsKey = JSON.stringify(deps)
  const [version, setVersion] = useState(0)
  const [loaded, setLoaded] = useState<Loaded<T>>()
  // Always calls the latest `load`, which is usually an inline arrow; what it reads is captured by `deps`.
  const runLoad = useEffectEvent(() => load())

  useEffect(() => {
    let cancelled = false
    runLoad().then(
      (data) => {
        if (!cancelled) setLoaded({ depsKey, lang, version, data })
      },
      (err: unknown) => {
        if (cancelled) return
        const error = err instanceof Error ? err : new Error(String(err))
        setLoaded((prev) => ({ depsKey, lang, version, data: prev?.depsKey === depsKey ? prev.data : undefined, error }))
      },
    )
    return () => {
      cancelled = true
    }
  }, [depsKey, lang, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  const setData = useCallback((update: DataUpdate<T>) => {
    setLoaded((prev) => {
      if (!prev) return prev
      if (typeof update !== 'function') return { ...prev, data: update, error: undefined }
      if (prev.data === undefined) return prev
      return { ...prev, data: (update as (current: T) => T)(prev.data), error: undefined }
    })
  }, [])

  // Data of other deps is never shown; data in the previous language stays until the new language arrives.
  const current = loaded?.depsKey === depsKey ? loaded : undefined
  const loading = !current || current.version !== version || current.lang !== lang
  return { data: current?.data, error: loading ? undefined : current?.error, loading, reload, setData }
}
