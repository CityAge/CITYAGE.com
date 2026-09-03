'use client'

import { useEffect, useRef, useState } from 'react'
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
}

type Age = 'fresh' | 'recent' | 'old'

const GOLD = '#C5A059'

const NORTH: [number, number] = [-55, 75]
const SOUTH: [number, number] = [0, -78]
const OPEN_ZOOM = 2.4
const DAY = 86_400_000

const NASA_TILES =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png'
const ESRI_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

function ageOf(pulseAt: string | null, now: number): Age {
  if (!pulseAt) return 'recent'
  const days = (now - new Date(pulseAt).getTime()) / DAY
  if (days <= 7) return 'fresh'
  if (days <= 30) return 'recent'
  return 'old'
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

const toVec = ([lng, lat]: [number, number]) => {
  const φ = (lat * Math.PI) / 180
  const λ = (lng * Math.PI) / 180
  return [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)]
}
const toLngLat = (v: number[]): [number, number] => [
  (Math.atan2(v[1], v[0]) * 180) / Math.PI,
  (Math.atan2(v[2], Math.hypot(v[0], v[1])) * 180) / Math.PI,
]
/**
 * A path from a to b along their great circle, taking the long arc, which for
 * two high-latitude points on opposite sides of the world crosses a pole.
 * Returns a function of t in [0, 1].
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
    const θ = -total * t // away from b, round the back, arriving from the other side
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
      // 512px sizing: a quarter of the tiles at globe scale (the images are 256px; fine at zoom < 5)
      marble: { type: 'raster', tiles: [NASA_TILES], tileSize: 512, maxzoom: 8, attribution: 'NASA GIBS' },
      esri: { type: 'raster', tiles: [ESRI_TILES], tileSize: 256, maxzoom: 18, attribution: 'Esri, Maxar, Earthstar Geographics, and the GIS User Community' },
      coast: { type: 'geojson', data: '/pulse/coastline-110m.json' },
      projects: { type: 'geojson', data: { type: 'FeatureCollection', features: [] }, promoteId: 'slug' },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#000000' } },
      { id: 'marble', type: 'raster', source: 'marble', paint: { 'raster-opacity': 0.65, 'raster-fade-duration': 300 } },
      {
        id: 'esri',
        type: 'raster',
        source: 'esri',
        minzoom: 5.5,
        paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 1], 'raster-fade-duration': 0 },
      },
      { id: 'coast', type: 'line', source: 'coast', paint: { 'line-color': 'rgba(249,249,247,0.3)', 'line-width': 1 } },
      {
        id: 'pulse-ring',
        type: 'circle',
        source: 'projects',
        filter: ['==', ['get', 'age'], 'fresh'],
        paint: { 'circle-radius': 0, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': GOLD, 'circle-stroke-width': 1.5, 'circle-stroke-opacity': 0 },
      },
      {
        id: 'dots',
        type: 'circle',
        source: 'projects',
        paint: {
          // 5px at zoom 3 and below → 11px by zoom 6; hover is 130% of either. Zoom must sit at the top level.
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, ['case', ['boolean', ['feature-state', 'hover'], false], 6.5, 5],
            6, ['case', ['boolean', ['feature-state', 'hover'], false], 14.3, 11],
          ],
          'circle-color': GOLD,
          // Translucent gold on black: where dots overlap they read brighter, not bigger.
          // (Circle layers have no additive blend mode; this is the same effect at 500 dots.)
          'circle-opacity': ['case', ['==', ['get', 'age'], 'old'], 0.4, 0.75],
          'circle-stroke-color': '#000000',
          'circle-stroke-width': 1,
          // No stroke at globe scale so a dot never cuts a line through its neighbour; 1px black by zoom 6.
          'circle-stroke-opacity': ['interpolate', ['linear'], ['zoom'], 3, 0, 6, ['case', ['==', ['get', 'age'], 'old'], 0.55, 1]],
        },
      },
    ],
  }
}

export function PulseGlobe({ mode = 'page', initialSlug }: { mode?: 'page' | 'embed'; initialSlug?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MLMap | null>(null)
  const projectsRef = useRef<Project[]>([])
  const labelMarkers = useRef<MLMarker[]>([])
  const [ready, setReady] = useState(false)
  const [pole, setPole] = useState<'north' | 'south'>('north')
  const [active, setActive] = useState<Project | null>(null)
  const [armed, setArmed] = useState(mode === 'page')
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ---- map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map: MLMap = new maplibregl.Map({
      container: containerRef.current,
      style: buildStyle(),
      center: NORTH,
      zoom: OPEN_ZOOM,
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
    map.on('error', (e) => console.error('[pulse] map error', e.error))
    // Handle for tests and the console; harmless in production.
    ;(window as unknown as { __pulseMap?: MLMap }).__pulseMap = map

    let hovered: string | null = null
    const setHover = (slug: string | null) => {
      if (hovered) map.setFeatureState({ source: 'projects', id: hovered }, { hover: false })
      hovered = slug
      if (slug) map.setFeatureState({ source: 'projects', id: slug }, { hover: true })
      map.getCanvas().style.cursor = slug ? 'pointer' : ''
    }
    map.on('mousemove', 'dots', (e) => {
      const f = e.features?.[0]
      setHover((f?.properties?.slug as string) ?? null)
    })
    map.on('mouseleave', 'dots', () => setHover(null))
    map.on('click', (e) => {
      const hits = map.queryRenderedFeatures(e.point, { layers: ['dots'] })
      const slug = hits[0]?.properties?.slug as string | undefined
      const p = slug ? projectsRef.current.find((x) => x.slug === slug) : undefined
      setActive(p ?? null)
    })

    // Fade in from black as soon as the sphere and its coastlines have rendered;
    // the night lights fade in behind over the next moments. Then the 50m coast.
    const onCoast = (e: { sourceId?: string; isSourceLoaded?: boolean }) => {
      if (e.sourceId !== 'coast' || !e.isSourceLoaded) return
      map.off('sourcedata', onCoast)
      map.once('render', () => setReady(true))
    }
    map.on('sourcedata', onCoast)
    map.once('idle', () => {
      setReady(true)
      const src = map.getSource('coast') as GeoJSONSource | undefined
      src?.setData('/pulse/coastline-50m.json')
    })

    // Labels above zoom 5, sparse, in Newsreader (DOM markers, so the house face is real).
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
  }, [])

  // ---- data
  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    supabase
      .from('northern_projects')
      .select('slug,name,place,country,type,summary,source_url,story_url,status,pole,pulse_at,lat,lng')
      .eq('published', true)
      .then(({ data }) => {
        if (cancelled || !data) return
        const now = Date.now()
        const rows = data as Project[]
        projectsRef.current = rows
        const fc: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: rows.map((p) => ({
            type: 'Feature',
            id: p.slug,
            properties: { slug: p.slug, age: ageOf(p.pulse_at, now) },
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
          })),
        }
        const map = mapRef.current
        // The source exists as soon as the style JSON is parsed; tiles may still be
        // loading, so do not gate on isStyleLoaded() or a load event that may have passed.
        const apply = () => {
          if (!map) return
          const src = map.getSource('projects') as GeoJSONSource | undefined
          if (!src) {
            map.once('styledata', apply)
            return
          }
          src.setData(fc)
          if (initialSlug) {
            const p = rows.find((x) => x.slug === initialSlug)
            if (p) {
              setActive(p)
              map.jumpTo({ center: [p.lng, p.lat], zoom: 4 })
            }
          }
        }
        apply()
        startPulse(fc.features.some((f) => f.properties?.age === 'fresh'))
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSlug])

  // ---- pulse rings: 0→28px over 2.4s ease-out, opacity 0.6→0, every 3s
  const rafRef = useRef<number | null>(null)
  function startPulse(any: boolean) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (!any || reduced) return
    const t0 = performance.now()
    const tick = (now: number) => {
      const map = mapRef.current
      if (!map || !map.getLayer('pulse-ring')) return
      const t = Math.min(((now - t0) % 3000) / 2400, 1)
      map.setPaintProperty('pulse-ring', 'circle-radius', 28 * easeOut(t))
      map.setPaintProperty('pulse-ring', 'circle-stroke-opacity', t >= 1 ? 0 : 0.6 * (1 - t))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  // ---- card ↔ URL, Escape
  useEffect(() => {
    if (mode !== 'page') return
    const url = new URL(window.location.href)
    if (active) url.searchParams.set('p', active.slug)
    else url.searchParams.delete('p')
    window.history.replaceState(null, '', url.pathname + (url.search || ''))
  }, [active, mode])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ---- the other pole: the long way round the great circle, over the top of
  // the globe rather than through the equator. 1.6s, ease-in-out, with a zoom
  // dip at the midpoint so the whole sphere turns in view.
  const flightRef = useRef<number | null>(null)
  function flip() {
    const map = mapRef.current
    if (!map) return
    const next = pole === 'north' ? 'south' : 'north'
    setPole(next)
    setActive(null)
    const to = next === 'south' ? SOUTH : NORTH
    if (flightRef.current) cancelAnimationFrame(flightRef.current)
    if (reduced) {
      map.jumpTo({ center: to, zoom: OPEN_ZOOM, pitch: 0, bearing: 0 })
      return
    }
    const c = map.getCenter()
    const path = longWayRound([c.lng, c.lat], to)
    const z0 = map.getZoom()
    const t0 = performance.now()
    const D = 1600
    const tick = (now: number) => {
      const u = Math.min((now - t0) / D, 1)
      const e = easeInOut(u)
      const [lng, lat] = path(e)
      // dip to zoom 1.5 mid-flight, back to the opening zoom at the end
      const dip = Math.sin(Math.PI * e)
      const zoom = z0 + (OPEN_ZOOM - z0) * e - (z0 - 1.5) * dip * 0.9
      map.jumpTo({ center: [lng, Math.max(-89.5, Math.min(89.5, lat))], zoom, pitch: 0, bearing: 0 })
      if (u < 1) flightRef.current = requestAnimationFrame(tick)
      else map.jumpTo({ center: to, zoom: OPEN_ZOOM, pitch: 0, bearing: 0 })
    }
    flightRef.current = requestAnimationFrame(tick)
  }

  const embed = mode === 'embed'

  return (
    <div className={`pulse ${embed ? 'pulse-embed' : 'pulse-page'}`}>
      <div ref={containerRef} className={`pulse-map${ready ? ' is-ready' : ''}`} aria-label="Northern Pulse globe" />

      <div className="pulse-chrome pulse-title">
        <span className="name">Northern Pulse</span>
        <span className="line">The world from the two poles.</span>
      </div>

      <div className="pulse-chrome pulse-layers" role="group" aria-label="Layers">
        <button type="button" className="is-on" aria-pressed="true">Projects</button>
        <span className="sep">·</span>
        <button type="button" disabled title="Coming">People</button>
        <span className="sep">·</span>
        <button type="button" disabled title="Coming">Rooms</button>
        <span className="sep">·</span>
        <button type="button" disabled title="Coming">Pulse</button>
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
            <button type="button" className="close" onClick={() => setActive(null)} aria-label="Close">×</button>
            <span className="kicker">{active.type}</span>
            <h2 className="name">{active.name}</h2>
            <span className="place">{[active.place?.trim(), active.country].filter(Boolean).join(' · ')}</span>
            {active.summary ? <p className="summary">{active.summary}</p> : null}
            {active.status ? <span className="status">{active.status.replace(/_/g, ' ')}</span> : null}
            <div className="links">
              {active.source_url ? <a href={active.source_url} target="_blank" rel="noopener">Source</a> : null}
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
