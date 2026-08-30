'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export const THEME_KEY = 'yj-theme'

/**
 * Runs before paint (see layout.tsx) so the stored theme is applied without a
 * flash of the wrong palette. Kept as a string because it is injected raw.
 */
export const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('${THEME_KEY}');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme')
    setTheme(current === 'light' ? 'light' : 'dark')
    setMounted(true)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    setTheme(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* private mode — the toggle still works for this page view */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-primary transition-colors hover:border-primary ${className}`}
    >
      {/* Render nothing until mounted so SSR markup can't contradict the DOM. */}
      {mounted ? (
        theme === 'dark' ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        )
      ) : (
        <span className="block h-[15px] w-[15px]" />
      )}
    </button>
  )
}
