'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'

const PASSCODE = 'ARCTIC2026'

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
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s` }}>
      {children}
    </div>
  )
}

function ArcticGlobe() {
  const [rot, setRot] = useState(0)
  useEffect(() => {
    let raf: number
    const tick = () => { setRot(r => (r + 0.1) % 360); raf = requestAnimationFrame(tick) }
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
  const continents = [
    { color: '#12293d', coords: [[50,-60],[52,-67],[47,-70],[46,-79],[42,-82],[43,-90],[49,-95],[49,-89],[52,-80],[55,-82],[58,-76],[60,-65],[52,-56],[47,-53],[44,-60],[46,-64]] },
    { color: '#142f44', coords: [[60,-65],[58,-76],[55,-82],[52,-80],[55,-86],[60,-94],[63,-91],[66,-86],[68,-80],[70,-75],[72,-80],[75,-85],[78,-90],[76,-95],[70,-100],[68,-108],[70,-120],[68,-130],[66,-136],[60,-139],[54,-133],[50,-128],[49,-123],[53,-120],[56,-118],[58,-112],[55,-100],[52,-95],[49,-95],[53,-100],[57,-105],[60,-110],[64,-110],[68,-108]] },
    { color: '#163349', coords: [[73,-80],[75,-75],[78,-70],[80,-80],[83,-75],[83,-85],[80,-95],[76,-100],[74,-95],[73,-85]] },
    { color: '#163349', coords: [[80,-62],[82,-65],[83,-72],[82,-82],[80,-78],[78,-68],[80,-63]] },
    { color: '#122840', coords: [[60,-139],[62,-142],[64,-146],[66,-150],[68,-154],[71,-157],[71,-162],[68,-166],[65,-168],[62,-166],[60,-162],[57,-157],[55,-160],[56,-153],[58,-150],[60,-148],[59,-143]] },
    { color: '#173a50', coords: [[60,-43],[61,-48],[64,-53],[67,-55],[70,-54],[73,-57],[76,-60],[78,-68],[80,-62],[82,-50],[83,-35],[82,-22],[80,-18],[78,-19],[76,-22],[73,-25],[70,-28],[68,-30],[65,-37],[63,-40],[61,-44]] },
    { color: '#153550', coords: [[64,-24],[65,-22],[66,-18],[66,-14],[65,-13],[64,-14],[63,-18],[63,-22],[64,-24]] },
    { color: '#12293d', coords: [[56,8],[58,6],[60,5],[62,5],[64,10],[66,13],[68,15],[70,19],[71,26],[70,30],[69,28],[67,20],[65,15],[63,12],[61,10],[59,11],[57,12],[56,10]] },
    { color: '#142f44', coords: [[60,20],[62,22],[64,26],[66,26],[68,24],[70,28],[70,30],[68,30],[66,28],[64,28],[62,28],[61,26],[60,24]] },
    { color: '#112640', coords: [[50,-6],[51,-3],[53,0],[54,-1],[56,-3],[58,-5],[58,-7],[57,-6],[55,-5],[53,-4],[52,-5],[51,-8],[50,-10],[50,-7]] },
    { color: '#112640', coords: [[43,-9],[43,-1],[44,3],[46,2],[48,0],[49,2],[51,4],[53,6],[55,8],[56,8],[56,10],[55,12],[54,10],[52,7],[50,4],[48,2],[46,0],[44,-1],[43,-5]] },
    { color: '#132b40', coords: [[55,30],[58,32],[60,38],[62,40],[65,40],[68,44],[70,48],[72,52],[70,58],[72,65],[74,60],[76,68],[73,80],[70,75],[68,60],[65,55],[60,50],[55,45],[50,40],[50,32]] },
    { color: '#142f44', coords: [[73,80],[76,90],[75,100],[73,110],[72,120],[71,130],[70,140],[68,150],[66,160],[64,170],[62,178],[65,175],[68,170],[70,163],[72,155],[73,145],[75,135],[76,120],[77,110],[76,100]] },
    { color: '#12293d', coords: [[62,178],[60,-178],[62,-172],[65,-170],[68,-172],[70,-178],[72,178],[70,170],[68,170],[65,175]] },
    { color: '#163349', coords: [[72,52],[73,54],[75,56],[77,60],[76,63],[74,58],[73,55],[72,53]] },
    { color: '#163349', coords: [[77,14],[78,16],[79,18],[80,16],[79,12],[78,12],[77,13]] },
  ]
  const latRings = [20, 40, 60, 80, 100, 120, 140, 165]
  const lonLines = Array.from({ length: 24 }, (_, i) => i * 15)
  const cities = [{lat:45.4,lon:-75.7},{lat:69.6,lon:18.9},{lat:64.1,lon:-21.9},{lat:64.2,lon:-51.7},{lat:63.7,lon:-68.5},{lat:61.2,lon:-149.9},{lat:78.2,lon:15.6}]
  return (
    <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 560, margin: '0 auto', display: 'block' }}>
      <defs>
        <radialGradient id="ocean" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#0d2238" /><stop offset="60%" stopColor="#091a2e" /><stop offset="100%" stopColor="#040a14" /></radialGradient>
        <radialGradient id="icecap" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(180,210,230,0.3)" /><stop offset="60%" stopColor="rgba(180,210,230,0.08)" /><stop offset="100%" stopColor="rgba(180,210,230,0)" /></radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx={CX} cy={CY} r={R} fill="url(#ocean)" />
      {latRings.map((r, i) => <circle key={`lat${i}`} cx={CX} cy={CY} r={r} fill="none" stroke="rgba(90,160,196,0.06)" strokeWidth="0.4" />)}
      {lonLines.map((deg, i) => { const a = ((deg + rot) * Math.PI) / 180; return <line key={`lon${i}`} x1={CX} y1={CY} x2={CX + R * Math.sin(a)} y2={CY - R * Math.cos(a)} stroke="rgba(90,160,196,0.04)" strokeWidth="0.4" /> })}
      {continents.map((c, i) => <path key={i} d={polyPath(c.coords)} fill={c.color} stroke="rgba(90,160,196,0.12)" strokeWidth="0.3" />)}
      {(() => { const r = ((90 - 66.5) / 90) * R; return <circle cx={CX} cy={CY} r={r} fill="none" stroke="#5a9fc4" strokeWidth="0.7" strokeDasharray="3 5" opacity="0.35" /> })()}
      <circle cx={CX} cy={CY} r={28} fill="url(#icecap)" /><circle cx={CX} cy={CY} r={2.5} fill="#5a9fc4" filter="url(#glow)" /><circle cx={CX} cy={CY} r={7} fill="none" stroke="#5a9fc4" strokeWidth="0.5" opacity="0.5" />
      {cities.map((c, i) => { const [x, y] = proj(c.lat, c.lon); const dist = Math.sqrt((x - CX) ** 2 + (y - CY) ** 2); if (dist > R - 5) return null; return (<g key={`city${i}`}><circle cx={x} cy={y} r="2" fill="#5a9fc4" opacity="0.9" /><circle cx={x} cy={y} r="5" fill="none" stroke="#5a9fc4" strokeWidth="0.35" opacity="0.35" /></g>) })}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#a8cce0" strokeWidth="0.4" opacity="0.12" />
    </svg>
  )
}

function Rule() {
  return (<div style={{ maxWidth: 120, margin: '0 auto', padding: '4rem 0' }}><div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(90,160,196,0.4), transparent)' }} /></div>)
}

export default function SpaceToIcePartners() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const submit = () => { if (pw.toUpperCase() === PASSCODE) setAuthed(true); else setError(true) }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <p className="font-mono text-[10px] tracking-[0.4em] mb-6" style={{ color: '#5a9fc4' }}>CITYAGE MEDIA</p>
          <h1 className="font-display text-4xl font-semibold mb-2" style={{ color: '#e6eef5' }}>Space to Ice</h1>
          <p className="text-sm mb-10" style={{ color: '#5a7a96' }}>Partnership materials — authorized access only</p>
          <div className="flex gap-2">
            <input type="password" value={pw} onChange={e => { setPw(e.target.value); setError(false) }} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Access code" className="flex-1 px-4 py-3 rounded-sm text-sm text-white outline-none" style={{ background: 'rgba(90,160,196,0.06)', border: `1px solid ${error ? '#c25050' : 'rgba(90,160,196,0.2)'}` }} />
            <button onClick={submit} className="px-6 py-3 rounded-sm text-sm font-semibold tracking-wide cursor-pointer" style={{ background: '#5a9fc4', color: '#040a14' }}>Enter</button>
          </div>
          {error && <p className="text-sm mt-3" style={{ color: '#c25050' }}>Invalid access code</p>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(4,10,20,0.3) 0%, rgba(4,10,20,0.85) 50%, #040a14 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.4' fill='rgba(90,160,196,0.06)'/%3E%3C/svg%3E\")", opacity: 0.5, zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 800 }}>
          <Reveal><p className="font-mono" style={{ fontSize: 10, letterSpacing: '0.5em', color: '#5a9fc4', marginBottom: 40, textTransform: 'uppercase' }}>A CityAge Intelligence Event · Ottawa · Fall 2026</p></Reveal>
          <Reveal delay={0.2}><h1 className="font-display" style={{ fontSize: 'clamp(56px, 9vw, 110px)', fontWeight: 700, color: '#e6eef5', lineHeight: 0.95, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Space<br />to Ice</h1></Reveal>
          <Reveal delay={0.4}><div style={{ width: 60, height: 1, margin: '0 auto 28px', background: 'linear-gradient(90deg, transparent, #5a9fc4, transparent)' }} /></Reveal>
          <Reveal delay={0.5}><p className="font-serif" style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', color: '#a8cce0', lineHeight: 1.55, maxWidth: 540, margin: '0 auto', fontStyle: 'italic' }}>Arctic sovereignty. Northern infrastructure.<br />The space economy above Canada&apos;s North.</p></Reveal>
        </div>
      </section>

      {/* EDITORIAL LEDE */}
      <section style={{ padding: '6rem 2rem', maxWidth: 680, margin: '0 auto' }}>
        <Reveal><p className="font-serif" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#d4e6f2', lineHeight: 1.75, margin: 0 }}><span style={{ fontWeight: 700, color: '#e6eef5' }}>Canada controls the world&apos;s longest Arctic coastline,</span> the Northwest Passage, and critical mineral reserves that will define the next century of allied security. The question is no longer whether the Arctic matters — it&apos;s who will lead there.</p></Reveal>
        <Reveal delay={0.15}><p className="font-serif" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#8aabbf', lineHeight: 1.75, marginTop: 28 }}>Space to Ice is a CityAge intelligence event that brings together 80 leaders — from federal defence to satellite companies to territorial premiers — under Chatham House rules for a single day of focused conversation about Canada&apos;s northern future.</p></Reveal>
      </section>

      {/* STATS */}
      <section style={{ padding: '5rem 2rem', borderTop: '1px solid rgba(90,160,196,0.08)', borderBottom: '1px solid rgba(90,160,196,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem' }}>
          {[{ n: '162,000', u: 'km', l: 'Arctic coastline' },{ n: '$125', u: 'B+', l: 'Critical minerals in play' },{ n: '3', u: '', l: 'Oceans touching Canada' },{ n: '40', u: '%', l: 'Of Canada\u2019s landmass' }].map((s, i) => (
            <Reveal key={i} delay={i * 0.1}><div style={{ textAlign: 'center', minWidth: 140 }}>
              <p className="font-display" style={{ fontSize: 48, fontWeight: 700, color: '#e6eef5', margin: 0, lineHeight: 1 }}>{s.n}<span style={{ fontSize: 24, color: '#5a9fc4', fontWeight: 400 }}>{s.u}</span></p>
              <p className="font-mono" style={{ fontSize: 10, letterSpacing: '0.15em', color: '#5a7a96', marginTop: 8, textTransform: 'uppercase' }}>{s.l}</p>
            </div></Reveal>
          ))}
        </div>
      </section>

      {/* GLOBE + CONVERSATION */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem' }}>
          <div style={{ flex: '1 1 340px', minWidth: 300 }}><Reveal><ArcticGlobe /></Reveal></div>
          <div style={{ flex: '1 1 340px', minWidth: 280 }}>
            <Reveal>
              <p className="font-mono" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#5a9fc4', textTransform: 'uppercase', marginBottom: 16 }}>The Conversation</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 600, color: '#e6eef5', lineHeight: 1.15, margin: '0 0 20px' }}>Six vectors of<br />northern power</h2>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['01','Defence & Sovereignty'],['02','Critical Minerals'],['03','Space & Earth Observation'],['04','Northern Infrastructure'],['05','Telecommunications'],['06','Indigenous Partnership']].map(([num, title], i) => (
                <Reveal key={i} delay={i * 0.06}><div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span className="font-mono" style={{ fontSize: 11, color: '#5a9fc4', letterSpacing: '0.1em', flexShrink: 0 }}>{num}</span>
                  <span className="font-serif" style={{ fontSize: 16, color: '#d4e6f2' }}>{title}</span>
                </div></Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Rule />

      {/* THE ROOM */}
      <section style={{ padding: '2rem 2rem 6rem', maxWidth: 680, margin: '0 auto' }}>
        <Reveal>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#5a9fc4', textTransform: 'uppercase', marginBottom: 16 }}>The Room</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: '#e6eef5', lineHeight: 1.1, margin: '0 0 24px' }}>80 leaders.<br />Chatham House rules.</h2>
          <p className="font-serif" style={{ fontSize: 18, color: '#8aabbf', lineHeight: 1.7, margin: '0 0 32px' }}>No media. No slides. No prepared remarks. Space to Ice is a single day of focused conversation among the people who are actually making decisions about Canada&apos;s northern future — from NORAD modernization to critical mineral supply chains to the satellite constellations that make sovereignty enforceable.</p>
        </Reveal>
        <Reveal delay={0.1}><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Federal Defence','Northern Affairs','NORAD / NATO','Space Agencies','Critical Mineral Operators','Indigenous Leaders','Territorial Premiers','Nordic Embassies','Satellite Companies','Infrastructure Investors','Arctic Researchers','Telecom Providers'].map((tag, i) => (
            <span key={i} className="font-mono" style={{ padding: '6px 14px', fontSize: 10, letterSpacing: '0.08em', border: '1px solid rgba(90,160,196,0.15)', color: '#a8cce0', background: 'rgba(90,160,196,0.04)' }}>{tag}</span>
          ))}
        </div></Reveal>
      </section>

      {/* PHOTO ZONE */}
      <section style={{ height: '55vh', minHeight: 400, position: 'relative', background: 'linear-gradient(135deg, #081828 0%, #0c2240 50%, #081828 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(90,160,196,0.06)', borderBottom: '1px solid rgba(90,160,196,0.06)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='rgba(90,160,196,0.03)'/%3E%3C/svg%3E\")" }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '2rem' }}>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#5a7a96', textTransform: 'uppercase', marginBottom: 12 }}>Photo · Arctic Landscape</p>
          <p className="font-display" style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 600, color: '#5a7a96', fontStyle: 'italic', margin: 0 }}>NASA / Arctic imagery here</p>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section style={{ padding: '6rem 2rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <Reveal>
          <div style={{ width: 40, height: 1, background: '#5a9fc4', margin: '0 auto 32px' }} />
          <p className="font-display" style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 400, color: '#d4e6f2', lineHeight: 1.5, fontStyle: 'italic', margin: '0 0 24px' }}>&ldquo;Canada&apos;s northern future will be decided in rooms like this one. The question is whether Canadian leaders will shape that future, or watch while others do.&rdquo;</p>
          <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#5a7a96', margin: '0 0 4px' }}>Miro Cernetig</p>
          <p style={{ fontSize: 13, color: '#5a7a96' }}>Founder &amp; CEO, CityAge Media</p>
          <p style={{ fontSize: 12, color: '#4a6a7f', marginTop: 4 }}>Michener Award-winning journalist · Former Globe and Mail Arctic correspondent</p>
          <div style={{ width: 40, height: 1, background: '#5a9fc4', margin: '32px auto 0' }} />
        </Reveal>
      </section>

      <Rule />

      {/* TIERS */}
      <section style={{ padding: '2rem 2rem 6rem', maxWidth: 880, margin: '0 auto' }}>
        <Reveal>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#5a9fc4', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>Partnership</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 600, color: '#e6eef5', lineHeight: 1.15, margin: '0 0 16px', textAlign: 'center' }}>Knowledge Partner Tiers</h2>
          <p className="font-serif" style={{ fontSize: 16, color: '#8aabbf', lineHeight: 1.65, textAlign: 'center', maxWidth: 520, margin: '0 auto 48px' }}>Space to Ice is sponsor-funded. No ticket sales. Your partnership underwrites the room and positions your organization at the centre of the Arctic conversation.</p>
        </Reveal>
        <Reveal delay={0.1}><div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
          {[
            { name: 'Strategic', price: '$15,000', color: '#5a9fc4', features: ['Naming presence throughout','4 delegate seats','Private briefing with CityAge','Logo on all materials','Post-event intelligence report'] },
            { name: 'Presenting', price: '$7,500', color: '#6db89a', features: ['Session naming rights','2 delegate seats','Logo placement','Event photography package','Intelligence report access'] },
            { name: 'Supporting', price: '$5,000', color: '#a8cce0', features: ['1 delegate seat','Logo on event materials','Pre-event networking access','Intelligence report access'] },
          ].map((tier, i) => (
            <div key={i} style={{ flex: '1 1 230px', minWidth: 220, padding: '2.5rem 2rem', textAlign: 'center', background: 'rgba(8,18,34,0.6)', border: '1px solid rgba(90,160,196,0.08)', borderTop: `2px solid ${tier.color}` }}>
              <p className="font-mono" style={{ fontSize: 10, letterSpacing: '0.25em', color: tier.color, textTransform: 'uppercase', marginBottom: 12 }}>{tier.name}</p>
              <p className="font-display" style={{ fontSize: 36, fontWeight: 600, color: '#e6eef5', margin: '0 0 24px' }}>{tier.price}</p>
              {tier.features.map((f, j) => <p key={j} className="font-serif" style={{ fontSize: 13, color: '#8aabbf', margin: '8px 0', lineHeight: 1.5 }}>{f}</p>)}
            </div>
          ))}
        </div></Reveal>
      </section>

      <Rule />

      {/* CREDENTIALS */}
      <section style={{ padding: '2rem 2rem', maxWidth: 680, margin: '0 auto' }}>
        <Reveal>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#5a9fc4', textTransform: 'uppercase', marginBottom: 16 }}>Credentials</p>
          <p className="font-serif" style={{ fontSize: 18, color: '#d4e6f2', lineHeight: 1.7, margin: 0 }}>CityAge has convened <span style={{ color: '#e6eef5', fontWeight: 700 }}>100+ events</span> across <span style={{ color: '#e6eef5', fontWeight: 700 }}>50+ cities</span>, bringing together <span style={{ color: '#e6eef5', fontWeight: 700 }}>25,000+ decision-makers</span> at the intersection of infrastructure, technology, and policy. Space to Ice grows from CityAge&apos;s Arctic roots — and from 15 years of building rooms where the right people have the right conversations.</p>
        </Reveal>
      </section>

      <Rule />

      {/* CONTACT */}
      <section style={{ padding: '2rem 2rem 8rem', textAlign: 'center' }}>
        <Reveal>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#5a9fc4', textTransform: 'uppercase', marginBottom: 16 }}>Next Step</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 600, color: '#e6eef5', lineHeight: 1.15, margin: '0 0 20px' }}>Join the conversation</h2>
          <p className="font-serif" style={{ fontSize: 16, color: '#8aabbf', lineHeight: 1.65, maxWidth: 440, margin: '0 auto 32px' }}>Partnerships are limited and by invitation. Contact us to discuss how your organization can be part of the Arctic&apos;s defining conversation.</p>
          <a href="mailto:miro@cityage.com?subject=Space%20to%20Ice%20Partnership%20Inquiry" style={{ display: 'inline-block', padding: '14px 40px', border: '1px solid #5a9fc4', color: '#e6eef5', fontSize: 13, fontWeight: 500, letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>miro@cityage.com</a>
        </Reveal>
      </section>

      <footer style={{ borderTop: '1px solid rgba(90,160,196,0.06)', padding: '2rem', textAlign: 'center' }}>
        <p className="font-mono" style={{ fontSize: 10, letterSpacing: '0.15em', color: '#4a6a7f', margin: '0 0 4px' }}>CITYAGE MEDIA — VANCOUVER · OTTAWA</p>
        <p className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3a5a6f', margin: 0 }}>© 2026 CITYAGE MEDIA INC. · CONFIDENTIAL · DO NOT DISTRIBUTE</p>
      </footer>
    </div>
  )
}
