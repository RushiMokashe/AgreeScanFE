import { useEffect, useRef, useState } from 'react'

/**
 * A flag that switches itself off `durationMs` after the latest `trigger()`, for brief confirmation
 * states such as "Rx Bundle Added to Cart".
 */
export function useTimedFlag(durationMs: number): [on: boolean, trigger: () => void] {
  const [on, setOn] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const trigger = () => {
    window.clearTimeout(timer.current)
    setOn(true)
    timer.current = window.setTimeout(() => setOn(false), durationMs)
  }

  return [on, trigger]
}
