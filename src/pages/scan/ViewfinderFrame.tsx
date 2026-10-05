const CORNER = 'w-10 h-10 border-secondary-container shadow-sm'
/** One slow turn every 14 s (design value) instead of animate-spin's 1 s. */
const RETICLE_SPIN = { animationDuration: '14s' }

/** Target-lock HUD: four corner brackets around a slowly spinning centre reticle. */
export function ViewfinderFrame() {
  return (
    <div className="absolute inset-6 pointer-events-none flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className={`${CORNER} border-t-4 border-l-4 rounded-tl-xl`} />
        <div className={`${CORNER} border-t-4 border-r-4 rounded-tr-xl`} />
      </div>
      <div className="self-center flex flex-col items-center justify-center">
        <div
          className="w-16 h-16 rounded-full border border-dashed border-secondary-container/60 flex items-center justify-center animate-spin"
          style={RETICLE_SPIN}
        >
          <div className="w-2 h-2 rounded-full bg-secondary-fixed" />
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div className={`${CORNER} border-b-4 border-l-4 rounded-bl-xl`} />
        <div className={`${CORNER} border-b-4 border-r-4 rounded-br-xl`} />
      </div>
    </div>
  )
}
