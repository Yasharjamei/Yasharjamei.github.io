'use client'

import { useEffect, useRef } from 'react'

export interface EntropyFieldProps {
  className?: string
  /** Particle colour on the ordered (left) side. */
  orderColor?: string
  /** Particle colour on the chaotic (right) side. */
  chaosColor?: string
  /** Colour of connecting lines and the centre divider. */
  lineColor?: string
  /** Approximate px between particles in the starting lattice. */
  spacing?: number
  /** Radius within which two particles count as neighbours. */
  neighborRadius?: number
  /** Radius within which a connecting line is drawn. */
  linkRadius?: number
  /** Draw the vertical centre divider. */
  divider?: boolean
  /** Particle dot radius in px. */
  dotSize?: number
}

/** #rrggbb (or #rgb) -> rgba(), so colours aren't limited to 6-digit hex. */
function withAlpha(hex: string, alpha: number): string {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface P {
  x: number
  y: number
  originalX: number
  originalY: number
  order: boolean
  vx: number
  vy: number
  influence: number
  neighbors: P[]
}

/**
 * Order-to-chaos particle field. Unlike `Entropy`, this fills its parent
 * (any aspect ratio), is fully themeable, uses a spatial hash for the
 * neighbour search so it stays cheap at hero size, and honours
 * prefers-reduced-motion by painting a single static frame.
 */
export function EntropyField({
  className = '',
  orderColor = '#202825',
  chaosColor = '#b36d4d',
  lineColor = '#171717',
  spacing = 22,
  neighborRadius = 90,
  linkRadius = 46,
  divider = true,
  dotSize = 1.6,
}: EntropyFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduceMotion = motionQuery.matches

    let w = 0
    let h = 0
    let raf = 0
    let time = 0
    let particles: P[] = []

    const buckets = new Map<string, P[]>()

    const rebuildNeighbors = () => {
      buckets.clear()
      for (const p of particles) {
        const k = `${Math.floor(p.x / neighborRadius)},${Math.floor(p.y / neighborRadius)}`
        const b = buckets.get(k)
        if (b) b.push(p)
        else buckets.set(k, [p])
      }
      for (const p of particles) {
        const cx = Math.floor(p.x / neighborRadius)
        const cy = Math.floor(p.y / neighborRadius)
        const found: P[] = []
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const b = buckets.get(`${cx + i},${cy + j}`)
            if (!b) continue
            for (const o of b) {
              if (o === p) continue
              if (Math.hypot(p.x - o.x, p.y - o.y) < neighborRadius) found.push(o)
            }
          }
        }
        p.neighbors = found
      }
    }

    const seed = () => {
      particles = []
      const cols = Math.max(2, Math.round(w / spacing))
      const rows = Math.max(2, Math.round(h / spacing))
      const sx = w / cols
      const sy = h / rows
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = sx * i + sx / 2
          const y = sy * j + sy / 2
          particles.push({
            x,
            y,
            originalX: x,
            originalY: y,
            order: x < w / 2,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            influence: 0,
            neighbors: [],
          })
        }
      }
      rebuildNeighbors()
    }

    const update = (p: P) => {
      if (p.order) {
        const dx = p.originalX - p.x
        const dy = p.originalY - p.y
        let cix = 0
        let ciy = 0
        for (const n of p.neighbors) {
          if (n.order) continue
          const d = Math.hypot(p.x - n.x, p.y - n.y)
          const strength = Math.max(0, 1 - d / neighborRadius)
          cix += n.vx * strength
          ciy += n.vy * strength
          p.influence = Math.max(p.influence, strength)
        }
        p.x += dx * 0.05 * (1 - p.influence) + cix * p.influence
        p.y += dy * 0.05 * (1 - p.influence) + ciy * p.influence
        p.influence *= 0.99
      } else {
        p.vx = (p.vx + (Math.random() - 0.5) * 0.5) * 0.95
        p.vy = (p.vy + (Math.random() - 0.5) * 0.5) * 0.95
        p.x += p.vx
        p.y += p.vy
        if (p.x < w / 2 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        p.x = Math.max(w / 2, Math.min(w, p.x))
        p.y = Math.max(0, Math.min(h, p.y))
      }
    }

    const frame = () => {
      ctx.clearRect(0, 0, w, h)

      if (time % 30 === 0) rebuildNeighbors()

      for (const p of particles) {
        update(p)

        for (const n of p.neighbors) {
          const d = Math.hypot(p.x - n.x, p.y - n.y)
          if (d >= linkRadius) continue
          ctx.strokeStyle = withAlpha(lineColor, 0.16 * (1 - d / linkRadius))
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(n.x, n.y)
          ctx.stroke()
        }

        const alpha = p.order ? 0.75 - p.influence * 0.35 : 0.8
        ctx.fillStyle = withAlpha(p.order ? orderColor : chaosColor, alpha)
        ctx.beginPath()
        ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2)
        ctx.fill()
      }

      if (divider) {
        ctx.strokeStyle = withAlpha(lineColor, 0.22)
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(w / 2, 0)
        ctx.lineTo(w / 2, h)
        ctx.stroke()
      }

      time++
      if (!reduceMotion) raf = requestAnimationFrame(frame)
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      const nextW = Math.max(1, Math.round(rect.width))
      const nextH = Math.max(1, Math.round(rect.height))
      if (nextW === w && nextH === h) return
      w = nextW
      h = nextH
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      if (reduceMotion) frame()
    }

    const start = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(frame)
    }

    // Re-evaluate live: the preference can change after mount, and capturing it
    // once permanently freezes the field on a single frame.
    const onMotionChange = () => {
      reduceMotion = motionQuery.matches
      host.dataset.reducedMotion = String(reduceMotion)
      if (reduceMotion) {
        if (raf) cancelAnimationFrame(raf)
        raf = 0
        frame()
      } else {
        start()
      }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()
    host.dataset.reducedMotion = String(reduceMotion)
    motionQuery.addEventListener('change', onMotionChange)
    if (!reduceMotion) start()

    return () => {
      ro.disconnect()
      motionQuery.removeEventListener('change', onMotionChange)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [orderColor, chaosColor, lineColor, spacing, neighborRadius, linkRadius, divider, dotSize])

  return (
    <div ref={hostRef} className={`relative h-full w-full ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
