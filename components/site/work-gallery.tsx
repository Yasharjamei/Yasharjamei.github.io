'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { work } from '@/lib/content'
import { asset } from '@/lib/paths'

/**
 * Selected Work as 3D cards.
 *
 * Desktop: the section pins and the rail translates sideways as you scroll —
 * vertical scroll distance is mapped onto horizontal travel. Below the
 * breakpoint it is a normal swipeable row.
 *
 * On top of that, every card lives in 3D:
 *   - coverflow: each card turns on its Y axis by how far it sits from the
 *     viewport centre, so cards swing toward you as they arrive and away as
 *     they leave. Driven by rail position, so it works for both the pinned
 *     rail and the touch swipe row.
 *   - tilt: on a fine pointer the hovered card tilts toward the cursor, with a
 *     moving specular glare.
 *   - depth: the screenshot, title and tags sit on separate translateZ layers,
 *     so the card has real parallax rather than a flat rotated image.
 *
 * Pure CSS 3D transforms updated from one rAF loop — no WebGL, no dependency.
 * prefers-reduced-motion flattens everything back to 2D.
 */

const MAX_TURN = 38 // deg of coverflow rotation at the edges
const MAX_TILT = 12 // deg of pointer tilt

export function WorkGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const [pinnedHeight, setPinnedHeight] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const rail = railRef.current
    if (!section || !rail) return

    const desktop = window.matchMedia('(min-width: 1024px)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')

    let range = 0
    let raf = 0

    // Per-card pointer tilt, eased so it settles smoothly on leave.
    const tilt = work.map(() => ({ x: 0, y: 0, tx: 0, ty: 0, gx: 50, gy: 50 }))

    const pinned = () => desktop.matches && !motion.matches

    const measure = () => {
      if (!pinned()) {
        range = 0
        setPinnedHeight(null)
        rail.style.transform = ''
      } else {
        range = Math.max(0, rail.scrollWidth - window.innerWidth + 96)
        setPinnedHeight(range + window.innerHeight)
      }
      schedule()
    }

    const paint = () => {
      raf = 0

      if (pinned() && range > 0) {
        const rect = section.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, -rect.top / range))
        rail.style.transform = `translate3d(${-progress * range}px,0,0)`
      }

      const flat = motion.matches
      const mid = window.innerWidth / 2
      let settling = false

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const inner = card.firstElementChild as HTMLElement | null
        if (!inner) return

        if (flat) {
          inner.style.transform = ''
          return
        }

        // coverflow from horizontal distance to viewport centre
        const r = card.getBoundingClientRect()
        const offset = (r.left + r.width / 2 - mid) / mid // -1 … 1 across the screen
        const clamped = Math.max(-1.4, Math.min(1.4, offset))
        const turn = -clamped * MAX_TURN
        const sink = -Math.abs(clamped) * 120
        const lift = Math.abs(clamped) * 14

        const t = tilt[i]
        t.x += (t.tx - t.x) * 0.14
        t.y += (t.ty - t.y) * 0.14
        if (Math.abs(t.tx - t.x) > 0.02 || Math.abs(t.ty - t.y) > 0.02) settling = true

        inner.style.transform =
          `translateY(${lift}px) translateZ(${sink}px) ` +
          `rotateY(${turn + t.y}deg) rotateX(${t.x}deg)`
        inner.style.setProperty('--gx', `${t.gx}%`)
        inner.style.setProperty('--gy', `${t.gy}%`)
        card.style.opacity = String(1 - Math.min(0.45, Math.abs(clamped) * 0.3))
      })

      if (settling) schedule()
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }

    // pointer tilt, fine pointers only
    const cleanups: (() => void)[] = []
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const move = (e: PointerEvent) => {
        if (!fine.matches || motion.matches) return
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        tilt[i].ty = (px - 0.5) * MAX_TILT * 2
        tilt[i].tx = -(py - 0.5) * MAX_TILT * 2
        tilt[i].gx = px * 100
        tilt[i].gy = py * 100
        schedule()
      }
      const leave = () => {
        tilt[i].tx = 0
        tilt[i].ty = 0
        schedule()
      }
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerleave', leave)
      cleanups.push(() => {
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerleave', leave)
      })
    })

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(rail)
    window.addEventListener('scroll', schedule, { passive: true })
    rail.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    desktop.addEventListener('change', measure)
    motion.addEventListener('change', measure)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      cleanups.forEach((fn) => fn())
      ro.disconnect()
      window.removeEventListener('scroll', schedule)
      rail.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      desktop.removeEventListener('change', measure)
      motion.removeEventListener('change', measure)
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      style={pinnedHeight ? { height: pinnedHeight } : undefined}
      className="relative mt-14"
    >
      <div
        className={pinnedHeight ? 'sticky top-0 flex h-screen items-center overflow-hidden' : ''}
        style={{ perspective: '1400px', perspectiveOrigin: '50% 45%' }}
      >
        <div
          ref={railRef}
          style={{ transformStyle: 'preserve-3d' }}
          className={
            pinnedHeight
              ? 'flex gap-10 px-[18vw] will-change-transform'
              : 'no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-[12vw] py-10'
          }
        >
          {work.map((project, i) => (
            <Link
              key={project.slug}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              href={`/work/${project.slug}`}
              style={{ perspective: '1000px' }}
              className="group block w-[300px] shrink-0 snap-center transition-opacity duration-300 sm:w-[360px] lg:w-[440px]"
            >
              <article
                style={{ transformStyle: 'preserve-3d' }}
                className="relative flex h-full flex-col rounded-2xl border border-hairline bg-background p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] transition-colors duration-300 will-change-transform group-hover:border-primary/50 lg:h-[560px]"
              >
                {/* specular glare that follows the pointer */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(circle at var(--gx,50%) var(--gy,50%), color-mix(in srgb, var(--foreground) 12%, transparent), transparent 55%)',
                  }}
                />

                <div
                  className="flex items-center justify-between"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <span className="font-mono text-[11px] tracking-[0.24em] text-secondary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="eyebrow">{project.category}</span>
                </div>

                {/* the screenshot as a floating screen with its own depth */}
                <div className="relative mt-6" style={{ transformStyle: 'preserve-3d' }}>
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-6 -bottom-4 h-8 rounded-[50%] bg-black/40 blur-xl"
                    style={{ transform: 'translateZ(-20px)' }}
                  />
                  <div
                    className="relative overflow-hidden rounded-xl border border-hairline bg-elevated"
                    style={{
                      transform: 'translateZ(60px) rotateX(6deg)',
                      boxShadow:
                        '0 1px 0 color-mix(in srgb, var(--foreground) 18%, transparent) inset, 0 24px 48px -20px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(`/projects/${project.slug}.png`)}
                      alt={`${project.title} — dashboard screenshot`}
                      loading="lazy"
                      decoding="async"
                      className="h-[190px] w-full object-cover object-top lg:h-[220px]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent"
                    />
                  </div>
                </div>

                <div style={{ transform: 'translateZ(45px)' }} className="mt-8">
                  <h3 className="display text-[clamp(20px,2.2vw,26px)] text-primary">
                    {project.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[14px] font-normal leading-relaxed text-secondary">
                    {project.summary}
                  </p>
                </div>

                <div
                  className="mt-auto flex items-center justify-between pt-8"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  <ul className="flex flex-wrap gap-1.5">
                    {project.tools.slice(0, 3).map((tool) => (
                      <li
                        key={tool}
                        className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-secondary"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                  <span className="text-[13px] font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
