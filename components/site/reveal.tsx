'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Fades its children in once they scroll into view. Falls back to visible
 * immediately when IntersectionObserver is unavailable, so content is never
 * trapped at opacity 0.
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

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const t = window.setTimeout(() => el.classList.add('is-visible'), delay)
          io.disconnect()
          return () => window.clearTimeout(t)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
