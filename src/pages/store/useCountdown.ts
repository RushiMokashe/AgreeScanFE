import { useEffect, useState } from 'react'

const TICK_MS = 1000

/** Milliseconds left until `endsAt` (ISO instant), updated every second; the ticking stops at zero. */
export function useCountdown(endsAt: string): number {
  const [now, setNow] = useState(Date.now)
  const remaining = Math.max(0, Date.parse(endsAt) - now)
  const expired = remaining === 0

  useEffect(() => {
    if (expired) return
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS)
    return () => window.clearInterval(timer)
  }, [expired])

  return remaining
}
