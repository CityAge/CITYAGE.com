'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// MapLibre 5.x: its worker ships inline, so nothing extra has to be served. (6.x is ESM-only with an
// external module worker the bundler cannot serve.)
import maplibregl, { type Map as MLMap, type Marker as MLMarker, type GeoJSONSource, type StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { createClient } from '@/lib/supabase/client'
import './pulse.css'

export type Project = {
  slug: string
  name: string
  place: string | null
  country: string
  type: string
  summary: string | null
  source_url: string | null
  story_url: string | null
  status: string | null
  pole: string
  pulse_at: string | null
  lat: number
  lng: number
  announced_cad: number | null
  committed_cad: number | null
  announced_note: string | null
  committed_note: string | null
  value_source_url: string | null
}

/** fresh: under 7 days (breaking). recent: 7–30 days. old: over 30. none: no pulse_at. */
type Age = 'fresh' | 'recent' | 'old' | 'none'

const GOLD = '#D4AF5A'
const NORTH: [number, number] = [-30, 74]
const SOUTH: [number, number] = [0, -78]
const PROJECT_ZOOM = 7
const FLY_TO_MS = 1800
const FLY_BACK_MS = 1400
const DAY = 86_400_000
/** The pulse glyph: its height in px at the opening zoom, and by zoom 6. */
const STAR_MIN = 14
const STAR_MAX = 22

const NASA_TILES =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png'
const ESRI_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

function ageOf(pulseAt: string | null, now: number): Age {
  if (!pulseAt) return 'none'
  const t = new Date(pulseAt).getTime()
  if (!isFinite(t)) return 'none'
  const days = (now - t) / DAY
  if (days < 7) return 'fresh'
  if (days <= 30) return 'recent'
  return 'old'
}
/** Within 30 days: the star instead of the dot. */
const isStar = (age: Age) => age === 'fresh' || age === 'recent'
/** "3 Sept 2026" (the CSS sets it in caps). */
function pulseDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

type Ccy = 'cad' | 'usd'
type Fx = { rate: number; asOf: string } | null
/** Amounts are stored in CAD; a Money formats them in the chosen currency through the CAD_USD rate. */
type Money = (n: number) => number
const symbol = (ccy: Ccy) => (ccy === 'usd' ? 'US$' : 'C$')
/** "C$9.5 billion" — the headline figure, in words. */
function moneyLong(n: number, ccy: Ccy, conv: Money): string {
  const v = conv(n)
  const s = symbol(ccy)
  if (v >= 1e9) return `${s}${(v / 1e9).toFixed(1)} billion`
  if (v >= 1e6) return `${s}${Math.round(v / 1e6)} million`
  return `${s}${Math.round(v).toLocaleString('en-CA')}`
}
/** "C$0.55bn" — panel rows, always in billions to two places so the columns compare. */
const moneyBn = (n: number, ccy: Ccy, conv: Money) => `${symbol(ccy)}${(conv(n) / 1e9).toFixed(2)}bn`
/** "C$1.0bn" / "C$72m" — card lines. */
function moneyShort(n: number, ccy: Ccy, conv: Money): string {
  const v = conv(n)
  const s = symbol(ccy)
  if (v >= 1e9) return `${s}${(v / 1e9).toFixed(1)}bn`
  if (v >= 1e6) return `${s}${Math.round(v / 1e6)}m`
  return `${s}${Math.round(v).toLocaleString('en-CA')}`
}
/** "3 SEPT 2026" */
function rateDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z')
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]
  return `${d.getUTCDate()} ${m} ${d.getUTCFullYear()}`
}
type CapitalRow = { country: string; announced: number | null; committed: number | null }
function capitalByCountry(rows: Project[]): { total: { announced: number; committed: number }; countries: CapitalRow[] } {
  const by = new Map<string, CapitalRow>()
  let announced = 0
  let committed = 0
  for (const p of rows) {
    const c = by.get(p.country) ?? { country: p.country, announced: null, committed: null }
    if (p.announced_cad != null) {
      c.announced = (c.announced ?? 0) + p.announced_cad
      announced += p.announced_cad
    }
    if (p.committed_cad != null) {
      c.committed = (c.committed ?? 0) + p.committed_cad
      committed += p.committed_cad
    }
    by.set(p.country, c)
  }
  return { total: { announced, committed }, countries: [...by.values()].sort((a, b) => a.country.localeCompare(b.country)) }
}

/** Target diameter: the whole sphere on the viewport's shorter side, rim visible, never above 90% of the height. */
function fitDiameter(el: HTMLElement | null): number {
  const w = el?.clientWidth || 1400
  const h = el?.clientHeight || 843
  return 0.9 * Math.min(w, h)
}
/**
 * The opening zoom. MapLibre's globe spans roughly 439px × 2^zoom on screen;
 * measureSphere() then corrects the guess against the real silhouette.
 */
function fillZoom(el: HTMLElement | null): number {
  return Math.max(-1.5, Math.min(3, Math.log2(fitDiameter(el) / 439)))
}

const toVec = ([lng, lat]: [number, number]) => {
  const φ = (lat * Math.PI) / 180
  const λ = (lng * Math.PI) / 180
  return [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)]
}
const toLngLat = (v: number[]): [number, number] => [
  (Math.atan2(v[1], v[0]) * 180) / Math.PI,
  (Math.atan2(v[2], Math.hypot(v[0], v[1])) * 180) / Math.PI,
]
/** Point at angular distance `deg` from `a`, heading due south along its meridian (or north past the pole). */
function alongMeridian(a: [number, number], deg: number): [number, number] {
  const lat = a[1] - deg
  if (lat >= -90) return [a[0], lat]
  return [a[0] + 180, -180 - lat]
}
/**
 * A path from a to b along their great circle, taking the long arc, which for
 * two high-latitude points on opposite sides of the world crosses a pole.
 */
function longWayRound(a: [number, number], b: [number, number]) {
  const va = toVec(a)
  const vb = toVec(b)
  const dot = va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]
  const short = Math.acos(Math.max(-1, Math.min(1, dot)))
  let n = [va[1] * vb[2] - va[2] * vb[1], va[2] * vb[0] - va[0] * vb[2], va[0] * vb[1] - va[1] * vb[0]]
  const len = Math.hypot(n[0], n[1], n[2]) || 1
  n = n.map((x) => x / len)
  const total = 2 * Math.PI - short
  return (t: number): [number, number] => {
    const θ = -total * t
    const cos = Math.cos(θ)
    const sin = Math.sin(θ)
    const k = n[0] * va[0] + n[1] * va[1] + n[2] * va[2]
    const v = [
      va[0] * cos + (n[1] * va[2] - n[2] * va[1]) * sin + n[0] * k * (1 - cos),
      va[1] * cos + (n[2] * va[0] - n[0] * va[2]) * sin + n[1] * k * (1 - cos),
      va[2] * cos + (n[0] * va[1] - n[1] * va[0]) * sin + n[2] * k * (1 - cos),
    ]
    return toLngLat(v)
  }
}

function buildStyle(): StyleSpecification {
  return {
    version: 8,
    projection: { type: 'globe' },
    sources: {
      marble: { type: 'raster', tiles: [NASA_TILES], tileSize: 512, maxzoom: 8, attribution: 'NASA GIBS' },
      esri: { type: 'raster', tiles: [ESRI_TILES], tileSize: 256, maxzoom: 18, attribution: 'Esri, Maxar, Earthstar Geographics, and the GIS User Community' },
      coast: { type: 'geojson', data: '/pulse/coastline-110m.json' },
      projects: { type: 'geojson', data: { type: 'FeatureCollection', features: [] }, promoteId: 'slug' },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#000000' } },
      {
        id: 'marble',
        type: 'raster',
        source: 'marble',
        // 90%, contrast lifted so towns read as points of light
        // desaturated so the lights are warm points on black, not the source's blue haze
        paint: { 'raster-opacity': 0.9, 'raster-contrast': 0.3, 'raster-saturation': -0.7, 'raster-brightness-min': 0, 'raster-fade-duration': 300 },
      },
      {
        id: 'esri',
        type: 'raster',
        source: 'esri',
        minzoom: 5.5,
        paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 1], 'raster-fade-duration': 300 },
      },
      { id: 'coast', type: 'line', source: 'coast', paint: { 'line-color': '#F9F9F7', 'line-opacity': 0.22, 'line-width': 0.6 } },
      {
        id: 'dots',
        type: 'circle',
        source: 'projects',
        // A project within 30 days renders as the star (a DOM marker) instead of a dot.
        filter: ['!', ['to-boolean', ['get', 'star']]],
        paint: {
          // 3.5px at zoom 3 and below → 11px by zoom 6; hover is 130% of either. Zoom must sit at the top level.
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, ['case', ['boolean', ['feature-state', 'hover'], false], 4.55, 3.5],
            6, ['case', ['boolean', ['feature-state', 'hover'], false], 14.3, 11],
          ],
          'circle-color': GOLD,
          // Translucent gold on black: where dots overlap they read brighter, not bigger.
          'circle-opacity': ['case', ['==', ['get', 'age'], 'old'], 0.4, 0.78],
          'circle-stroke-color': '#000000',
          'circle-stroke-width': 0.75,
          'circle-stroke-opacity': ['case', ['==', ['get', 'age'], 'old'], 0.55, 1],
        },
      },
    ],
  }
}

export function PulseGlobe({ mode = 'page', initialSlug }: { mode?: 'page' | 'embed'; initialSlug?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const limbRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MLMap | null>(null)
  const projectsRef = useRef<Project[]>([])
  /** The opening zoom after correction against the real silhouette; every return flight comes back here. */
  const homeZoom = useRef<number | null>(null)
  const labelMarkers = useRef<MLMarker[]>([])
  const [ready, setReady] = useState(false)
  const [pole, setPole] = useState<'north' | 'south'>('north')
  const [active, setActive] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [armed, setArmed] = useState(mode === 'page')
  /** The Pulse layer: on, projects within 30 days show the star; off, everything is a dot. */
  const [pulseOn, setPulseOn] = useState(true)
  const pulseOnRef = useRef(true)
  const embed = mode === 'embed'
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ---- currency: C$ by default, US$ through the CAD_USD rate; the choice lives in ?ccy=usd
  const [ccy, setCcy] = useState<Ccy>(() => {
    if (mode !== 'page' || typeof window === 'undefined') return 'cad'
    return new URLSearchParams(window.location.search).get('ccy') === 'usd' ? 'usd' : 'cad'
  })
  const [fx, setFx] = useState<Fx>(null)
  useEffect(() => {
    let cancelled = false
    createClient()
      .from('fx_rates')
      .select('rate,as_of')
      .eq('pair', 'CAD_USD')
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data && data.rate) setFx({ rate: Number(data.rate), asOf: String(data.as_of) })
      })
    return () => {
      cancelled = true
    }
  }, [])
  // US$ only once the rate is in; until then everything stays in C$.
  const live: Ccy = ccy === 'usd' && fx ? 'usd' : 'cad'
  const conv: Money = live === 'usd' && fx ? (n) => n * fx.rate : (n) => n

  // ---- idle spin state (declared early so handlers below can use it)
  const idleRef = useRef<number | null>(null)
  const idleStopped = useRef(false)
  const resumeTimer = useRef<number | null>(null)
  const activeRef = useRef<Project | null>(null)
  const stopIdle = useCallback(() => {
    idleStopped.current = true
    if (idleRef.current) cancelAnimationFrame(idleRef.current)
    idleRef.current = null
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    resumeTimer.current = null
  }, [])
  /** An interaction: stop, then come back 12s after the last one unless a card is open. */
  const startIdleRef = useRef<(() => void) | null>(null)
  const onInteract = useCallback(() => {
    stopIdle()
    resumeTimer.current = window.setTimeout(() => {
      resumeTimer.current = null
      if (!activeRef.current) startIdleRef.current?.()
    }, 12000)
  }, [stopIdle])
  const startIdle = useCallback(() => {
    const map = mapRef.current
    if (!map || embed || reduced) return
    idleStopped.current = false
    if (idleRef.current) cancelAnimationFrame(idleRef.current)
    const t0 = performance.now()
    let last = t0
    const tick = (now: number) => {
      if (idleStopped.current) return
      const dt = (now - last) / 1000
      last = now
      const ramp = Math.min((now - t0) / 2000, 1)
      const ease = ramp * ramp * (3 - 2 * ramp)
      map.setBearing(map.getBearing() + 2 * dt * ease)
      idleRef.current = requestAnimationFrame(tick)
    }
    idleRef.current = requestAnimationFrame(tick)
  }, [embed, reduced])
  startIdleRef.current = startIdle

  // ---- the stars' size: 14px at the opening zoom, 22px by zoom 6
  const starMarkers = useRef<MLMarker[]>([])
  const sizeStars = useCallback(() => {
    const map = mapRef.current
    if (!map || starMarkers.current.length === 0) return
    const z0 = homeZoom.current ?? fillZoom(containerRef.current)
    const t = Math.max(0, Math.min(1, (map.getZoom() - z0) / (6 - z0)))
    const px = (STAR_MIN + (STAR_MAX - STAR_MIN) * t).toFixed(1)
    for (const m of starMarkers.current) m.getElement().style.setProperty('--star', `${px}px`)
  }, [])

  // ---- the limb: an overlay sized to the sphere's real silhouette
  const measureSphere = useCallback((map: MLMap) => {
    const c = map.getCenter()
    const center: [number, number] = [c.lng, c.lat]
    const t = (map as unknown as { transform?: { isLocationOccluded?: (l: { lng: number; lat: number }) => boolean } }).transform
    let radiusPx: number | null = null
    if (t?.isLocationOccluded) {
      // binary search the angular distance at which the meridian point disappears behind the globe
      let lo = 45
      let hi = 90
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2
        const [lng, lat] = alongMeridian(center, mid)
        if (t.isLocationOccluded({ lng, lat })) hi = mid
        else lo = mid
      }
      const [lng, lat] = alongMeridian(center, lo)
      const p = map.project([lng, lat])
      const o = map.project(center)
      radiusPx = Math.hypot(p.x - o.x, p.y - o.y)
    }
    if (!radiusPx || !isFinite(radiusPx)) radiusPx = (439 * Math.pow(2, map.getZoom())) / 2
    return { radiusPx, cx: map.project(center).x, cy: map.project(center).y }
  }, [])
  const updateLimb = useCallback(() => {
    const map = mapRef.current
    const limb = limbRef.current
    if (!map || !limb) return
    const { radiusPx, cx, cy } = measureSphere(map)
    if (map.getZoom() > 5) {
      limb.style.opacity = '0'
      return
    }
    limb.style.opacity = '1'
    limb.style.width = `${radiusPx * 2}px`
    limb.style.height = `${radiusPx * 2}px`
    limb.style.left = `${cx - radiusPx}px`
    limb.style.top = `${cy - radiusPx}px`
  }, [measureSphere])

  // ---- map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map: MLMap = new maplibregl.Map({
      container: containerRef.current,
      style: buildStyle(),
      center: NORTH,
      zoom: fillZoom(containerRef.current),
      minZoom: -1.5,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
      maxPitch: 0,
      interactive: true,
      touchPitch: false,
      dragRotate: false,
      pitchWithRotate: false,
      fadeDuration: 0,
    })
    mapRef.current = map
    map.touchZoomRotate.disableRotation()
    ;(window as unknown as { __pulseMap?: MLMap }).__pulseMap = map
    map.on('error', (e) => console.error('[pulse] map error', e.error))

    let hovered: string | null = null
    const setHover = (slug: string | null) => {
      if (hovered) map.setFeatureState({ source: 'projects', id: hovered }, { hover: false })
      hovered = slug
      if (slug) map.setFeatureState({ source: 'projects', id: slug }, { hover: true })
      map.getCanvas().style.cursor = slug ? 'pointer' : ''
    }
    map.on('mousemove', 'dots', (e) => setHover((e.features?.[0]?.properties?.slug as string) ?? null))
    map.on('mouseleave', 'dots', () => setHover(null))

    // Correct the opening zoom against the real silhouette once the style is in.
    map.once('styledata', () => {
      const el = containerRef.current
      if (!el) return
      const { radiusPx } = measureSphere(map)
      const target = fitDiameter(el) / 2
      if (radiusPx > 0) map.jumpTo({ zoom: map.getZoom() + Math.log2(target / radiusPx) })
      homeZoom.current = map.getZoom()
      updateLimb()
      sizeStars()
    })
    map.on('move', updateLimb)
    map.on('zoom', sizeStars)
    map.on('resize', updateLimb)

    map.once('idle', () => {
      setReady(true)
      updateLimb()
      const src = map.getSource('coast') as GeoJSONSource | undefined
      src?.setData('/pulse/coastline-50m.json')
    })

    // Labels above zoom 5, sparse, in Newsreader (DOM markers).
    let countries: GeoJSON.FeatureCollection | null = null
    let places: GeoJSON.FeatureCollection | null = null
    Promise.all([
      fetch('/pulse/labels-countries.json').then((r) => r.json()),
      fetch('/pulse/labels-places.json').then((r) => r.json()),
    ]).then(([c, p]) => {
      countries = c
      places = p
      drawLabels()
    })
    function drawLabels() {
      labelMarkers.current.forEach((m) => m.remove())
      labelMarkers.current = []
      const z = map.getZoom()
      if (z < 5 || !countries || !places) return
      const b = map.getBounds()
      const add = (f: GeoJSON.Feature, cls: string) => {
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates
        if (!b.contains([lng, lat])) return
        const el = document.createElement('div')
        el.className = `pulse-label ${cls}`
        el.textContent = String(f.properties?.name ?? '')
        labelMarkers.current.push(new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([lng, lat]).addTo(map))
      }
      for (const f of countries.features) if (Number(f.properties?.rank) <= (z < 6.5 ? 3 : 6)) add(f, 'is-country')
      for (const f of places.features) if (Number(f.properties?.rank) <= (z < 6.5 ? 0 : 2)) add(f, 'is-place')
    }
    map.on('moveend', drawLabels)

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- flights
  const flightRef = useRef<number | null>(null)
  const flyToProject = useCallback(
    (p: Project) => {
      const map = mapRef.current
      if (!map) return
      stopIdle()
      if (reduced) {
        map.jumpTo({ center: [p.lng, p.lat], zoom: PROJECT_ZOOM, bearing: 0, pitch: 0 })
        setActive(p)
        return
      }
      map.once('moveend', () => setActive(p))
      map.flyTo({ center: [p.lng, p.lat], zoom: PROJECT_ZOOM, bearing: 0, pitch: 0, duration: FLY_TO_MS, easing: easeInOut, essential: true })
    },
    [reduced, stopIdle],
  )
  const closeCard = useCallback(() => {
    const map = mapRef.current
    setActive(null)
    if (!map) return
    const home = pole === 'south' ? SOUTH : NORTH
    const zoom = homeZoom.current ?? fillZoom(containerRef.current)
    if (reduced) {
      map.jumpTo({ center: home, zoom, bearing: 0, pitch: 0 })
      return
    }
    map.once('moveend', () => startIdle())
    map.flyTo({ center: home, zoom, bearing: 0, pitch: 0, duration: FLY_BACK_MS, easing: easeInOut, essential: true })
  }, [pole, reduced, startIdle])

  // click: a dot flies there; anywhere else closes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const onClick = (e: maplibregl.MapMouseEvent) => {
      if ((e.originalEvent?.target as Element | null)?.closest?.('.pulse-star')) return
      const hits = map.queryRenderedFeatures(e.point, { layers: ['dots'] })
      const slug = hits[0]?.properties?.slug as string | undefined
      const p = slug ? projectsRef.current.find((x) => x.slug === slug) : undefined
      if (p) flyToProject(p)
      else if (active) closeCard()
    }
    map.on('click', onClick)
    return () => {
      map.off('click', onClick)
    }
  }, [active, closeCard, flyToProject])

  // ---- data
  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    supabase
      .from('northern_projects')
      .select('slug,name,place,country,type,summary,source_url,story_url,status,pole,pulse_at,lat,lng,announced_cad,committed_cad,announced_note,committed_note,value_source_url')
      .eq('published', true)
      .then(({ data }) => {
        if (cancelled || !data) return
        const now = Date.now()
        // numeric columns arrive as strings
        const rows = (data as Array<Record<string, unknown>>).map((r) => ({
          ...r,
          announced_cad: r.announced_cad == null ? null : Number(r.announced_cad),
          committed_cad: r.committed_cad == null ? null : Number(r.committed_cad),
        })) as Project[]
        // Local test hook: rows merged by slug from window.__pulseFixture, set by the test harness before load. Never the database.
        const fixture = (window as unknown as { __pulseFixture?: Array<Partial<Project> & { slug: string }> }).__pulseFixture
        if (Array.isArray(fixture)) {
          for (const f of fixture) {
            const i = rows.findIndex((r) => r.slug === f.slug)
            if (i >= 0) rows[i] = { ...rows[i], ...f }
          }
        }
        projectsRef.current = rows
        setProjects(rows)
        syncSource()
        if (initialSlug) {
          const p = rows.find((x) => x.slug === initialSlug)
          const map = mapRef.current
          if (p && map) {
            stopIdle()
            setActive(p)
            map.jumpTo({ center: [p.lng, p.lat], zoom: PROJECT_ZOOM })
          }
        }
        void now
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSlug])

  // ---- the source: every project a feature; `star` marks the ones the glyph replaces
  function syncSource() {
    const map = mapRef.current
    if (!map) return
    const src = map.getSource('projects') as GeoJSONSource | undefined
    if (!src) {
      map.once('styledata', syncSource)
      return
    }
    const now = Date.now()
    src.setData({
      type: 'FeatureCollection',
      features: projectsRef.current.map((p) => {
        const age = ageOf(p.pulse_at, now)
        return {
          type: 'Feature',
          id: p.slug,
          properties: { slug: p.slug, age, star: pulseOnRef.current && isStar(age) },
          geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        }
      }),
    })
  }
  useEffect(() => {
    pulseOnRef.current = pulseOn
    syncSource()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulseOn])

  // ---- the stars: a DOM marker per project within 30 days; the newest under 7 days rings
  useEffect(() => {
    const map = mapRef.current
    starMarkers.current.forEach((m) => m.remove())
    starMarkers.current = []
    if (!map || !pulseOn) return
    const now = Date.now()
    const stars = projects.filter((p) => isStar(ageOf(p.pulse_at, now)))
    if (stars.length === 0) return
    const ringing = stars
      .filter((p) => ageOf(p.pulse_at, now) === 'fresh')
      .sort((a, b) => new Date(b.pulse_at!).getTime() - new Date(a.pulse_at!).getTime())[0]
    for (const p of stars) {
      const el = document.createElement('button')
      el.type = 'button'
      el.className = `pulse-star${p === ringing && !reduced ? ' is-breaking' : ''}`
      el.setAttribute('aria-label', p.name)
      el.innerHTML = '<span class="ring" aria-hidden="true"></span><svg class="glyph" viewBox="-10 -14 20 28" aria-hidden="true"><use href="#pulse-star"></use></svg>'
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        flyToProject(p)
      })
      starMarkers.current.push(
        new maplibregl.Marker({ element: el, anchor: 'center', opacityWhenCovered: '0' }).setLngLat([p.lng, p.lat]).addTo(map),
      )
    }
    sizeStars()
  }, [projects, pulseOn, reduced, flyToProject, sizeStars])

  // ---- idle spin: after the fade, unless something already stopped it
  useEffect(() => {
    if (!ready || embed || reduced || idleStopped.current || active) return
    startIdle()
    const el = containerRef.current
    if (!el) return
    const opts = { passive: true } as AddEventListenerOptions
    el.addEventListener('pointerdown', onInteract, opts)
    el.addEventListener('touchstart', onInteract, opts)
    el.addEventListener('wheel', onInteract, opts)
    window.addEventListener('keydown', onInteract)
    return () => {
      el.removeEventListener('pointerdown', onInteract)
      el.removeEventListener('touchstart', onInteract)
      el.removeEventListener('wheel', onInteract)
      window.removeEventListener('keydown', onInteract)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])
  useEffect(() => {
    activeRef.current = active
    if (active) stopIdle()
  }, [active, stopIdle])

  // ---- card ↔ URL, Escape
  useEffect(() => {
    if (mode !== 'page') return
    const url = new URL(window.location.href)
    if (active) url.searchParams.set('p', active.slug)
    else url.searchParams.delete('p')
    if (ccy === 'usd') url.searchParams.set('ccy', 'usd')
    else url.searchParams.delete('ccy')
    window.history.replaceState(null, '', url.pathname + (url.search || ''))
  }, [active, ccy, mode])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) closeCard()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, closeCard])

  // ---- the other pole: the long way round the great circle, over the top
  function flip() {
    const map = mapRef.current
    if (!map) return
    const next = pole === 'north' ? 'south' : 'north'
    setPole(next)
    setActive(null)
    const to = next === 'south' ? SOUTH : NORTH
    if (flightRef.current) cancelAnimationFrame(flightRef.current)
    onInteract()
    const z1 = homeZoom.current ?? fillZoom(containerRef.current)
    if (reduced) {
      map.jumpTo({ center: to, zoom: z1, pitch: 0, bearing: 0 })
      return
    }
    const c = map.getCenter()
    const path = longWayRound([c.lng, c.lat], to)
    const z0 = map.getZoom()
    const b0 = map.getBearing()
    const t0 = performance.now()
    const D = 1600
    const tick = (now: number) => {
      const u = Math.min((now - t0) / D, 1)
      const e = easeInOut(u)
      const [lng, lat] = path(e)
      const dip = Math.sin(Math.PI * e)
      const zoom = z0 + (z1 - z0) * e - Math.max(0, z0 - 0.6) * dip * 0.6
      map.jumpTo({ center: [lng, Math.max(-89.5, Math.min(89.5, lat))], zoom, pitch: 0, bearing: b0 * (1 - e) })
      if (u < 1) flightRef.current = requestAnimationFrame(tick)
      else map.jumpTo({ center: to, zoom: z1, pitch: 0, bearing: 0 })
    }
    flightRef.current = requestAnimationFrame(tick)
  }

  // ---- capital: the committed sum counts up from zero over 1.6s on first load
  const capital = useMemo(() => capitalByCountry(projects), [projects])
  const [shown, setShown] = useState(0)
  const [panelOpen, setPanelOpen] = useState(false)
  useEffect(() => {
    const target = capital.total.committed
    if (!target) return
    if (reduced) {
      setShown(target)
      return
    }
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const u = Math.min((now - t0) / 1600, 1)
      setShown(target * easeOut(u))
      if (u < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capital.total.committed])
  const share = capital.total.announced > 0 ? capital.total.committed / capital.total.announced : 0

  // ---- index: projects grouped by country
  const index = useMemo(() => {
    const groups = new Map<string, Project[]>()
    for (const p of [...projects].sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name))) {
      if (!groups.has(p.country)) groups.set(p.country, [])
      groups.get(p.country)!.push(p)
    }
    return [...groups.entries()]
  }, [projects])

  return (
    <div className={`pulse ${embed ? 'pulse-embed' : 'pulse-page'}`}>
      {!embed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/pulse/poster.jpg" alt="" className="pulse-poster" decoding="async" fetchPriority="high" />
      ) : null}
      <div ref={containerRef} className={`pulse-map${ready ? ' is-ready' : ''}`} aria-label="Northern Pulse globe" />
      <div ref={limbRef} className="pulse-limb" aria-hidden="true" />
      {/* The pulse glyph: a thin four-pointed compass star, vertical points 1.4× the horizontal, hairline gold. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <symbol id="pulse-star" viewBox="-10 -14 20 28">
          <path
            d="M0,-14 L1.6,-1.6 L10,0 L1.6,1.6 L0,14 L-1.6,1.6 L-10,0 L-1.6,-1.6 Z"
            fill={GOLD}
            fillOpacity="0.28"
            stroke={GOLD}
            strokeWidth="0.75"
            strokeLinejoin="miter"
            vectorEffect="non-scaling-stroke"
          />
        </symbol>
      </svg>

      <div className="pulse-chrome pulse-left">
        <div className="pulse-title">
          <span className="name">Northern Pulse</span>
          <span className="line">The world from the two poles.</span>
        </div>

        {!embed && capital.total.committed > 0 ? (
          <div className="pulse-capital">
            <span className="label">Capital committed to the North</span>
            <div className="counter">
              <button
                type="button"
                className="figure"
                aria-haspopup="true"
                aria-expanded={panelOpen}
                onMouseEnter={() => setPanelOpen(true)}
                onMouseLeave={() => setPanelOpen(false)}
                onFocus={() => setPanelOpen(true)}
                onBlur={() => setPanelOpen(false)}
                onClick={() => setPanelOpen((o) => !o)}
              >
                {moneyLong(shown, live, conv)}
              </button>
              <span className="ccy" role="group" aria-label="Currency">
                <button type="button" className={live === 'cad' ? 'is-on' : undefined} aria-pressed={live === 'cad'} onClick={() => setCcy('cad')}>C$</button>
                <span className="bar">|</span>
                <button type="button" className={live === 'usd' ? 'is-on' : undefined} aria-pressed={live === 'usd'} disabled={!fx} title={fx ? undefined : 'Rate loading'} onClick={() => setCcy('usd')}>US$</button>
              </span>
            </div>
            <span className="of">Of {moneyLong(capital.total.announced, live, conv)} announced</span>
            <span className="rule" aria-hidden="true">
              <span className="gold" style={{ width: `${Math.max(0, Math.min(1, share)) * 100}%` }} />
            </span>
            <span className="note">The CityAge estimate · Sourced per project</span>
            {live === 'usd' && fx ? <span className="note">At 1 C$ = {fx.rate} US$, {rateDate(fx.asOf)}</span> : null}
            {panelOpen ? (
              <div className="panel" role="tooltip">
                {capital.countries.map((c) => (
                  <div key={c.country} className="row">
                    <span className="country">{c.country}</span>
                    {c.announced != null || c.committed != null ? (
                      <span className="values">
                        {moneyBn(c.committed ?? 0, live, conv)} / {c.announced != null ? moneyBn(c.announced, live, conv) : '—'}
                        {c.announced ? <span className="pct"> · {Math.round(((c.committed ?? 0) / c.announced) * 100)}%</span> : null}
                      </span>
                    ) : (
                      <span className="values muted">No public figure</span>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

      {!embed && index.length > 0 ? (
        <nav className="pulse-index" aria-label="Projects">
          {index.map(([country, items]) => (
            <div key={country} className="group">
              <span className="country">{country}</span>
              {items.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  className={active?.slug === p.slug ? 'is-active' : undefined}
                  onClick={() => (active?.slug === p.slug ? closeCard() : flyToProject(p))}
                >
                  {p.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      ) : null}
      </div>

      <div className="pulse-chrome pulse-layers" role="group" aria-label="Layers">
        <button type="button" className="is-on" aria-pressed="true">Projects</button>
        <span className="sep">·</span>
        <button type="button" disabled title="Coming">People</button>
        <span className="sep">·</span>
        <button type="button" disabled title="Coming">Rooms</button>
        <span className="sep">·</span>
        <button type="button" className={pulseOn ? 'is-on' : undefined} aria-pressed={pulseOn} onClick={() => setPulseOn((o) => !o)}>Pulse</button>
      </div>

      {!embed || armed ? (
        <div className="pulse-chrome pulse-pole">
          <button type="button" onClick={flip}>{pole === 'north' ? 'The other pole' : 'The North'}</button>
        </div>
      ) : null}

      <div className="pulse-chrome pulse-attrib">
        <a href="https://maplibre.org/" target="_blank" rel="noopener">MapLibre</a> · <a href="https://earthdata.nasa.gov/gibs" target="_blank" rel="noopener">NASA GIBS</a> · Esri, Maxar, Earthstar Geographics, and the GIS User Community
      </div>

      <aside className={`pulse-card${active ? ' is-open' : ''}`} aria-hidden={!active} aria-label="Project">
        {active ? (
          <>
            <button type="button" className="close" onClick={closeCard} aria-label="Close">×</button>
            <span className="kicker">{active.type}</span>
            <h2 className="name">{active.name}</h2>
            {active.pulse_at && isStar(ageOf(active.pulse_at, Date.now())) ? (
              <span className="pulse-line">Pulse · {pulseDate(active.pulse_at)}</span>
            ) : null}
            <span className="place">{[active.place?.trim(), active.country].filter(Boolean).join(' · ')}</span>
            {active.summary ? <p className="summary">{active.summary}</p> : null}
            {active.status ? <span className="status">{active.status.replace(/_/g, ' ')}</span> : null}
            <dl className="figures">
              <div>
                <dt>Announced</dt>
                <dd>{active.announced_cad != null ? moneyShort(active.announced_cad, live, conv) : <span className="muted">No public figure</span>}</dd>
                {active.announced_note ? <dd className="fnote">{active.announced_note}</dd> : null}
              </div>
              <div>
                <dt>Committed</dt>
                <dd>{active.committed_cad != null ? moneyShort(active.committed_cad, live, conv) : <span className="muted">No public figure</span>}</dd>
                {active.committed_note ? <dd className="fnote">{active.committed_note}</dd> : null}
              </div>
            </dl>
            <div className="links">
              {active.value_source_url || active.source_url ? (
                <a href={active.value_source_url || active.source_url || '#'} target="_blank" rel="noopener">Source</a>
              ) : null}
              {active.story_url ? <a href={active.story_url}>Read</a> : null}
            </div>
          </>
        ) : null}
      </aside>

      {embed && !armed ? (
        <a
          href="/pulse"
          className="pulse-explore"
          onClick={(e) => {
            if (window.matchMedia('(min-width: 768px)').matches) {
              e.preventDefault()
              setArmed(true)
              mapRef.current?.resize()
            }
          }}
        >
          <span>Explore →</span>
        </a>
      ) : null}
    </div>
  )
}
