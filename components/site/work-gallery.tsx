'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { work } from '@/lib/content'

/**
 * Desktop: the section pins and the rail translates sideways as you scroll —
 * vertical scroll distance is mapped onto horizontal travel.
 * Below the breakpoint (or under reduced motion) it degrades to a normal
 * swipeable row, which is what a touch device wants anyway.
 */
export function WorkGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [pinnedHeight, setPinnedHeight] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const rail = railRef.current
    if (!section || !rail) return

    const desktop = window.matchMedia('(min-width: 1024px)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let range = 0
    let raf = 0

    const enabled = () => desktop.matches && !motion.matches

    const measure = () => {
      if (!enabled()) {
        range = 0
        setPinnedHeight(null)
        rail.style.transform = ''
        return
      }
      range = Math.max(0, rail.scrollWidth - window.innerWidth + 96)
      setPinnedHeight(range + window.innerHeight)
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (!enabled() || range <= 0) return
        const rect = section.getBoundingClientRect()
        // 0 while the top is at the viewport top, 1 once we've scrolled `range`.
        const progress = Math.min(1, Math.max(0, -rect.top / range))
        rail.style.transform = `translate3d(${-progress * range}px,0,0)`
      })
    }

    measure()
    onScroll()

    const ro = new ResizeObserver(measure)
    ro.observe(rail)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    desktop.addEventListener('change', measure)
    motion.addEventListener('change', measure)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
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
      <div className={pinnedHeight ? 'sticky top-0 flex h-screen items-center overflow-hidden' : ''}>
        <div
          ref={railRef}
          className={
            pinnedHeight
              ? 'flex gap-6 px-6 will-change-transform md:px-10'
              : 'no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:px-10'
          }
        >
          {work.map((project, i) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group flex w-[300px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-hairline p-7 transition-colors duration-300 hover:border-primary/50 hover:bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] sm:w-[360px] lg:h-[420px] lg:w-[420px]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.24em] text-secondary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="eyebrow">{project.category}</span>
                </div>
                <h3 className="display mt-8 text-[clamp(22px,2.4vw,30px)] text-primary">
                  {project.title}
                </h3>
                <p className="mt-4 text-[15px] font-light leading-relaxed text-secondary">
                  {project.summary}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between">
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
