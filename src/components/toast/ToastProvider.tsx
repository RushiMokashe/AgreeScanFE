import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Icon } from '../Icon'
import { ToastContext, type ToastTone } from './toast-context'

interface Toast {
  id: number
  message: string
  tone: ToastTone
}

/** How long a toast stays on screen. */
const TOAST_MS = 2800

const TONE_STYLES: Record<ToastTone, { box: string; icon: string; iconName: string }> = {
  success: { box: 'bg-inverse-surface text-inverse-on-surface', icon: 'text-secondary-fixed', iconName: 'check_circle' },
  info: { box: 'bg-inverse-surface text-inverse-on-surface', icon: 'text-primary-fixed', iconName: 'info' },
  error: { box: 'bg-error text-on-error', icon: 'text-on-error', iconName: 'error' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null)

  const show = useCallback((message: string, tone: ToastTone = 'success') => {
    setToast({ id: Date.now(), message, tone })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])

  const value = useMemo(() => ({ show }), [show])
  const style = toast ? TONE_STYLES[toast.tone] : undefined

  return (
    <ToastContext value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] mx-auto max-w-md px-margin"
      >
        {toast && style && (
          <div
            key={toast.id}
            className={`flex items-center gap-space-sm rounded-xl px-4 py-3 shadow-lg font-label-md text-label-md ${style.box}`}
          >
            <Icon name={style.iconName} fill className={`text-[20px] ${style.icon}`} />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </ToastContext>
  )
}
