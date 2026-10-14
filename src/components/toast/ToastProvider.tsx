import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Icon } from '../Icon'
import { ToastContext, type ToastAction, type ToastTone } from './toast-context'

interface Toast {
  id: number
  message: string
  tone: ToastTone
  action?: ToastAction
}

/** How long a toast stays on screen; one with an action stays longer, so there is time to press it. */
const TOAST_MS = 2800
const ACTION_TOAST_MS = 6000

const TONE_STYLES: Record<ToastTone, { box: string; icon: string; iconName: string; action: string }> = {
  success: {
    box: 'bg-inverse-surface text-inverse-on-surface',
    icon: 'text-secondary-fixed',
    iconName: 'check_circle',
    action: 'text-inverse-primary',
  },
  info: {
    box: 'bg-inverse-surface text-inverse-on-surface',
    icon: 'text-primary-fixed',
    iconName: 'info',
    action: 'text-inverse-primary',
  },
  error: { box: 'bg-error text-on-error', icon: 'text-on-error', iconName: 'error', action: 'text-on-error underline' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null)

  const show = useCallback((message: string, tone: ToastTone = 'success', action?: ToastAction) => {
    setToast({ id: Date.now(), message, tone, action })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), toast.action ? ACTION_TOAST_MS : TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])

  const value = useMemo(() => ({ show }), [show])
  const style = toast ? TONE_STYLES[toast.tone] : undefined
  const action = toast?.action

  const select = (chosen: ToastAction) => {
    setToast(null)
    chosen.onSelect()
  }

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
            <span className="min-w-0 flex-1">{toast.message}</span>
            {action && (
              <button
                type="button"
                onClick={() => select(action)}
                className={`pointer-events-auto -my-2 min-h-[44px] flex-shrink-0 px-space-sm font-label-lg text-label-lg font-bold ${style.action}`}
              >
                {action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext>
  )
}
