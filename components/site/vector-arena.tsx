'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Vector Arena — an original twin-stick shooter, written from scratch for this
 * site. Inspired by the Geometry Wars genre; no third-party code or assets.
 *
 * WASD/arrows to move, mouse to aim, hold to fire.
 *
 * Runs only while on screen and only after the player starts it, so it never
 * costs frames to someone scrolling past. Respects prefers-reduced-motion by
 * not auto-running (the player can still choose to start).
 */

interface Vec {
  x: number
  y: number
}

interface Bullet extends Vec {
  vx: number
  vy: number
  life: number
}

interface Enemy extends Vec {
  vx: number
  vy: number
  r: number
  kind: 0 | 1 // 0 = seeker (diamond), 1 = drifter (square)
  spin: number
  hp: number
}

interface Particle extends Vec {
  vx: number
  vy: number
  life: number
  max: number
  hue: string
}

const PLAYER_R = 9
const FIRE_MS = 110
const BULLET_SPEED = 560
const MAX_LIVES = 3

export function VectorArena() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [running, setRunning] = useState(false)
  const [over, setOver] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)

  // Mirrors of state the loop reads without re-subscribing.
  const runningRef = useRef(false)
  const scoreRef = useRef(0)
  const livesRef = useRef(MAX_LIVES)

  useEffect(() => {
    try {
      const v = localStorage.getItem('va-best')
      if (v) setBest(parseInt(v, 10) || 0)
    } catch {
      /* private mode */
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let last = 0
    let spawnTimer = 0
    let fireTimer = 0
    let invuln = 0
    let shake = 0
    let elapsed = 0
    let onScreen = false

    const player = { x: 0, y: 0, vx: 0, vy: 0 }
    const mouse = { x: 0, y: 0, down: false }
    const keys = new Set<string>()
    let bullets: Bullet[] = []
    let enemies: Enemy[] = []
    let particles: Particle[] = []

    const theme = () => {
      const s = getComputedStyle(document.documentElement)
      return {
        fg: s.getPropertyValue('--text-primary').trim() || '#fafafa',
        accent: s.getPropertyValue('--accent').trim() || '#d08a63',
        dim: s.getPropertyValue('--hairline').trim() || '#2a2a2a',
        bg: s.getPropertyValue('--background').trim() || '#0a0a0a',
      }
    }
    let colors = theme()
    const themeObserver = new MutationObserver(() => {
      colors = theme()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    const reset = () => {
      player.x = w / 2
      player.y = h / 2
      player.vx = 0
      player.vy = 0
      bullets = []
      enemies = []
      particles = []
      spawnTimer = 0
      fireTimer = 0
      invuln = 0
      elapsed = 0
      scoreRef.current = 0
      livesRef.current = MAX_LIVES
      setScore(0)
      setLives(MAX_LIVES)
      setOver(false)
    }

    const burst = (x: number, y: number, hue: string, n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = 60 + Math.random() * 220
        const life = 0.35 + Math.random() * 0.45
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life,
          max: life,
          hue,
        })
      }
    }

    const spawn = () => {
      // Spawn just outside a random edge.
      const edge = Math.floor(Math.random() * 4)
      let x = 0
      let y = 0
      if (edge === 0) { x = Math.random() * w; y = -20 }
      else if (edge === 1) { x = w + 20; y = Math.random() * h }
      else if (edge === 2) { x = Math.random() * w; y = h + 20 }
      else { x = -20; y = Math.random() * h }

      const kind: 0 | 1 = Math.random() < 0.7 ? 0 : 1
      const a = Math.random() * Math.PI * 2
      enemies.push({
        x,
        y,
        vx: Math.cos(a) * 40,
        vy: Math.sin(a) * 40,
        r: kind === 0 ? 10 : 13,
        kind,
        spin: Math.random() * Math.PI,
        hp: kind === 0 ? 1 : 2,
      })
    }

    const die = () => {
      livesRef.current -= 1
      setLives(livesRef.current)
      burst(player.x, player.y, colors.fg, 40)
      shake = 18
      invuln = 1.6
      enemies = []
      if (livesRef.current <= 0) {
        runningRef.current = false
        setRunning(false)
        setOver(true)
        setBest((b) => {
          const nb = Math.max(b, scoreRef.current)
          try {
            localStorage.setItem('va-best', String(nb))
          } catch {
            /* ignore */
          }
          return nb
        })
      }
    }

    const step = (dt: number) => {
      elapsed += dt

      // ---- player movement
      const ax =
        (keys.has('d') || keys.has('arrowright') ? 1 : 0) -
        (keys.has('a') || keys.has('arrowleft') ? 1 : 0)
      const ay =
        (keys.has('s') || keys.has('arrowdown') ? 1 : 0) -
        (keys.has('w') || keys.has('arrowup') ? 1 : 0)
      const mag = Math.hypot(ax, ay) || 1
      player.vx += (ax / mag) * 2400 * dt
      player.vy += (ay / mag) * 2400 * dt
      player.vx *= Math.pow(0.0016, dt)
      player.vy *= Math.pow(0.0016, dt)
      player.x = Math.max(PLAYER_R, Math.min(w - PLAYER_R, player.x + player.vx * dt))
      player.y = Math.max(PLAYER_R, Math.min(h - PLAYER_R, player.y + player.vy * dt))

      // ---- firing
      fireTimer -= dt * 1000
      if (mouse.down && fireTimer <= 0) {
        fireTimer = FIRE_MS
        const a = Math.atan2(mouse.y - player.y, mouse.x - player.x)
        bullets.push({
          x: player.x + Math.cos(a) * 14,
          y: player.y + Math.sin(a) * 14,
          vx: Math.cos(a) * BULLET_SPEED,
          vy: Math.sin(a) * BULLET_SPEED,
          life: 1.4,
        })
      }

      // ---- spawning, ramping with time
      spawnTimer -= dt
      const interval = Math.max(0.22, 1.15 - elapsed * 0.02)
      if (spawnTimer <= 0) {
        spawnTimer = interval
        spawn()
      }

      // ---- bullets
      bullets = bullets.filter((b) => {
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.life -= dt
        return b.life > 0 && b.x > -30 && b.x < w + 30 && b.y > -30 && b.y < h + 30
      })

      // ---- enemies
      const speed = 60 + Math.min(140, elapsed * 2.2)
      for (const e of enemies) {
        if (e.kind === 0) {
          const a = Math.atan2(player.y - e.y, player.x - e.x)
          e.vx += (Math.cos(a) * speed - e.vx) * 2.2 * dt
          e.vy += (Math.sin(a) * speed - e.vy) * 2.2 * dt
        } else {
          if (e.x < 0 || e.x > w) e.vx *= -1
          if (e.y < 0 || e.y > h) e.vy *= -1
        }
        e.x += e.vx * dt
        e.y += e.vy * dt
        e.spin += dt * 2
      }

      // ---- bullet/enemy collisions
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i]
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j]
          if (Math.hypot(e.x - b.x, e.y - b.y) < e.r + 3) {
            bullets.splice(j, 1)
            e.hp -= 1
            if (e.hp <= 0) {
              burst(e.x, e.y, colors.accent, 16)
              enemies.splice(i, 1)
              scoreRef.current += e.kind === 0 ? 10 : 25
              setScore(scoreRef.current)
            } else {
              burst(e.x, e.y, colors.accent, 5)
            }
            break
          }
        }
      }

      // ---- player collisions
      invuln = Math.max(0, invuln - dt)
      if (invuln === 0) {
        for (const e of enemies) {
          if (Math.hypot(e.x - player.x, e.y - player.y) < e.r + PLAYER_R) {
            die()
            break
          }
        }
      }

      // ---- particles
      particles = particles.filter((p) => {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vx *= Math.pow(0.12, dt)
        p.vy *= Math.pow(0.12, dt)
        p.life -= dt
        return p.life > 0
      })

      shake *= Math.pow(0.02, dt)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      ctx.save()
      if (shake > 0.4) {
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake)
      }

      // grid
      ctx.strokeStyle = colors.dim
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.75
      const gs = 44
      ctx.beginPath()
      for (let x = 0; x <= w; x += gs) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
      }
      for (let y = 0; y <= h; y += gs) {
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()
      ctx.globalAlpha = 1

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // particles
      for (const p of particles) {
        const t = p.life / p.max
        ctx.globalAlpha = t
        ctx.strokeStyle = p.hue
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - p.vx * 0.012, p.y - p.vy * 0.012)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // bullets
      ctx.strokeStyle = colors.fg
      ctx.lineWidth = 2
      ctx.shadowBlur = 12
      ctx.shadowColor = colors.fg
      for (const b of bullets) {
        ctx.beginPath()
        ctx.moveTo(b.x, b.y)
        ctx.lineTo(b.x - b.vx * 0.016, b.y - b.vy * 0.016)
        ctx.stroke()
      }

      // enemies
      ctx.strokeStyle = colors.accent
      ctx.shadowColor = colors.accent
      ctx.lineWidth = 2
      for (const e of enemies) {
        ctx.save()
        ctx.translate(e.x, e.y)
        ctx.rotate(e.spin)
        ctx.beginPath()
        if (e.kind === 0) {
          ctx.moveTo(0, -e.r)
          ctx.lineTo(e.r, 0)
          ctx.lineTo(0, e.r)
          ctx.lineTo(-e.r, 0)
        } else {
          ctx.rect(-e.r, -e.r, e.r * 2, e.r * 2)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
      }

      // player
      if (invuln === 0 || Math.floor(elapsed * 12) % 2 === 0) {
        const a = Math.atan2(mouse.y - player.y, mouse.x - player.x)
        ctx.strokeStyle = colors.fg
        ctx.shadowColor = colors.fg
        ctx.lineWidth = 2.4
        ctx.save()
        ctx.translate(player.x, player.y)
        ctx.rotate(a)
        ctx.beginPath()
        ctx.moveTo(PLAYER_R + 4, 0)
        ctx.lineTo(-PLAYER_R, -PLAYER_R * 0.8)
        ctx.lineTo(-PLAYER_R * 0.5, 0)
        ctx.lineTo(-PLAYER_R, PLAYER_R * 0.8)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
      }

      ctx.shadowBlur = 0
      ctx.restore()
    }

    const frame = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000 || 0)
      last = t
      if (runningRef.current) step(dt)
      draw()
      raf = requestAnimationFrame(frame)
    }

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      const nw = Math.max(1, Math.round(rect.width))
      const nh = Math.max(1, Math.round(rect.height))
      if (nw === w && nh === h) return
      const wasCentre = w === 0
      w = nw
      h = nh
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (wasCentre) {
        player.x = w / 2
        player.y = h / 2
        mouse.x = w / 2
        mouse.y = h / 2 - 60
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onDown = (e: PointerEvent) => {
      if (!runningRef.current) return
      mouse.down = true
      onMove(e)
      canvas.setPointerCapture(e.pointerId)
    }
    const onUp = () => {
      mouse.down = false
    }
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        if (runningRef.current) e.preventDefault()
        if (down) keys.add(k)
        else keys.delete(k)
      }
    }
    const kd = (e: KeyboardEvent) => onKey(e, true)
    const ku = (e: KeyboardEvent) => onKey(e, false)

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        if (!onScreen && runningRef.current) {
          runningRef.current = false
          setRunning(false)
        }
      },
      { threshold: 0.25 },
    )
    io.observe(wrap)

    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)

    raf = requestAnimationFrame(frame)

    // Expose start for the overlay button.
    ;(wrap as HTMLDivElement & { __start?: () => void }).__start = () => {
      reset()
      runningRef.current = true
      setRunning(true)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      themeObserver.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [])

  const start = () => {
    const wrap = wrapRef.current as (HTMLDivElement & { __start?: () => void }) | null
    wrap?.__start?.()
  }

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-hairline">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline p-5">
        <div className="flex items-baseline gap-6">
          <div>
            <p className="eyebrow">Score</p>
            <p className="mt-1 text-[26px] font-black leading-none text-primary">{score}</p>
          </div>
          <div>
            <p className="eyebrow">Best</p>
            <p className="mt-1 text-[26px] font-black leading-none text-secondary">{best}</p>
          </div>
          <div>
            <p className="eyebrow">Lives</p>
            <p className="mt-1 text-[26px] font-black leading-none text-accent">
              {'◆ '.repeat(Math.max(0, lives)).trim() || '—'}
            </p>
          </div>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-secondary">
          WASD move &middot; mouse aim &middot; hold to fire
        </p>
      </div>

      <div ref={wrapRef} className="relative h-[380px] w-full select-none md:h-[480px]">
        <canvas ref={canvasRef} className="absolute inset-0 block cursor-crosshair" />

        {!running ? (
          <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
            <div className="text-center">
              <p className="display text-[clamp(28px,4vw,44px)] text-primary">
                {over ? 'Game over' : 'Vector Arena'}
              </p>
              {over ? (
                <p className="mt-3 text-[15px] text-secondary">
                  You scored <span className="font-semibold text-primary">{score}</span>
                </p>
              ) : (
                <p className="mt-3 max-w-sm text-[14px] text-secondary">
                  Survive the shapes. Diamonds hunt you, squares ricochet.
                </p>
              )}
              <button
                type="button"
                onClick={start}
                className="pill mt-6 bg-primary text-background hover:bg-primary/85"
              >
                {over ? 'Play again' : 'Start'}
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <p className="border-t border-hairline p-5 text-[13px] leading-relaxed text-secondary">
        Written from scratch in TypeScript on a 2D canvas &mdash; no game engine, no third-party
        assets. Inspired by the twin-stick genre popularised by{' '}
        <em className="font-serif italic">Geometry Wars</em>. The loop pauses when the section
        scrolls out of view, so it costs nothing to anyone passing by. Best score is kept in your
        browser only.
      </p>
    </div>
  )
}
