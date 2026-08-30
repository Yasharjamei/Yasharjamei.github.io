'use client'

import { useEffect } from 'react'

/**
 * Applies the supplied globals.css viewport lock
 * (position: fixed; overflow: hidden) to <html> for this route only.
 * The rule ships in globals.css as `.lock-viewport` rather than on html/body,
 * so the rest of the site can scroll.
 */
export function LockViewport() {
  useEffect(() => {
    const el = document.documentElement
    el.classList.add('lock-viewport')
    return () => el.classList.remove('lock-viewport')
  }, [])

  return null
}
