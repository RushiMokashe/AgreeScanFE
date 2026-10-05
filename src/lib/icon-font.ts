const ICON_FONT = '1em "Material Symbols Outlined"'

/**
 * Icons are font ligatures: until the icon font has loaded they would render as their names
 * ("home", "mic"). index.css keeps them hidden until this marks the document ready — when the font
 * has loaded, or failed to (the fixed 1em icon boxes keep the layout intact either way).
 */
export function revealIconsWhenReady(): void {
  const reveal = () => {
    document.documentElement.dataset.icons = 'ready'
  }
  if (!('fonts' in document)) {
    reveal()
    return
  }
  document.fonts.load(ICON_FONT).then(reveal, reveal)
}
