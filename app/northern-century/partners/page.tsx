'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'

const PASSCODE = 'ARCTIC2026'

const INK = '#07090C'
const BRASS = '#B8956A'
const BRASS_DIM = 'rgba(184,149,106,0.35)'
const CREAM = '#EFE9DC'
const BODY = '#B9B1A2'
const DIM = '#7E7668'

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s` }}>
      {children}
    </div>
  )
}

/* Polar azimuthal globe — Space to Ice geometry, recast in brass linework */
function PolarGlobe({ size = 380 }: { size?: number }) {
  const [rot, setRot] = useState(0)
  useEffect(() => {
    let raf: number
    const tick = () => { setRot(r => (r + 0.08) % 360); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const CX = 200, CY = 200, R = 185
  function proj(lat: number, lon: number): [number, number] {
    const r = ((90 - lat) / 90) * R
    const a = ((lon + rot) * Math.PI) / 180
    return [CX + r * Math.sin(a), CY - r * Math.cos(a)]
  }
  function polyPath(coords: number[][]) {
    return coords.map(([lat, lon], i) => { const [x, y] = proj(lat, lon); return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}` }).join(' ') + ' Z'
  }
  const continents: number[][][] = [
    [[50,-60],[52,-67],[47,-70],[46,-79],[42,-82],[43,-90],[49,-95],[49,-89],[52,-80],[55,-82],[58,-76],[60,-65],[52,-56],[47,-53],[44,-60],[46,-64]],
    [[60,-65],[58,-76],[55,-82],[52,-80],[55,-86],[60,-94],[63,-91],[66,-86],[68,-80],[70,-75],[72,-80],[75,-85],[78,-90],[76,-95],[70,-100],[68,-108],[70,-120],[68,-130],[66,-136],[60,-139],[54,-133],[50,-128],[49,-123],[53,-120],[56,-118],[58,-112],[55,-100],[52,-95],[49,-95],[53,-100],[57,-105],[60,-110],[64,-110],[68,-108]],
    [[73,-80],[75,-75],[78,-70],[80,-80],[83,-75],[83,-85],[80,-95],[76,-100],[74,-95],[73,-85]],
    [[80,-62],[82,-65],[83,-72],[82,-82],[80,-78],[78,-68],[80,-63]],
    [[60,-139],[62,-142],[64,-146],[66,-150],[68,-154],[71,-157],[71,-162],[68,-166],[65,-168],[62,-166],[60,-162],[57,-157],[55,-160],[56,-153],[58,-150],[60,-148],[59,-143]],
    [[60,-43],[61,-48],[64,-53],[67,-55],[70,-54],[73,-57],[76,-60],[78,-68],[80,-62],[82,-50],[83,-35],[82,-22],[80,-18],[78,-19],[76,-22],[73,-25],[70,-28],[68,-30],[65,-37],[63,-40],[61,-44]],
    [[64,-24],[65,-22],[66,-18],[66,-14],[65,-13],[64,-14],[63,-18],[63,-22],[64,-24]],
    [[56,8],[58,6],[60,5],[62,5],[64,10],[66,13],[68,15],[70,19],[71,26],[70,30],[69,28],[67,20],[65,15],[63,12],[61,10],[59,11],[57,12],[56,10]],
    [[60,20],[62,22],[64,26],[66,26],[68,24],[70,28],[70,30],[68,30],[66,28],[64,28],[62,28],[61,26],[60,24]],
    [[50,-6],[51,-3],[53,0],[54,-1],[56,-3],[58,-5],[58,-7],[57,-6],[55,-5],[53,-4],[52,-5],[51,-8],[50,-10],[50,-7]],
    [[43,-9],[43,-1],[44,3],[46,2],[48,0],[49,2],[51,4],[53,6],[55,8],[56,8],[56,10],[55,12],[54,10],[52,7],[50,4],[48,2],[46,0],[44,-1],[43,-5]],
    [[55,30],[58,32],[60,38],[62,40],[65,40],[68,44],[70,48],[72,52],[70,58],[72,65],[74,60],[76,68],[73,80],[70,75],[68,60],[65,55],[60,50],[55,45],[50,40],[50,32]],
    [[73,80],[76,90],[75,100],[73,110],[72,120],[71,130],[70,140],[68,150],[66,160],[64,170],[62,178],[65,175],[68,170],[70,163],[72,155],[73,145],[75,135],[76,120],[77,110],[76,100]],
    [[62,178],[60,-178],[62,-172],[65,-170],[68,-172],[70,-178],[72,178],[70,170],[68,170],[65,175]],
    [[72,52],[73,54],[75,56],[77,60],[76,63],[74,58],[73,55],[72,53]],
    [[77,14],[78,16],[79,18],[80,16],[79,12],[78,12],[77,13]],
  ]
  const cities = [
    { lat: 45.4, lon: -75.7 }, // Ottawa
    { lat: 38.9, lon: -77.1 }, // Arlington
    { lat: 49.3, lon: -123.1 }, // Vancouver
    { lat: 64.1, lon: -21.9 }, // Reykjavik
    { lat: 59.9, lon: 10.8 }, // Oslo
    { lat: 63.7, lon: -68.5 }, // Iqaluit
    { lat: 64.8, lon: -147.7 }, // Fairbanks
  ]
  return (
    <svg viewBox="0 0 400 400" width={size} height={size} style={{ maxWidth: '100%', height: 'auto' }} aria-label="Polar projection of the Northern Hemisphere">
      <defs>
        <radialGradient id="ncSea" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0E1116" />
          <stop offset="80%" stopColor="#0A0C10" />
          <stop offset="100%" stopColor="#07090C" />
        </radialGradient>
        <radialGradient id="ncIce" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(239,233,220,0.18)" />
          <stop offset="100%" stopColor="rgba(239,233,220,0)" />
        </radialGradient>
        <filter id="ncGlow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <circle cx={CX} cy={CY} r={R} fill="url(#ncSea)" />
      {[80, 70, 60, 50].map(lat => {
        const r = ((90 - lat) / 90) * R
        return <circle key={lat} cx={CX} cy={CY} r={r} fill="none" stroke={BRASS} strokeWidth="0.3" opacity="0.12" />
      })}
      {continents.map((coords, i) => (
        <path key={i} d={polyPath(coords)} fill="rgba(184,149,106,0.10)" stroke={BRASS} strokeWidth="0.6" strokeOpacity="0.55" />
      ))}
      {(() => { const r = ((90 - 66.5) / 90) * R; return <circle cx={CX} cy={CY} r={r} fill="none" stroke={BRASS} strokeWidth="0.7" strokeDasharray="3 5" opacity="0.5" /> })()}
      <circle cx={CX} cy={CY} r={28} fill="url(#ncIce)" />
      <circle cx={CX} cy={CY} r={2.5} fill={BRASS} filter="url(#ncGlow)" />
      <circle cx={CX} cy={CY} r={7} fill="none" stroke={BRASS} strokeWidth="0.5" opacity="0.5" />
      {cities.map((c, i) => {
        const [x, y] = proj(c.lat, c.lon)
        const dist = Math.sqrt((x - CX) ** 2 + (y - CY) ** 2)
        if (dist > R - 5) return null
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="2" fill={BRASS} opacity="0.95" />
            <circle cx={x} cy={y} r="5.5" fill="none" stroke={BRASS} strokeWidth="0.35" opacity="0.4" />
          </g>
        )
      })}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={CREAM} strokeWidth="0.4" opacity="0.14" />
    </svg>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="nc-mono" style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: BRASS, marginBottom: 20 }}>{children}</p>
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="nc-display" style={{ fontSize: 'clamp(34px, 4.5vw, 52px)', fontWeight: 400, color: CREAM, lineHeight: 1.05, margin: '0 0 28px', letterSpacing: '-0.01em' }}>{children}</h2>
}

function Body({ children, lead = false }: { children: ReactNode; lead?: boolean }) {
  return <p style={{ fontSize: lead ? 19 : 16, lineHeight: 1.75, color: lead ? '#CFC8BA' : BODY, fontWeight: 300, margin: '0 0 20px' }}>{children}</p>
}

function Rule() {
  return <div style={{ maxWidth: 120, margin: '0 auto', padding: '4.5rem 0' }}><div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${BRASS_DIM}, transparent)` }} /></div>
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 12px' }}>
      <div className="nc-display" style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 300, color: BRASS, lineHeight: 1 }}>{value}</div>
      <div className="nc-mono" style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: DIM, marginTop: 10, lineHeight: 1.6 }}>{label}</div>
    </div>
  )
}

export default function NorthernCenturyPartners() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const submit = () => { if (pw.toUpperCase() === PASSCODE) setAuthed(true); else setError(true) }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 380, padding: '0 24px' }}>
          <p className="nc-mono" style={{ fontSize: 10, letterSpacing: '0.4em', marginBottom: 24, color: BRASS }}>CITYAGE · URBAN PLANET SERIES</p>
          <h1 className="nc-display" style={{ fontSize: 40, fontWeight: 400, marginBottom: 8, color: CREAM }}>The Northern Century</h1>
          <p style={{ fontSize: 14, marginBottom: 40, color: DIM }}>Concept thesis — authorized access only</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Access code"
              aria-label="Access code"
              style={{ flex: 1, padding: '12px 16px', borderRadius: 2, fontSize: 14, color: CREAM, outline: 'none', background: 'rgba(184,149,106,0.06)', border: `1px solid ${error ? '#B0524A' : BRASS_DIM}` }}
            />
            <button onClick={submit} style={{ padding: '12px 26px', borderRadius: 2, fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', cursor: 'pointer', background: BRASS, color: INK, border: 'none' }}>Enter</button>
          </div>
          {error && <p style={{ fontSize: 13, marginTop: 12, color: '#B0524A' }}>Invalid access code</p>}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.45, pointerEvents: 'none' }}>
          <PolarGlobe size={640} />
        </div>
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 840 }}>
          <Reveal><p className="nc-mono" style={{ fontSize: 10, letterSpacing: '0.5em', color: BRASS, marginBottom: 36, textTransform: 'uppercase' }}>Concept Thesis · 2026 · No. 01 — Founding Document</p></Reveal>
          <Reveal delay={0.2}><h1 className="nc-display" style={{ fontSize: 'clamp(54px, 9vw, 116px)', fontWeight: 400, color: CREAM, lineHeight: 0.98, margin: '0 0 28px', letterSpacing: '-0.02em' }}>The Northern<br />Century<span style={{ color: BRASS }}>.</span></h1></Reveal>
          <Reveal delay={0.4}><div style={{ width: 60, height: 1, margin: '0 auto 30px', background: `linear-gradient(90deg, transparent, ${BRASS}, transparent)` }} /></Reveal>
          <Reveal delay={0.5}><p className="nc-display" style={{ fontSize: 'clamp(19px, 2.4vw, 25px)', fontStyle: 'italic', fontWeight: 300, color: '#CFC8BA', lineHeight: 1.5, maxWidth: 620, margin: '0 auto' }}>The North is not the whole future. It is the new fulcrum — where the contests over security, climate and capital now converge.</p></Reveal>
          <Reveal delay={0.7}>
            <div className="nc-mono" style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap', marginTop: 48, fontSize: 10, letterSpacing: '0.25em', color: DIM }}>
              <span>66°33′N — ARCTIC CIRCLE</span><span>2026—2050</span><span>VANCOUVER · OTTAWA · ARLINGTON</span>
            </div>
          </Reveal>
        </div>
      </section>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 6rem' }}>

        {/* ── I · THESIS ── */}
        <section style={{ paddingTop: '2rem' }}>
          <Reveal>
            <Eyebrow>I · The Thesis</Eyebrow>
            <SectionTitle>A new fulcrum point.</SectionTitle>
            <Body lead>Every era has a place where its great questions meet. For this one, that place is the North — and almost no one is convening the people who must answer them.</Body>
            <Body>The Northern Century is CityAge&apos;s founding argument. Not that the future belongs to the North — the future will be contested everywhere — but that the North has become the fulcrum on which much of it turns: the point where the security of two continents, the stability of the planet&apos;s climate system, and the next economy&apos;s resource and space ambitions all apply their weight at once.</Body>
            <Body>Consider what now runs through northern latitudes. Continental missile defence — the Golden Dome debate, NORAD&apos;s modernization — depends on northern radar, northern territory, northern consent. NATO&apos;s centre of gravity has shifted toward the Nordic and Baltic north, while rival powers build icebreakers and northern bases of their own.</Body>
            <Body>At the same time, the Arctic remains a load-bearing wall of the biosphere: the engine room of ocean circulation, the calving ground of the world&apos;s ice, and the breeding ground for migratory birds and marine mammals whose ranges touch every continent. What happens to the North happens, eventually, to everyone.</Body>
            <Body>Yet the conversation remains fragmented. Defence talks to defence. Mining talks to mining. Conservation talks to itself. The Arctic file sits in a dozen ministries across eight countries. No platform consistently puts the builders, financiers, commanders, scientists and policymakers of the northern fulcrum in one room, under an editorial standard they trust. That is the gap Northern Century fills.</Body>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginTop: 56, padding: '40px 0', borderTop: `1px solid rgba(184,149,106,0.15)`, borderBottom: `1px solid rgba(184,149,106,0.15)` }}>
              <Stat value="3%" label="Of Earth's surface where consequential decisions are made" />
              <Stat value="100+" label="CityAge convenings over fifteen years" />
              <Stat value="25,000" label="Verified decision-makers in the network" />
            </div>
          </Reveal>
        </section>

        <Rule />

        {/* ── II · ARGUMENT ── */}
        <section>
          <Reveal>
            <Eyebrow>II · The Argument</Eyebrow>
            <SectionTitle>Three forces, one fulcrum.</SectionTitle>
            <Body lead>Each of these forces is reshaping policy and capital on its own. They converge on the same map — and on the same relatively small group of people who must act on it.</Body>
          </Reveal>
          {[
            { n: '1', t: 'The security realignment', b: "For the first time since the Cold War, the polar approaches are a first-order security theatre. Washington's proposed Golden Dome missile shield cannot function without northern sensing and northern territory; Canada has committed C$38.6 billion to NORAD modernization, with Arctic over-the-horizon radar due online in 2029. NATO's enlargement has made the alliance a northern power, even as rivals expand their own icebreaker fleets and polar presence. The competing interests are no longer theoretical — they are funded." },
            { n: '2', t: 'The planetary system', b: "The Arctic is not a region; it is infrastructure for the biosphere. Its ice and cold drive the ocean circulation that regulates climate far to the south. Its tundra and coastlines are the breeding grounds for migratory birds from six continents, and its waters sustain the whales, seals and walrus that anchor entire marine food webs. The North is warming faster than anywhere on Earth. Decisions about its development are decisions about planetary systems — which is precisely why they cannot be left to any single industry's room." },
            { n: '3', t: 'The resource & space economy', b: "Critical minerals, northern energy, polar-orbit launch and sensing, cold-climate data infrastructure: the technologies of the next economy favour northern geography. The capital is moving first; the policy frameworks and the public narrative are racing to catch up. The gap between the two is where a trusted convener earns its keep." },
          ].map((f, i) => (
            <Reveal key={f.n} delay={i * 0.1}>
              <div style={{ display: 'flex', gap: 24, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(184,149,106,0.12)' }}>
                <div className="nc-display" style={{ fontSize: 44, fontWeight: 300, color: BRASS, lineHeight: 1, minWidth: 36 }}>{f.n}</div>
                <div>
                  <h3 className="nc-display" style={{ fontSize: 25, fontWeight: 500, color: CREAM, margin: '0 0 12px' }}>{f.t}</h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.75, color: BODY, fontWeight: 300, margin: 0 }}>{f.b}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.15}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 28, marginTop: 56, padding: '40px 0', borderTop: `1px solid rgba(184,149,106,0.15)`, borderBottom: `1px solid rgba(184,149,106,0.15)` }}>
              <Stat value="C$38.6B" label="Canada's NORAD modernization commitment" />
              <Stat value="US$175B" label="Projected cost of the proposed Golden Dome shield" />
              <Stat value="2029" label="Arctic over-the-horizon radar scheduled online" />
              <Stat value="4×" label="Rate at which the Arctic warms relative to the globe" />
            </div>
          </Reveal>
        </section>

        <Rule />

        {/* ── III · GEOGRAPHY ── */}
        <section>
          <Reveal>
            <Eyebrow>III · The Geography</Eyebrow>
            <SectionTitle>Two capitals, one corridor.</SectionTitle>
            <Body lead>Northern Century is built as a two-node franchise. Each node anchors one side of the North Atlantic security and economic relationship; the franchise travels between them.</Body>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
              <PolarGlobe size={340} />
            </div>
          </Reveal>
          {[
            { k: 'Flagship · North Atlantic', t: 'Ottawa', b: "The political capital of the Northern Century's largest landmass. Home to the Arctic file, the NORAD relationship, the critical-minerals strategy and the diplomatic corps of the Nordic, Baltic and polar nations. CityAge's 2026 Ottawa convening assembled ambassadors, commanders and northern leaders under one roof — the proof of concept for the flagship." },
            { k: 'Anchor · Defence & Space', t: 'Arlington, Virginia', b: "The decision corridor of American defence and the fastest-growing address in the space economy. The Pentagon, the primes, the agencies and the investors who will fund the Northern Century's hardware sit within a few miles of each other. An Arlington convening puts Canadian and Nordic ambition directly in front of American capital and command." },
            { k: 'Home Base · Pacific Gateway', t: 'Vancouver', b: "CityAge's headquarters and the Pacific door to the North — the port, capital pool and talent base through which Asia meets the northern economy." },
          ].map((g, i) => (
            <Reveal key={g.t} delay={i * 0.1}>
              <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(184,149,106,0.12)' }}>
                <p className="nc-mono" style={{ fontSize: 9.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: BRASS, margin: '0 0 8px' }}>{g.k}</p>
                <h3 className="nc-display" style={{ fontSize: 27, fontWeight: 500, color: CREAM, margin: '0 0 10px' }}>{g.t}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.75, color: BODY, fontWeight: 300, margin: 0 }}>{g.b}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <Rule />

        {/* ── IV · PLATFORM ── */}
        <section>
          <Reveal>
            <Eyebrow>IV · The Platform</Eyebrow>
            <SectionTitle>Three engines, one franchise.</SectionTitle>
            <Body lead>Northern Century is not an event. It is a franchise with three reinforcing engines, each generating intelligence and relationships for the other two.</Body>
          </Reveal>
          {[
            { k: 'Engine 01 · Convening', t: 'The Rooms', b: 'Flagship summits in Ottawa and Arlington, with curated micro-networks — eight to twelve principals, assembled around a single partner\u2019s objective — as the premium tier. Invitation-only, editorially programmed, no pay-to-play panels.' },
            { k: 'Engine 02 · Intelligence', t: 'Northern Century Signals', b: 'A paid intelligence vertical: concise, sourced, written in a correspondent\u2019s voice rather than a consultant\u2019s. Briefings and quarterly reports for the people who can\u2019t be in every room but need to know what was said in them.' },
            { k: 'Engine 03 · Advisory', t: 'The Studio', b: 'CityAge\u2019s private advisory practice, applying the Studio System — a methodology for building influence through convening, editorial and campaigns — for a small number of partners aligned with the Northern Century thesis.' },
          ].map((e, i) => (
            <Reveal key={e.t} delay={i * 0.1}>
              <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(184,149,106,0.12)' }}>
                <p className="nc-mono" style={{ fontSize: 9.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: BRASS, margin: '0 0 8px' }}>{e.k}</p>
                <h3 className="nc-display" style={{ fontSize: 27, fontWeight: 500, color: CREAM, margin: '0 0 10px' }}>{e.t}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.75, color: BODY, fontWeight: 300, margin: 0 }}>{e.b}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <p className="nc-display" style={{ fontSize: 21, fontStyle: 'italic', fontWeight: 300, color: '#CFC8BA', lineHeight: 1.6, marginTop: 48, textAlign: 'center' }}>The model is deliberate: events build the network, the network feeds the intelligence, the intelligence earns the advisory — and the byline holds it all together.</p>
          </Reveal>
        </section>

        <Rule />

        {/* ── V · PEOPLE ── */}
        <section>
          <Reveal>
            <Eyebrow>V · The People</Eyebrow>
            <SectionTitle>Led from the North, not about it.</SectionTitle>
            <h3 className="nc-display" style={{ fontSize: 29, fontWeight: 500, color: CREAM, margin: '8px 0 4px' }}>Miro Cernetig</h3>
            <p className="nc-mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: BRASS, margin: '0 0 18px' }}>Founder &amp; Publisher · CityAge</p>
            <Body>Three decades reporting on the people who run the world, from Gorbachev to Thatcher — including years above the treeline.</Body>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
              {[
                { w: 'Bureau Chief, The Globe and Mail', h: 'Beijing · New York · The Arctic · Vancouver' },
                { w: 'Michener Award', h: 'Canada\u2019s highest honour for public-service journalism' },
                { w: 'Polar Bear Safari', h: 'Documentary filmed over two weeks on the ice, by dogsled' },
              ].map(c => (
                <div key={c.w} style={{ padding: '16px 20px', background: 'rgba(184,149,106,0.05)', borderLeft: `2px solid ${BRASS_DIM}` }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: CREAM }}>{c.w}</div>
                  <div className="nc-mono" style={{ fontSize: 11, color: DIM, marginTop: 4, letterSpacing: '0.06em' }}>{c.h}</div>
                </div>
              ))}
            </div>
            <p className="nc-display" style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 300, color: '#CFC8BA', lineHeight: 1.6, margin: '36px 0 0', paddingLeft: 22, borderLeft: `2px solid ${BRASS}` }}>&ldquo;The room is curated by editors, not underwriters — that is the entire value of the room.&rdquo;</p>
          </Reveal>
          <Reveal delay={0.15}>
            <Body><span style={{ display: 'block', marginTop: 48 }}>Northern Century&apos;s counsel is drawn from people who have governed, commanded and built in the North — not merely written about it. The advisory circle, now in formation:</span></Body>
            <div style={{ marginTop: 8, paddingTop: 28, borderTop: '1px solid rgba(184,149,106,0.12)' }}>
              <h3 className="nc-display" style={{ fontSize: 25, fontWeight: 500, color: CREAM, margin: '0 0 4px' }}>The Hon. Dennis Patterson</h3>
              <p className="nc-mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: BRASS, margin: '0 0 12px' }}>Advisory Counsel · In Formation</p>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: BODY, fontWeight: 300, margin: 0 }}>Premier of the Northwest Territories, 1987–1991. Senator for Nunavut, 2009–2023. A principal figure in the negotiation of the Nunavut Land Claims Agreement and the creation of Nunavut itself — one of the few people alive who has redrawn the map of the North.</p>
            </div>
            <div style={{ marginTop: 32, paddingTop: 28, borderTop: '1px solid rgba(184,149,106,0.12)' }}>
              <h3 className="nc-display" style={{ fontSize: 25, fontWeight: 500, color: CREAM, margin: '0 0 4px' }}>Further appointments</h3>
              <p className="nc-mono" style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: BRASS, margin: '0 0 12px' }}>To be announced · 2026</p>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: BODY, fontWeight: 300, margin: 0 }}>Northern premiers, polar commanders, Indigenous leaders, Nordic and Baltic diplomats, and the scientists who know the ice — assembled deliberately, and slowly, because the counsel is the franchise.</p>
            </div>
          </Reveal>
        </section>

        <Rule />

        {/* ── VI · INVITATION ── */}
        <section style={{ textAlign: 'center' }}>
          <Reveal>
            <Eyebrow>VI · The Invitation</Eyebrow>
            <h2 className="nc-display" style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 400, color: CREAM, lineHeight: 1.15, margin: '0 0 28px' }}>The century is finding its fulcrum.<br /><em style={{ color: BRASS }}>Be in the room when it tips.</em></h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: BODY, fontWeight: 300, maxWidth: 560, margin: '0 auto 48px' }}>Northern Century partnerships are limited by design: a small number of title and knowledge partners per convening, selected for alignment with the thesis. Partners shape the questions on the table. They do not buy the answers. The partnership schedule, with investment levels, is available on request.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, maxWidth: 640, margin: '0 auto 56px' }}>
              {[
                { t: 'Ottawa', s: 'North Atlantic Flagship' },
                { t: 'Arlington', s: 'Defence & Space Anchor · 2027' },
                { t: 'Signals', s: 'Paid Intelligence Vertical' },
              ].map(x => (
                <div key={x.t} style={{ padding: '22px 16px', border: `1px solid rgba(184,149,106,0.2)` }}>
                  <div className="nc-display" style={{ fontSize: 23, fontWeight: 500, color: CREAM }}>{x.t}</div>
                  <div className="nc-mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginTop: 8, lineHeight: 1.6 }}>{x.s}</div>
                </div>
              ))}
            </div>
            <a href="mailto:miro@cityage.com?subject=Northern%20Century%20Partnership" style={{ display: 'inline-block', padding: '15px 42px', background: BRASS, color: INK, fontSize: 14, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>Start the conversation</a>
          </Reveal>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid rgba(184,149,106,0.15)', padding: '40px 1.5rem', textAlign: 'center' }}>
        <p className="nc-mono" style={{ fontSize: 10, letterSpacing: '0.25em', color: DIM, lineHeight: 2.2, textTransform: 'uppercase' }}>
          Miro Cernetig · CEO &amp; Publisher, CityAge · miro@cityage.com<br />
          CityAge · An Urban Planet Franchise · © 2026 CityAge Media
        </p>
      </footer>
    </div>
  )
}
