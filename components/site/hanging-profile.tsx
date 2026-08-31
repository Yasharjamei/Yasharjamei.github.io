'use client'

import { useEffect, useRef } from 'react'
import { site } from '@/lib/content'

/**
 * A profile card hanging from a rope, swinging as a real pendulum
 * (a = -g/L Â· sin Î¸) with light damping. Drag it and let go.
 *
 * Adapted from the `HangingProfile` widget in xkintaro/kintarowwwards
 * (MIT, Â© 2026 Mustafa TAÅžAL). Reworked for this site's tokens, with the
 * animation loop paused off-screen and under prefers-reduced-motion.
 */
export function HangingProfile() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const ropeRef = useRef<SVGLineElement>(null)

  const GRAVITY = 1.2
  const ROPE_LENGTH = 170
  const DAMPING = 0.995
  const ORIGIN_X = 150

  const state = useRef({
    angle: 0.5,
    velocity: 0,
    dragging: false,
    dragX: 0,
    dragY: 0,
    length: ROPE_LENGTH,
  })

  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current
    const rope = ropeRef.current
    if (!container || !card || !rope) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduceMotion = motionQuery.matches
    let raf = 0
    let onScreen = false

    const render = () => {
      const s = state.current
      const x = s.length * Math.sin(s.angle)
      const y = s.length * Math.cos(s.angle)
      rope.setAttribute('x2', String(ORIGIN_X + x))
      rope.setAttribute('y2', String(y))
      card.style.transform = `translate(${x}px, ${y}px) rotate(${-s.angle}rad)`
    }

    const tick = () => {
      const s = state.current

      if (!s.dragging) {
        s.length += (ROPE_LENGTH - s.length) * 0.1
        s.velocity += (-GRAVITY / s.length) * Math.sin(s.angle)
        s.velocity *= DAMPING
        s.angle += s.velocity
      } else {
        const dx = s.dragX
        const dy = Math.max(s.dragY, 10)
        const targetAngle = Math.atan2(dx, dy)
        let targetLength = Math.hypot(dx, dy)

        // Let the rope stretch a little, but never collapse.
        if (targetLength > ROPE_LENGTH) {
          targetLength = ROPE_LENGTH + (targetLength - ROPE_LENGTH) * 0.2
        } else if (targetLength < ROPE_LENGTH * 0.3) {
          targetLength = ROPE_LENGTH * 0.3
        }

        s.angle += (targetAngle - s.angle) * 0.4
        s.length += (targetLength - s.length) * 0.4
        s.velocity = 0
      }

      render()
      raf = onScreen && !reduceMotion ? requestAnimationFrame(tick) : 0
    }

    const start = () => {
      if (raf || reduceMotion || !onScreen) return
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    // Don't burn frames while the section is scrolled out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        if (onScreen) start()
        else stop()
      },
      { threshold: 0 },
    )
    io.observe(container)

    const onMotionChange = () => {
      reduceMotion = motionQuery.matches
      if (reduceMotion) {
        stop()
        state.current.angle = 0
        state.current.velocity = 0
        state.current.length = ROPE_LENGTH
        render()
      } else {
        start()
      }
    }
    motionQuery.addEventListener('change', onMotionChange)

    render()

    return () => {
      stop()
      io.disconnect()
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    const container = containerRef.current
    const card = cardRef.current
    if (!container || !card) return

    state.current.dragging = true
    card.style.cursor = 'grabbing'

    const move = (ev: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      state.current.dragX = ev.clientX - rect.left - rect.width / 2
      state.current.dragY = ev.clientY - rect.top
    }

    const up = () => {
      state.current.dragging = false
      card.style.cursor = 'grab'
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }

    move(e.nativeEvent as PointerEvent)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const initials = site.name
    .split(' ')
    .map((p) => p[0])
    .join('')

  return (
    <div
      ref={containerRef}
      className="relative flex h-[340px] w-[300px] justify-center"
      aria-hidden="true"
    >
      <svg className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible">
        <line
          ref={ropeRef}
          x1={ORIGIN_X}
          y1="0"
          x2={ORIGIN_X}
          y2={ROPE_LENGTH}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-primary/25"
        />
        <circle cx={ORIGIN_X} cy="0" r="5" fill="currentColor" className="text-primary/40" />
        <circle cx={ORIGIN_X} cy="0" r="2" fill="currentColor" className="text-background" />
      </svg>

      <div
        ref={cardRef}
        onPointerDown={onPointerDown}
        style={{ left: '50%', marginLeft: '-70px', transformOrigin: 'center top', touchAction: 'none' }}
        className="group absolute top-0 flex w-[140px] cursor-grab select-none flex-col items-center rounded-2xl border border-hairline bg-elevated p-4 backdrop-blur-md transition-colors duration-300 hover:border-primary/40"
      >
        <div className="pointer-events-none mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-hairline bg-elevated">
          <span className="font-black tracking-[0.08em] text-[22px] text-primary/70 transition-colors duration-300 group-hover:text-primary">
            {initials}
          </span>
        </div>
        <div className="pointer-events-none flex flex-col items-center gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/85">
            {site.name}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-secondary">
            Spatial Analyst
          </span>
        </div>
        <span className="absolute left-1/2 top-0 -mt-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-hairline bg-background" />
      </div>
    </div>
  )
}
