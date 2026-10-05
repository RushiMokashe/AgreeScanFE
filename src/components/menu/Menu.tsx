import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Link } from 'react-router'
import { Icon } from '../Icon'

const ITEM_SELECTOR = '[role="menuitem"], [role="menuitemradio"]'

const ITEM_CLASSES =
  'flex min-h-[48px] w-full items-center gap-space-sm px-space-md text-left font-label-lg text-label-lg outline-none transition-colors hover:bg-surface-container focus:bg-surface-container'

/** The item that takes focus when the menu opens. */
type OpenFocus = 'first' | 'last'

interface MenuControl {
  /** Closes the menu; `refocus` returns focus to the menu button (not wanted after following a link). */
  close: (refocus: boolean) => void
}

const MenuContext = createContext<MenuControl | null>(null)

function useMenuControl(): MenuControl {
  const control = useContext(MenuContext)
  if (!control) throw new Error('Menu items must be used inside <Menu>')
  return control
}

function menuItems(menu: HTMLElement | null): HTMLElement[] {
  return menu ? Array.from(menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR)) : []
}

/** Index of the item a navigation key moves focus to, wrapping around; undefined for other keys. */
function targetIndex(key: string, current: number, count: number): number | undefined {
  switch (key) {
    case 'ArrowDown':
      return (current + 1) % count
    case 'ArrowUp':
      return (current <= 0 ? count : current) - 1
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return undefined
  }
}

interface MenuProps {
  /** Accessible name of the menu, e.g. "Language". The button's name comes from its content. */
  label: string
  /** Content of the button; it must include text (visible or `sr-only`) that names the button. */
  button: ReactNode
  buttonClassName: string
  /** Size of the dropdown panel, e.g. "w-52". */
  panelClassName?: string
  /** Shown at the top of the panel, outside the keyboard navigation (e.g. who is signed in). */
  header?: ReactNode
  children: ReactNode
}

/**
 * A button that opens a dropdown menu (WAI-ARIA menu button): Enter, Space or an arrow key opens it; the
 * arrow keys, Home and End move between its items; Escape closes it and returns focus to the button; Tab
 * or a press outside closes it.
 */
export function Menu({ label, button, buttonClassName, panelClassName = '', header, children }: MenuProps) {
  const [openFocus, setOpenFocus] = useState<OpenFocus | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const open = openFocus !== null

  const close = useCallback((refocus: boolean) => {
    setOpenFocus(null)
    if (refocus) buttonRef.current?.focus()
  }, [])
  const control = useMemo(() => ({ close }), [close])

  // Opening moves focus to the checked item (or the first, or the last); a press outside closes the menu.
  useEffect(() => {
    if (!openFocus) return
    const items = menuItems(menuRef.current)
    const checked = items.find((item) => item.getAttribute('aria-checked') === 'true')
    const initial = openFocus === 'last' ? items.at(-1) : (checked ?? items.at(0))
    initial?.focus()

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target as Node
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpenFocus(null)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [openFocus])

  const openWithArrowKeys = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    setOpenFocus(event.key === 'ArrowUp' ? 'last' : 'first')
  }

  const navigateItems = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      // Only this menu closes, not a sheet or drawer around it.
      event.stopPropagation()
      close(true)
      return
    }
    if (event.key === 'Tab') {
      setOpenFocus(null)
      return
    }
    const items = menuItems(menuRef.current)
    const index = targetIndex(event.key, items.indexOf(document.activeElement as HTMLElement), items.length)
    if (index === undefined) return
    event.preventDefault()
    items.at(index)?.focus()
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpenFocus(open ? null : 'first')}
        onKeyDown={openWithArrowKeys}
        className={buttonClassName}
      >
        {button}
      </button>
      {open && (
        <div
          ref={panelRef}
          onKeyDown={navigateItems}
          className={`absolute right-0 top-full z-[55] mt-2 origin-top-right overflow-hidden rounded-2xl bg-surface-container-lowest py-space-xs text-on-surface shadow-xl ring-1 ring-outline-variant/40 transition duration-150 ease-out starting:scale-95 starting:opacity-0 ${panelClassName}`}
        >
          {header}
          <div ref={menuRef} id={menuId} role="menu" aria-label={label}>
            <MenuContext value={control}>{children}</MenuContext>
          </div>
        </div>
      )}
    </div>
  )
}

interface MenuItemProps {
  icon: string
  /** Runs after the menu has closed. */
  onSelect: () => void
  children: ReactNode
}

/** An action in a menu. */
export function MenuItem({ icon, onSelect, children }: MenuItemProps) {
  const menu = useMenuControl()
  const select = () => {
    menu.close(true)
    onSelect()
  }
  return (
    <button type="button" role="menuitem" tabIndex={-1} onClick={select} className={ITEM_CLASSES}>
      <Icon name={icon} className="text-[20px] text-on-surface-variant" />
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  )
}

interface MenuLinkProps {
  to: string
  icon: string
  children: ReactNode
}

/** A page opened from a menu. */
export function MenuLink({ to, icon, children }: MenuLinkProps) {
  const menu = useMenuControl()
  return (
    <Link to={to} role="menuitem" tabIndex={-1} onClick={() => menu.close(false)} className={ITEM_CLASSES}>
      <Icon name={icon} className="text-[20px] text-on-surface-variant" />
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </Link>
  )
}

interface MenuItemRadioProps {
  checked: boolean
  /** Runs after the menu has closed, unless the item was already checked. */
  onSelect: () => void
  icon?: string
  /** Language of the label when it differs from the page's, e.g. a language name in its own script. */
  lang?: string
  /** A spinner replaces the check mark while the choice is being applied. */
  busy?: boolean
  children: ReactNode
}

/** One choice out of a set (a language, a role). */
export function MenuItemRadio({ checked, onSelect, icon, lang, busy = false, children }: MenuItemRadioProps) {
  const menu = useMenuControl()
  const select = () => {
    menu.close(true)
    if (!checked) onSelect()
  }
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      aria-busy={busy || undefined}
      tabIndex={-1}
      onClick={select}
      className={`${ITEM_CLASSES} ${checked ? 'text-primary' : ''}`}
    >
      {icon && <Icon name={icon} fill={checked} className="text-[20px]" />}
      <span lang={lang} className="min-w-0 flex-1 truncate">
        {children}
      </span>
      {busy ? (
        <Icon name="progress_activity" className="animate-spin text-[20px]" />
      ) : (
        checked && <Icon name="check" className="text-[20px]" />
      )}
    </button>
  )
}

/** A labelled set of radio items within a menu. */
export function MenuGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p aria-hidden="true" className="px-space-md pb-1 pt-space-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
        {label}
      </p>
      {children}
    </div>
  )
}

export function MenuSeparator() {
  return <div role="separator" className="my-space-xs h-px bg-outline-variant/50" />
}
