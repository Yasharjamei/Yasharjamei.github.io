'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** Content is force-revealed after this long, whatever the observer did. */
const FAILSAFE_MS = 2500

/**
 * Fades its children in once they scroll into view.
 *
 * Deliberately progressive: nothing is hidden until this effect runs and adds
 * `reveal-armed`. If JavaScript is disabled, or IntersectionObserver is missing,
 * or its callback never fires (a background tab that never paints, for
 * instance), the content simply stays visible rather than leaving the page
 * blank. A timeout backstops the observer for the same reason.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No observer available: leave the content plainly visible.
    if (typeof IntersectionObserver === 'undefined') return

    el.classList.add('reveal-armed')

    let showTimer = 0
    const show = () => el.classList.add('is-visible')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          io.disconnect()
          showTimer = window.setTimeout(show, delay)
          return
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    const failsafe = window.setTimeout(show, FAILSAFE_MS)

    return () => {
      io.disconnect()
      window.clearTimeout(showTimer)
      window.clearTimeout(failsafe)
    }
  }, [delay])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
