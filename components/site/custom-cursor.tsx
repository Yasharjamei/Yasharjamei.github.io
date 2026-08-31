'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A single continuous line that follows the pointer and changes shape to
 * express what it is doing.
 *
 * Inspired by the one-unbroken-stroke idiom of Cavandoli's *La Linea*, where
 * the line's own form carries the mood. The character itself is copyrighted, so
 * this borrows the idea — an expressive line on a solid ground — not the figure.
 *
 * Four states, blended continuously:
 *   idle     slow rolling wave, the line breathing
 *   taut     moving fast: amplitude collapses, the line pulls straight
 *   curious  over something clickable: tight high-frequency coil + a ring
 *   spike    while pressed: the wave snaps to a hard zigzag
 *
 * Drawn on a fixed canvas with mix-blend-difference so it reads over both
 * themes. Augments the native cursor rather than replacing it, so pointer
 * affordances survive. Off on coarse pointers and under prefers-reduced-motion.
 */

const TRAIL = 30
const HEAD_LERP = 0.32

interface Pt {
  x: number
  y: number
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let t = 0
    let seen = false

    let hovering = false
    let pressing = false

    // Blended state weights.
    let curious = 0
    let spike = 0
    let taut = 0

    const target = { x: -300, y: -300 }
    const head = { x: -300, y: -300 }
    const pts: Pt[] = []

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const interactive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false
      return !!el.closest(
        'a, button, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor="pointer"]',
      )
    }

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!seen) {
        seen = true
        head.x = target.x
        head.y = target.y
        for (let i = 0; i < TRAIL; i++) pts.push({ x: head.x, y: head.y })
      }
    }
    const onOver = (e: MouseEvent) => {
      hovering = interactive(e.target)
    }
    const onDown = () => {
      pressing = true
    }
    const onUp = () => {
      pressing = false
    }
    const onLeave = () => {
      seen = false
      pts.length = 0
    }

    /** Triangle wave in [-1,1] — the hard edge that reads as agitation. */
    const tri = (x: number) => (2 / Math.PI) * Math.asin(Math.sin(x))

    const frame = () => {
      t += 1 / 60

      const dx = target.x - head.x
      const dy = target.y - head.y
      const speed = Math.hypot(dx, dy)

      head.x += dx * HEAD_LERP
      head.y += dy * HEAD_LERP

      curious += ((hovering ? 1 : 0) - curious) * 0.12
      spike += ((pressing ? 1 : 0) - spike) * 0.22
      taut += (Math.min(1, speed / 26) - taut) * 0.16

      if (seen) {
        pts.push({ x: head.x, y: head.y })
        while (pts.length > TRAIL) pts.shift()
      }

      ctx.clearRect(0, 0, w, h)

      if (pts.length > 3) {
        // Shape parameters per state, blended.
        const calm = Math.max(0, 1 - taut)
        const amp = (5.5 * calm + 11 * curious + 9 * spike) * (1 - taut * 0.65)
        const freq = 0.55 + curious * 0.9 + spike * 1.5
        const speedPhase = t * (2.4 + curious * 2 + spike * 7)

        // Displace each trail point perpendicular to its local tangent.
        const shaped: Pt[] = []
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i]
          const prev = pts[Math.max(0, i - 1)]
          const next = pts[Math.min(pts.length - 1, i + 1)]
          let tx = next.x - prev.x
          let ty = next.y - prev.y
          const len = Math.hypot(tx, ty) || 1
          tx /= len
          ty /= len
          // perpendicular
          const nx = -ty
          const ny = tx

          const f = i / (pts.length - 1) // 0 tail → 1 head
          const phase = i * freq - speedPhase
          const wave = spike > 0.5 ? tri(phase) : Math.sin(phase) * (1 - spike) + tri(phase) * spike
          // taper the displacement toward the head so it stays anchored
          const a = amp * Math.sin(f * Math.PI)

          shaped.push({ x: p.x + nx * wave * a, y: p.y + ny * wave * a })
        }

        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = '#ffffff'

        for (let i = 1; i < shaped.length - 1; i++) {
          const p0 = shaped[i - 1]
          const p1 = shaped[i]
          const p2 = shaped[i + 1]
          const f = i / (shaped.length - 1)

          ctx.lineWidth = Math.max(0.35, (1.1 + 1.7 * f) * (1 + curious * 0.5 + spike * 0.6))
          ctx.globalAlpha = 0.12 + f * 0.88

          ctx.beginPath()
          ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2)
          ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
          ctx.stroke()
        }

        // Curious: the head curls into a ring, the way the line closes on an object.
        if (curious > 0.02) {
          ctx.globalAlpha = curious * 0.9
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.arc(head.x, head.y, 6 + curious * 11 - spike * 3, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] hidden mix-blend-difference md:block"
    />
  )
}
