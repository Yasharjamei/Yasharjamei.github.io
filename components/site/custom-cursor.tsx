'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Trailing ring cursor: a spring-followed outline with a dot at its centre that
 * expands into a filled disc over anything clickable.
 *
 * Adapted from `CustomCursor` in xkintaro/kintarowwwards (MIT, © 2026 Mustafa
 * TAŞAL). Reimplemented without framer-motion — a single rAF loop lerping
 * toward the pointer — and it augments the native cursor rather than hiding it,
 * so pointer affordances are never lost.
 *
 * Disabled entirely on coarse pointers and under prefers-reduced-motion.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Touch/pen devices have no hover state to track.
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setEnabled(true)

    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let raf = 0
    let seen = false

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!seen) {
        seen = true
        pos.x = e.clientX
        pos.y = e.clientY
        setVisible(true)
      }
    }

    const interactive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false
      return !!el.closest(
        'a, button, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor="pointer"]',
      )
    }

    const onOver = (e: MouseEvent) => setHovering(interactive(e.target))
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const tick = () => {
      // Critically-damped-ish follow; lower factor = longer trail.
      pos.x += (target.x - pos.x) * 0.18
      pos.y += (target.y - pos.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden items-center justify-center mix-blend-difference md:flex"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms ease' }}
    >
      <div
        className={`flex items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-300 ease-out ${
          hovering ? 'h-16 w-16 border border-transparent bg-white' : 'h-8 w-8 border border-white/50'
        }`}
      >
        <span
          className={`rounded-full bg-white transition-all duration-200 ${
            hovering ? 'h-0 w-0 opacity-0' : 'h-1.5 w-1.5 opacity-100'
          }`}
        />
      </div>
    </div>
  )
}
