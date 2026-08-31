'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Map as LeafletMap, CircleMarker, Circle, LayerGroup } from 'leaflet'
import { asset } from '@/lib/paths'
import 'leaflet/dist/leaflet.css'

/**
 * Live 20-minute-neighbourhood access tool.
 *
 * Drop an origin, pick a walk time, and it reports which daily-needs
 * destinations fall inside the catchment, by category — the same question the
 * "20-Minute Neighbourhood Access" case study answers, running in the browser.
 *
 * Data: OpenStreetMap contributors (ODbL), Melton VIC extract, baked in at
 * build time. Nothing council-held is used here.
 *
 * Method note: this is a straight-line (Euclidean) catchment. Production work
 * uses network distance over the road/path graph, which is always smaller and
 * shape-irregular. The UI says so rather than implying otherwise.
 */

const CATEGORIES = [
  { key: 'education', label: 'Education', color: '#6ea8fe' },
  { key: 'openspace', label: 'Open space', color: '#71c98a' },
  { key: 'shops', label: 'Shops', color: '#e6b356' },
  { key: 'health', label: 'Health', color: '#e2726e' },
  { key: 'bus', label: 'Bus stops', color: '#b58ce0' },
  { key: 'station', label: 'Stations', color: '#f0f0f0' },
  { key: 'community', label: 'Community', color: '#5fc9c3' },
] as const

type CatKey = (typeof CATEGORIES)[number]['key']

interface Feature {
  geometry: { coordinates: [number, number] }
  properties: { c: CatKey; n: string | null }
}

/** Victorian policy frames it as a 20-minute *return* trip — 10 min each way. */
const WALK_OPTIONS = [
  { label: '5 min', metres: 400 },
  { label: '10 min', metres: 800 },
  { label: '15 min', metres: 1200 },
]

const MELTON: [number, number] = [-37.6835, 144.5834]

/** Metres between two lon/lat points (haversine). */
function distance(a: [number, number], b: [number, number]) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[1] - a[1])
  const dLon = toRad(b[0] - a[0])
  const lat1 = toRad(a[1])
  const lat2 = toRad(b[1])
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function CatchmentMap() {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const layerRef = useRef<LayerGroup | null>(null)
  const ringRef = useRef<Circle | null>(null)
  const originRef = useRef<CircleMarker | null>(null)
  const tileRef = useRef<import('leaflet').TileLayer | null>(null)
  const leafletRef = useRef<typeof import('leaflet') | null>(null)

  const [features, setFeatures] = useState<Feature[]>([])
  const [origin, setOrigin] = useState<[number, number]>([MELTON[1], MELTON[0]])
  const [radius, setRadius] = useState(800)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const counts = useMemo(() => {
    const out: Record<string, number> = {}
    for (const c of CATEGORIES) out[c.key] = 0
    for (const f of features) {
      if (distance(origin, f.geometry.coordinates) <= radius) out[f.properties.c]++
    }
    return out
  }, [features, origin, radius])

  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts])

  // Load data + Leaflet, then build the map once.
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const [L, res] = await Promise.all([
          import('leaflet'),
          fetch(asset('/data/melton-amenities.geojson')),
        ])
        if (!res.ok) throw new Error(`data ${res.status}`)
        const json = await res.json()
        if (cancelled || !hostRef.current) return

        leafletRef.current = L
        setFeatures(json.features as Feature[])

        const map = L.map(hostRef.current, {
          center: MELTON,
          zoom: 13,
          scrollWheelZoom: false,
          attributionControl: true,
        })
        mapRef.current = map

        tileRef.current = L.tileLayer(tileUrl(), {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 18,
        }).addTo(map)

        layerRef.current = L.layerGroup().addTo(map)

        map.on('click', (e) => setOrigin([e.latlng.lng, e.latlng.lat]))

        setReady(true)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'failed to load')
      }
    })()

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // Repaint points, ring and origin whenever inputs change.
  useEffect(() => {
    const L = leafletRef.current
    const map = mapRef.current
    const layer = layerRef.current
    if (!L || !map || !layer || !ready) return

    layer.clearLayers()

    for (const f of features) {
      const [lon, lat] = f.geometry.coordinates
      const inside = distance(origin, [lon, lat]) <= radius
      const colour = CATEGORIES.find((c) => c.key === f.properties.c)?.color ?? '#888'
      L.circleMarker([lat, lon], {
        radius: f.properties.c === 'bus' ? 3 : 5,
        color: colour,
        weight: inside ? 1.5 : 0.6,
        opacity: inside ? 1 : 0.28,
        fillColor: colour,
        fillOpacity: inside ? 0.85 : 0.12,
      })
        .bindTooltip(f.properties.n ?? 'Bus stop', { direction: 'top' })
        .addTo(layer)
    }

    ringRef.current?.remove()
    ringRef.current = L.circle([origin[1], origin[0]], {
      radius,
      color: '#d08a63',
      weight: 1.5,
      fillColor: '#d08a63',
      fillOpacity: 0.06,
      dashArray: '4 4',
    }).addTo(map)

    originRef.current?.remove()
    originRef.current = L.circleMarker([origin[1], origin[0]], {
      radius: 6,
      color: '#ffffff',
      weight: 2,
      fillColor: '#d08a63',
      fillOpacity: 1,
    }).addTo(map)
  }, [features, origin, radius, ready])

  // Follow the light/dark toggle with a matching basemap.
  useEffect(() => {
    const swap = () => tileRef.current?.setUrl(tileUrl())
    const mo = new MutationObserver(swap)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-hairline">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline p-5">
        <div>
          <p className="eyebrow">Try it &mdash; click the map to move the origin</p>
          <p className="mt-2 text-[15px] text-primary">
            {total} destinations within a{' '}
            <span className="font-semibold text-accent">
              {WALK_OPTIONS.find((w) => w.metres === radius)?.label}
            </span>{' '}
            walk
          </p>
        </div>
        <div className="flex gap-2">
          {WALK_OPTIONS.map((w) => (
            <button
              key={w.metres}
              type="button"
              onClick={() => setRadius(w.metres)}
              className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                radius === w.metres
                  ? 'border-primary bg-primary text-background'
                  : 'border-hairline text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div ref={hostRef} className="h-[420px] w-full md:h-[520px]" />
        {!ready && !error ? (
          <div className="absolute inset-0 grid place-items-center bg-background">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary">
              Loading map&hellip;
            </p>
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-0 grid place-items-center bg-background p-6 text-center">
            <p className="text-[14px] text-secondary">
              Map unavailable ({error}). The analysis below still describes the method.
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-hairline bg-hairline sm:grid-cols-4 lg:grid-cols-7">
        {CATEGORIES.map((c) => (
          <div key={c.key} className="bg-background p-4">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: c.color }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-secondary">
                {c.label}
              </span>
            </div>
            <p className="mt-2 text-[26px] font-black leading-none text-primary">
              {counts[c.key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <p className="border-t border-hairline p-5 text-[13px] leading-relaxed text-secondary">
        <strong className="font-semibold text-primary">Method:</strong> straight-line catchment
        from the selected origin. Real assessments use network distance along the walkable path
        graph, which yields a smaller, irregular catchment shaped by road layout, crossings and
        barriers &mdash; a creek or freeway can put a park 200&nbsp;m away and 15&nbsp;minutes
        distant. Victorian policy frames the 20-minute neighbourhood as a{' '}
        <em className="font-serif italic">return</em> trip, so 800&nbsp;m is the working threshold
        for a 10-minute walk each way. Features:{' '}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-hairline underline-offset-2 hover:text-primary"
        >
          OpenStreetMap
        </a>{' '}
        contributors, ODbL.
      </p>
    </div>
  )
}

function tileUrl() {
  const dark =
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') !== 'light'
  return dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
}
