'use client'

import { useEffect, useRef } from 'react'

/**
 * Ambient wireframe geometry drifting behind the page.
 *
 * Deliberately near-invisible — a handful of large, slow polygons at ~3.5%
 * opacity, felt rather than seen. It sits on a fixed layer behind all content,
 * so opaque cards occlude it and it only reads in the gaps.
 *
 * It fades to nothing while the hero is on screen: the entropy field is the
 * site's signature generative element and a second particle system competing
 * in the same viewport would dilute it.
 *
 * Pauses when the tab is hidden, and never runs under prefers-reduced-motion.
 */

interface Shape {
  x: number
  y: number
  r: number
  sides: number
  rot: number
  spin: number
  vx: number
  vy: number
}

const COUNT = 7
const BASE_ALPHA = 0.035

export function AmbientGeometry() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return

    let w = 0
    let h = 0
    let raf = 0
    let shapes: Shape[] = []
    // Eased toward 0 while the hero is visible, 1 elsewhere.
    let targetFade = 0
    let fade = 0

    let stroke = '#fafafa'
    const readStroke = () => {
      stroke =
        getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() ||
        '#fafafa'
    }
    readStroke()
    const themeObserver = new MutationObserver(readStroke)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    const seed = () => {
      const min = Math.min(w, h)
      shapes = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: min * (0.16 + Math.random() * 0.3),
        sides: 3 + Math.floor(Math.random() * 4), // triangle → hexagon
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.00016,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
      }))
    }

    const resize = () => {
      const nw = window.innerWidth
      const nh = window.innerHeight
      if (nw === w && nh === h) return
      const first = w === 0
      w = nw
      h = nh
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (first || shapes.length === 0) seed()
    }

    const frame = () => {
      fade += (targetFade - fade) * 0.04
      ctx.clearRect(0, 0, w, h)

      if (fade > 0.01) {
        ctx.strokeStyle = stroke
        ctx.lineWidth = 1
        ctx.globalAlpha = BASE_ALPHA * fade

        for (const s of shapes) {
          s.x += s.vx
          s.y += s.vy
          s.rot += s.spin

          // wrap with a margin so shapes never pop at the edge
          const m = s.r * 1.2
          if (s.x < -m) s.x = w + m
          if (s.x > w + m) s.x = -m
          if (s.y < -m) s.y = h + m
          if (s.y > h + m) s.y = -m

          ctx.beginPath()
          for (let i = 0; i <= s.sides; i++) {
            const a = s.rot + (i / s.sides) * Math.PI * 2
            const px = s.x + Math.cos(a) * s.r
            const py = s.y + Math.sin(a) * s.r
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.stroke()
        }

        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    // Hold back while the hero owns the screen.
    const hero = document.getElementById('home')
    let io: IntersectionObserver | null = null
    if (hero) {
      io = new IntersectionObserver(
        ([e]) => {
          targetFade = e.isIntersecting ? 0 : 1
        },
        { threshold: 0.12 },
      )
      io.observe(hero)
    } else {
      targetFade = 1
    }

    const onVisibility = () => (document.hidden ? stop() : start())

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    resize()
    start()

    return () => {
      stop()
      io?.disconnect()
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 block"
    />
  )
}
