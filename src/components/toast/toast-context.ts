import { createContext, useContext } from 'react'

export type ToastTone = 'success' | 'info' | 'error'

export interface ToastApi {
  show: (message: string, tone?: ToastTone) => void
}

export const ToastContext = createContext<ToastApi>({ show: () => {} })

/** Short confirmation messages, e.g. `toast.show('Slot booked')`. */
export function useToast(): ToastApi {
  return useContext(ToastContext)
}
