import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { APP_NAME } from './constants'
import { useRouteTitle } from './route-handle'

/** Root of every route: names the browser tab after the screen and restores scroll positions. */
export function AppShell() {
  const title = useRouteTitle()

  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME
  }, [title])

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
