import type { ReactNode } from 'react'
import { ErrorState, LoadingState } from '../../components/PageState'
import type { ApiState } from '../../hooks/useApi'

interface SectionLoaderProps<T> {
  state: ApiState<T>
  loadingLabel?: string
  /** Heading shown if this section fails, e.g. "Could not load nearby stores". */
  errorTitle: string
  children: (data: T) => ReactNode
}

/**
 * Renders a section once its own request has loaded, showing the loading or error state meanwhile,
 * so each section of a screen appears (or fails) independently of the others.
 */
export function SectionLoader<T>({
  state: { data, error, reload },
  loadingLabel,
  errorTitle,
  children,
}: SectionLoaderProps<T>) {
  if (error) return <ErrorState error={error} onRetry={reload} title={errorTitle} />
  if (data === undefined) return <LoadingState label={loadingLabel} />
  return children(data)
}
