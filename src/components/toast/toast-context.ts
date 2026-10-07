import { createContext, useContext } from 'react'

export type ToastTone = 'success' | 'info' | 'error'

/** A button on a toast, e.g. "View" on a live notification. */
export interface ToastAction {
  label: string
  onSelect: () => void
}

export interface ToastApi {
  show: (message: string, tone?: ToastTone, action?: ToastAction) => void
}

export const ToastContext = createContext<ToastApi>({ show: () => {} })

/** Short confirmation messages, e.g. `toast.show('Slot booked')`, optionally with one action. */
export function useToast(): ToastApi {
  return useContext(ToastContext)
}
