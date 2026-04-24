'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'

const PASSCODE = 'ARCTIC2026'

/* ─── COLD colour tokens ─── */
const C = {
  bg: '#040a14',
  bg2: '#081222',
  ice: '#a8cce0',
  cold: '#5a9fc4',
  deep: '#2d7aab',
  aurora: '#6db89a',
  frost: '#d4e6f2',
  white: '#e6eef5',
  dim: '#5a7a96',
  glow: '#3a8dba',
}

/* ─── Scroll reveal ─── */
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Frost line divider ─── */
function FrostLine() {
  return (
    <div style={{ width: '100%', height: 1, margin: '4rem auto', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute', top: 0, left: '-100%', width: '200%', height: '100%',
          background: `linear-gradient(90deg, transparent, ${C.deep}, ${C.cold}, ${C.ice}, ${C.cold}, ${C.deep}, transparent)`,
          animation: 'frostSlide 5s ease-in-out infinite',
        }}
      />
    </div>
  )
}

/* ─── Section heading ─── */
function Head({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      {eyebrow && (
        <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.25em', color: C.cold, textTransform: 'uppercase', marginBottom: 12 }}>
          {eyebrow}
        </p>
      )}
      <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 600, color: C.white, margin: 0, lineHeight: 1.15 }}>
        {title}
      </h2>
      {sub && (
        <p style={{ color: C.dim, fontSize: 15, marginTop: 14, lineHeight: 1.65, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto' }}>
          {sub}
        </p>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   ARCTIC GLOBE — azimuthal equidistant projection
   from the North Pole with continent outlines
   ═══════════════════════════════════════════════ */
function ArcticGlobe() {
  const [rot, setRot] = useState(0)
  useEffect(() => {
    let raf: number
    const tick = () => { setRot(r => (r + 0.06) % 360); raf = requestAnimationFrame(tick) }
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
    return coords.map(([lat, lon], i) => {
      const [x, y] = proj(lat, lon)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ') + ' Z'
  }

  const continents = [
    { name: 'canada_mainland', color: '#12293d', coords: [
      [50,-60],[52,-67],[47,-70],[46,-79],[42,-82],[43,-90],
      [49,-95],[49,-89],[52,-80],[55,-82],[58,-76],[60,-65],
      [52,-56],[47,-53],[44,-60],[46,-64],
    ]},
    { name: 'canada_north', color: '#142f44', coords: [
      [60,-65],[58,-76],[55,-82],[52,-80],[55,-86],
      [60,-94],[63,-91],[66,-86],[68,-80],[70,-75],
      [72,-80],[75,-85],[78,-90],[76,-95],[70,-100],
      [68,-108],[70,-120],[68,-130],[66,-136],[60,-139],
      [54,-133],[50,-128],[49,-123],[53,-120],[56,-118],
      [58,-112],[55,-100],[52,-95],[49,-95],[53,-100],
      [57,-105],[60,-110],[64,-110],[68,-108],
    ]},
    { name: 'arctic_archipelago', color: '#163349', coords: [
      [73,-80],[75,-75],[78,-70],[80,-80],[83,-75],
      [83,-85],[80,-95],[76,-100],[74,-95],[73,-85],
    ]},
    { name: 'ellesmere', color: '#163349', coords: [
      [80,-62],[82,-65],[83,-72],[82,-82],[80,-78],[78,-68],[80,-63],
    ]},
    { name: 'alaska', color: '#122840', coords: [
      [60,-139],[62,-142],[64,-146],[66,-150],[68,-154],
      [71,-157],[71,-162],[68,-166],[65,-168],[62,-166],
      [60,-162],[57,-157],[55,-160],[56,-153],[58,-150],
      [60,-148],[59,-143],
    ]},
    { name: 'greenland', color: '#173a50', coords: [
      [60,-43],[61,-48],[64,-53],[67,-55],[70,-54],
      [73,-57],[76,-60],[78,-68],[80,-62],[82,-50],
      [83,-35],[82,-22],[80,-18],[78,-19],[76,-22],
      [73,-25],[70,-28],[68,-30],[65,-37],[63,-40],[61,-44],
    ]},
    { name: 'iceland', color: '#153550', coords: [
      [64,-24],[65,-22],[66,-18],[66,-14],[65,-13],
      [64,-14],[63,-18],[63,-22],[64,-24],
    ]},
    { name: 'scandinavia', color: '#12293d', coords: [
      [56,8],[58,6],[60,5],[62,5],[64,10],
      [66,13],[68,15],[70,19],[71,26],[70,30],
      [69,28],[67,20],[65,15],[63,12],[61,10],
      [59,11],[57,12],[56,10],
    ]},
    { name: 'finland', color: '#142f44', coords: [
      [60,20],[62,22],[64,26],[66,26],[68,24],
      [70,28],[70,30],[68,30],[66,28],[64,28],
      [62,28],[61,26],[60,24],
    ]},
    { name: 'uk_ireland', color: '#112640', coords: [
      [50,-6],[51,-3],[53,0],[54,-1],[56,-3],
      [58,-5],[58,-7],[57,-6],[55,-5],[53,-4],
      [52,-5],[51,-8],[50,-10],[50,-7],
    ]},
    { name: 'europe_west', color: '#112640', coords: [
      [43,-9],[43,-1],[44,3],[46,2],[48,0],
      [49,2],[51,4],[53,6],[55,8],[56,8],[56,10],
      [55,12],[54,10],[52,7],[50,4],[48,2],
      [46,0],[44,-1],[43,-5],
    ]},
    { name: 'russia_west', color: '#132b40', coords: [
      [55,30],[58,32],[60,38],[62,40],[65,40],
      [68,44],[70,48],[72,52],[70,58],[72,65],
      [74,60],[76,68],[73,80],[70,75],[68,60],
      [65,55],[60,50],[55,45],[50,40],[50,32],
    ]},
    { name: 'russia_siberia', color: '#142f44', coords: [
      [73,80],[76,90],[75,100],[73,110],[72,120],
      [71,130],[70,140],[68,150],[66,160],[64,170],
      [62,178],[65,175],[68,170],[70,163],[72,155],
      [73,145],[75,135],[76,120],[77,110],[76,100],
    ]},
    { name: 'russia_far_east', color: '#12293d', coords: [
      [62,178],[60,-178],[62,-172],[65,-170],
      [68,-172],[70,-178],[72,178],[70,170],[68,170],[65,175],
    ]},
    { name: 'novaya_zemlya', color: '#163349', coords: [
      [72,52],[73,54],[75,56],[77,60],[76,63],
      [74,58],[73,55],[72,53],
    ]},
    { name: 'svalbard', color: '#163349', coords: [
      [77,14],[78,16],[79,18],[80,16],[79,12],[78,12],[77,13],
    ]},
    { name: 'japan_hokkaido', color: '#112640', coords: [
      [42,140],[43,142],[44,145],[45,145],[44,143],[42,141],
    ]},
  ]

  const latRings = [20, 40, 60, 80, 100, 120, 140, 165]
  const lonLines = Array.from({ length: 24 }, (_, i) => i * 15)

  const cities = [
    { lat: 45.4, lon: -75.7 },
    { lat: 69.6, lon: 18.9 },
    { lat: 64.1, lon: -21.9 },
    { lat: 64.2, lon: -51.7 },
    { lat: 63.7, lon: -68.5 },
    { lat: 61.2, lon: -149.9 },
    { lat: 78.2, lon: 15.6 },
  ]

  return (
    <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 440, margin: '0 auto', display: 'block' }}>
      <defs>
        <radialGradient id="ocean" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0d2238" />
          <stop offset="60%" stopColor="#091a2e" />
          <stop offset="100%" stopColor="#040a14" />
        </radialGradient>
        <radialGradient id="icecap" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(180,210,230,0.3)" />
          <stop offset="60%" stopColor="rgba(180,210,230,0.08)" />
          <stop offset="100%" stopColor="rgba(180,210,230,0)" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={CX} cy={CY} r={R} fill="url(#ocean)" />
      {latRings.map((r, i) => (
        <circle key={`lat${i}`} cx={CX} cy={CY} r={r} fill="none" stroke="rgba(90,160,196,0.06)" strokeWidth="0.4" />
      ))}
      {lonLines.map((deg, i) => {
        const a = ((deg + rot) * Math.PI) / 180
        return (
          <line key={`lon${i}`} x1={CX} y1={CY} x2={CX + R * Math.sin(a)} y2={CY - R * Math.cos(a)}
            stroke="rgba(90,160,196,0.04)" strokeWidth="0.4" />
        )
      })}
      {continents.map((c, i) => (
        <path key={i} d={polyPath(c.coords)} fill={c.color} stroke="rgba(90,160,196,0.12)" strokeWidth="0.3" />
      ))}
      {(() => { const r = ((90 - 66.5) / 90) * R; return (
        <circle cx={CX} cy={CY} r={r} fill="none" stroke={C.cold} strokeWidth="0.7" strokeDasharray="3 5" opacity="0.35" />
      ) })()}
      <circle cx={CX} cy={CY} r={28} fill="url(#icecap)" />
      <circle cx={CX} cy={CY} r={2.5} fill={C.cold} filter="url(#glow)" />
      <circle cx={CX} cy={CY} r={7} fill="none" stroke={C.cold} strokeWidth="0.5" opacity="0.5" />
      {cities.map((c, i) => {
        const [x, y] = proj(c.lat, c.lon)
        const dist = Math.sqrt((x - CX) ** 2 + (y - CY) ** 2)
        if (dist > R - 5) return null
        return (
          <g key={`city${i}`}>
            <circle cx={x} cy={y} r="2" fill={C.cold} opacity="0.9" />
            <circle cx={x} cy={y} r="5" fill="none" stroke={C.cold} strokeWidth="0.35" opacity="0.35" />
          </g>
        )
      })}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.ice} strokeWidth="0.4" opacity="0.12" />
    </svg>
  )
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function SpaceToIcePartners() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const submit = () => {
    if (pw.toUpperCase() === PASSCODE) setAuthed(true)
    else setError(true)
  }

  /* ── PASSWORD GATE ── */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="font-mono text-[11px] tracking-[0.3em] mb-4" style={{ color: C.cold }}>CITYAGE MEDIA</p>
          <h1 className="font-display text-4xl font-semibold mb-2">Space to Ice</h1>
          <p className="text-sm mb-8" style={{ color: C.dim }}>Partnership materials — authorized access only</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Access code"
              className="flex-1 px-4 py-3 rounded-sm text-sm text-white outline-none"
              style={{
                background: 'rgba(90,160,196,0.06)',
                border: `1px solid ${error ? '#c25050' : 'rgba(90,160,196,0.2)'}`,
              }}
            />
            <button
              onClick={submit}
              className="px-6 py-3 rounded-sm text-sm font-semibold tracking-wide cursor-pointer"
              style={{ background: C.cold, color: C.bg }}
            >
              Enter
            </button>
          </div>
          {error && <p className="text-sm mt-3" style={{ color: '#c25050' }}>Invalid access code</p>}
        </div>
      </div>
    )
  }

  /* ── MAIN CONTENT ── */
  const sec = 'max-w-[880px] mx-auto px-6 py-20'

  return (
    <div>
      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-8 relative">
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: '8%', left: '50%', transform: 'translateX(-50%)',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(45,122,171,0.06) 0%, transparent 70%)',
          }}
        />
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.35em] text-center mb-5" style={{ color: C.cold }}>
            CITYAGE MEDIA PRESENTS
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <h1
            className="font-display text-center font-bold mb-2"
            style={{ fontSize: 'clamp(46px, 7vw, 78px)', color: C.white, lineHeight: 1.05 }}
          >
            Space to Ice
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="text-center max-w-lg mx-auto mb-10" style={{ color: C.dim, fontSize: 15, lineHeight: 1.65 }}>
            Arctic sovereignty. Northern infrastructure. The space economy above Canada&apos;s North.
            A CityAge intelligence event — Ottawa, Fall 2026.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <ArcticGlobe />
        </Reveal>
        <Reveal delay={0.6}>
          <p className="font-mono text-[10px] tracking-[0.25em] text-center mt-5" style={{ color: C.dim }}>
            SCROLL TO EXPLORE THE PARTNERSHIP
          </p>
        </Reveal>
      </section>

      <FrostLine />

      {/* ── THE MOMENT ── */}
      <section className={sec}>
        <Reveal>
          <Head
            eyebrow="The Moment"
            title="The North Is the New Frontier"
            sub="Canada controls the world's longest Arctic coastline, the Northwest Passage, and critical mineral reserves that will define the next century of allied security. The question is no longer whether the Arctic matters — it's who will lead there."
          />
        </Reveal>
        <Reveal delay={0.12}>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { n: '162,000 km', l: 'Arctic coastline' },
              { n: '$125B+', l: 'Critical minerals in play' },
              { n: '3', l: 'Oceans touching Canada' },
              { n: '40%', l: 'Of Canada\'s landmass' },
            ].map((s, i) => (
              <div
                key={i}
                className="text-center rounded-sm flex-1 min-w-[150px]"
                style={{
                  background: 'rgba(90,160,196,0.04)',
                  border: '1px solid rgba(90,160,196,0.1)',
                  padding: '1.2rem 1.5rem',
                }}
              >
                <p className="font-display text-2xl font-semibold mb-1" style={{ color: C.ice }}>{s.n}</p>
                <p className="font-mono text-[11px] tracking-wider" style={{ color: C.dim }}>{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <FrostLine />

      {/* ── THE CONVERSATION ── */}
      <section className={sec}>
        <Reveal>
          <Head eyebrow="The Conversation" title="Six Vectors of Northern Power" />
        </Reveal>
        <div className="flex flex-wrap gap-4">
          {[
            { num: '01', title: 'Defence & Sovereignty', body: 'NORAD modernization, NATO\'s northern flank, Arctic surveillance, and the military posture required to hold Canada\'s claim.' },
            { num: '02', title: 'Critical Minerals', body: 'Rare earths, lithium, cobalt, nickel — the subsurface wealth that makes the Arctic a strategic asset for allied supply chains.' },
            { num: '03', title: 'Space & Earth Observation', body: 'Satellite constellations, polar orbits, Arctic communications, and the space infrastructure that makes sovereignty enforceable.' },
            { num: '04', title: 'Northern Infrastructure', body: 'Ports, roads, fibre, energy grids — the physical backbone that transforms Arctic policy from rhetoric into reality.' },
            { num: '05', title: 'Telecommunications', body: 'Closing the connectivity gap across Canada\'s North — LEO satellite, fibre-to-the-community, and the digital sovereignty imperative.' },
            { num: '06', title: 'Indigenous Partnership', body: 'Co-management, benefit agreements, and the recognition that Arctic development without Indigenous leadership is neither ethical nor possible.' },
          ].map((t, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div
                className="rounded-sm flex-1 min-w-[240px]"
                style={{
                  background: 'rgba(90,160,196,0.03)',
                  border: '1px solid rgba(90,160,196,0.1)',
                  padding: '1.5rem',
                }}
              >
                <p className="font-mono text-[11px] tracking-[0.2em] mb-2" style={{ color: C.cold }}>{t.num}</p>
                <h3 className="font-display text-[17px] font-semibold mb-2" style={{ color: C.frost }}>{t.title}</h3>
                <p className="text-[13.5px] leading-relaxed" style={{ color: C.dim }}>{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <FrostLine />

      {/* ── THE ROOM ── */}
      <section className={sec}>
        <Reveal>
          <Head
            eyebrow="The Room"
            title="80 Leaders. Chatham House Rules."
            sub="Space to Ice convenes the decision-makers shaping Arctic policy, funding northern infrastructure, and building the space systems that enforce sovereignty. No media. No slides. Conversation only."
          />
        </Reveal>
        <Reveal delay={0.12}>
          <div className="flex flex-wrap gap-1.5 justify-center mt-4">
            {[
              'Federal Defence', 'Northern Affairs', 'NORAD / NATO', 'Space Agencies',
              'Critical Mineral Operators', 'Indigenous Leaders', 'Territorial Premiers',
              'Nordic Embassies', 'Satellite Companies', 'Infrastructure Investors',
              'Arctic Researchers', 'Telecom Providers',
            ].map((tag, i) => (
              <span
                key={i}
                className="font-mono text-[11.5px] tracking-wide rounded-sm"
                style={{
                  padding: '5px 12px',
                  border: '1px solid rgba(90,160,196,0.12)',
                  color: C.ice,
                  background: 'rgba(90,160,196,0.03)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <FrostLine />

      {/* ── PARTNERSHIP TIERS ── */}
      <section className={sec}>
        <Reveal>
          <Head
            eyebrow="Partnership"
            title="Knowledge Partner Tiers"
            sub="Space to Ice is a sponsor-funded intelligence event. No ticket sales. Your partnership underwrites the room and positions your organization at the centre of the Arctic conversation."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              {
                name: 'Strategic', price: '$15,000', color: C.cold,
                features: ['Naming presence throughout', '4 delegate seats', 'Private briefing with CityAge', 'Logo on all materials', 'Post-event intelligence report'],
              },
              {
                name: 'Presenting', price: '$7,500', color: C.aurora,
                features: ['Session naming rights', '2 delegate seats', 'Logo placement', 'Event photography package', 'Intelligence report access'],
              },
              {
                name: 'Supporting', price: '$5,000', color: C.frost,
                features: ['1 delegate seat', 'Logo on event materials', 'Pre-event networking access', 'Intelligence report access'],
              },
            ].map((tier, i) => (
              <div
                key={i}
                className="text-center rounded-sm flex-1 min-w-[200px]"
                style={{
                  background: C.bg2,
                  border: `1px solid ${tier.color}30`,
                  borderTop: `3px solid ${tier.color}`,
                  padding: '2rem 1.5rem',
                }}
              >
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: tier.color }}>{tier.name}</p>
                <p className="font-display text-3xl font-semibold mb-5" style={{ color: C.white }}>{tier.price}</p>
                <div style={{ borderTop: `1px solid ${tier.color}20`, paddingTop: '1rem' }}>
                  {tier.features.map((f, j) => (
                    <p key={j} className="text-[13px] my-1.5 leading-relaxed" style={{ color: C.dim }}>{f}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <FrostLine />

      {/* ── CREDENTIALS ── */}
      <section className={sec}>
        <Reveal>
          <Head
            eyebrow="Credentials"
            title="15 Years Building Rooms That Matter"
            sub="CityAge has convened 100+ events across 50+ cities, bringing together 25,000+ decision-makers at the intersection of infrastructure, technology, and policy."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div
            className="max-w-xl mx-auto rounded-sm"
            style={{
              background: 'rgba(90,160,196,0.03)',
              border: '1px solid rgba(90,160,196,0.08)',
              padding: '2rem',
            }}
          >
            <p className="font-display italic text-[15px] leading-loose" style={{ color: C.frost }}>
              &ldquo;Space to Ice grows from CityAge&apos;s Arctic roots — and from the conviction that Canada&apos;s
              northern future will be decided in rooms like this one. The question is whether Canadian leaders
              will shape that future, or watch while others do.&rdquo;
            </p>
            <p className="font-mono text-[13px] mt-4 tracking-wide" style={{ color: C.dim }}>
              — Miro Cernetig, Founder &amp; CEO, CityAge Media
            </p>
            <p className="text-xs mt-1" style={{ color: C.dim }}>
              Michener Award-winning journalist · Former Globe and Mail Arctic correspondent · Arctic Council correspondent
            </p>
          </div>
        </Reveal>
      </section>

      <FrostLine />

      {/* ── CONTACT ── */}
      <section className={`${sec} text-center pb-20`}>
        <Reveal>
          <Head eyebrow="Next Step" title="Join the Conversation" />
          <p className="text-sm max-w-md mx-auto mb-6 leading-relaxed" style={{ color: C.dim }}>
            Space to Ice partnerships are limited and by invitation. Contact us to discuss how your
            organization can be part of the Arctic&apos;s defining conversation.
          </p>
          <a
            href="mailto:miro@cityage.com?subject=Space%20to%20Ice%20Partnership%20Inquiry"
            className="inline-block px-9 py-3.5 rounded-sm text-sm font-semibold tracking-wide no-underline"
            style={{ background: C.cold, color: C.bg }}
          >
            miro@cityage.com
          </a>
          <p className="font-mono text-xs mt-5 tracking-[0.1em]" style={{ color: C.dim }}>
            CITYAGE MEDIA — VANCOUVER · OTTAWA
          </p>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(90,160,196,0.06)', padding: '1.5rem', textAlign: 'center' }}>
        <p className="font-mono text-[11px] tracking-[0.1em]" style={{ color: C.dim }}>
          © 2026 CITYAGE MEDIA INC. · CONFIDENTIAL · DO NOT DISTRIBUTE
        </p>
      </footer>
    </div>
  )
}
