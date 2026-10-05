import { useMatches } from 'react-router'
import { useI18n } from '../../i18n/i18n-context'
import type { MessageSelector } from '../../i18n/translation'

/** Static data on a route (its `handle`), read by the layouts. */
export interface RouteHandle {
  /** The screen's name for the header and the browser tab. */
  title: MessageSelector
}

/** The name of the screen on show (from its deepest route with a handle), in the active language. */
export function useRouteTitle(): string | undefined {
  const { t } = useI18n()
  const handle = useMatches()
    .map((match) => match.handle as RouteHandle | undefined)
    .findLast((candidate) => candidate !== undefined)
  return handle?.title(t)
}
