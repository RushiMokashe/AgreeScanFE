import { useEffect, useEffectEvent, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

/** Keeps Tab and Shift+Tab cycling through the focusable elements inside `container`. */
function trapTab(event: KeyboardEvent, container: HTMLElement) {
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
  const first = focusable.at(0)
  const last = focusable.at(-1)
  if (!first || !last) return

  const active = document.activeElement
  if (event.shiftKey && (active === first || active === container)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

/**
 * Focus handling of a modal sheet or drawer: moves focus into `dialogRef` while it is mounted, keeps Tab
 * inside it, closes it on Escape, and gives focus back to the control that opened it.
 */
export function useModalFocus(dialogRef: RefObject<HTMLElement | null>, onClose: () => void) {
  const close = useEffectEvent(onClose)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const opener = document.activeElement
    dialog.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      else if (event.key === 'Tab') trapTab(event, dialog)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [dialogRef])
}
