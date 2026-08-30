'use client'

import { useEffect, useState } from 'react'
import { nav, site } from '@/lib/content'
import { ThemeToggle } from './theme-toggle'

export function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = nav.map((n) => n.id)
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-hairline bg-background/85 backdrop-blur-xl' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#home"
          className="text-[15px] font-black uppercase tracking-[0.14em] text-primary"
        >
          {site.mark}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-[11px] uppercase tracking-[0.22em] transition-colors hover:text-primary ${
                active === item.id ? 'text-primary' : 'text-secondary'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a href="#contact" className="pill border border-primary text-primary hover:bg-primary hover:text-background">
            Let&rsquo;s talk
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center text-primary"
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ${
                  open ? 'top-2 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-2 block h-px w-6 bg-current transition-opacity duration-200 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ${
                  open ? 'top-2 -rotate-45' : 'top-4'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`overflow-hidden border-t border-hairline bg-background transition-[max-height] duration-400 md:hidden ${
          open ? 'max-h-[420px]' : 'max-h-0 border-t-0'
        }`}
      >
        <nav className="flex flex-col px-6 py-4" aria-label="Mobile">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="border-b border-hairline py-4 text-sm uppercase tracking-[0.2em] text-secondary last:border-b-0 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
