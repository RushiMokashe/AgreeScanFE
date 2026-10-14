import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './auth/AuthProvider'
import { ToastProvider } from './components/toast/ToastProvider'
import { I18nProvider } from './i18n/I18nProvider'
import './index.css'
import { revealIconsWhenReady } from './lib/icon-font'
import { startNativeApp } from './platform/native-app'
import { router } from './router'

revealIconsWhenReady()
startNativeApp()

// The session is restored while the saved language loads; the router's screens need both, and toasts
// serve every layer.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <I18nProvider>
          <RouterProvider router={router} />
        </I18nProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)
