'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'

const PASSCODE = 'VANCOUVER2026'

const CREAM = '#FAF6EE'
const INK = '#0A0908'
const TEXT = '#2A2520'
const DIM = 'rgba(42,37,32,0.6)'
const CEDAR = '#3E7C74'
const CEDAR_DIM = 'rgba(62,124,116,0.3)'

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

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="nv-mono" style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: CEDAR, marginBottom: 20 }}>{children}</p>
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="nv-display" style={{ fontSize: 'clamp(34px, 4.5vw, 52px)', fontWeight: 400, color: INK, lineHeight: 1.05, margin: '0 0 28px', letterSpacing: '-0.01em' }}>{children}</h2>
}

function Body({ children, lead = false }: { children: ReactNode; lead?: boolean }) {
  return <p style={{ fontSize: lead ? 19 : 16, lineHeight: 1.75, color: lead ? TEXT : 'rgba(42,37,32,0.8)', fontWeight: 300, margin: '0 0 20px' }}>{children}</p>
}

function Rule() {
  return <div style={{ maxWidth: 120, margin: '0 auto', padding: '4.5rem 0' }}><div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${CEDAR_DIM}, transparent)` }} /></div>
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 12px' }}>
      <div className="nv-display" style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 300, color: CEDAR, lineHeight: 1 }}>{value}</div>
      <div className="nv-mono" style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: DIM, marginTop: 10, lineHeight: 1.6 }}>{label}</div>
    </div>
  )
}

const QUESTIONS = [
  { n: '1', t: 'The power question', b: "AI runs on electricity, and BC's hydro is among the cleanest on Earth. Can the grid host the data centres and compute the industry needs — and should it? The utility, the regulators and the builders, at one table." },
  { n: '2', t: 'The talent question', b: "UBC and SFU produce the researchers; the VFX, gaming and animation studios have built the deepest digital talent pool in Canada; immigration policy admits the engineers others turn away. How does the region keep that talent from boarding flights to Seattle and San Francisco?" },
  { n: '3', t: 'The capital question', b: "Research without anchor investment stays research. What it takes to land the flagship labs, the institutional capital and the first decisive bets — and what the region must offer to win them." },
  { n: '4', t: 'The application question', b: "Vancouver's fastest path may not be building frontier models but applying AI to what the region already does at world scale: the port and its supply chains, the resource economy, film and media, life sciences. The companies doing it now, and what they need next." },
  { n: '5', t: 'The wildfire question', b: "British Columbia's fire seasons now set the terms for entire summers. AI prediction models, satellite and sensor detection, and machine-directed response are moving from research to the front line — and no jurisdiction has more reason, or more terrain, to lead. Can BC become the proving ground that builds the wildfire technology the world will need?" },
  { n: '6', t: 'The position question', b: "Between Seattle's giants and Asia's markets, on the Cascadia corridor, in the time zone of the Pacific century: how Vancouver turns geography into strategy — partner to the giants without becoming their branch plant." },
]

export default function NextVancouverPartners() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const submit = () => { if (pw.toUpperCase() === PASSCODE) setAuthed(true); else setError(true) }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: '0 24px' }}>
          <p className="nv-mono" style={{ fontSize: 10, letterSpacing: '0.4em', marginBottom: 24, color: CEDAR }}>CITYAGE · URBAN PLANET SERIES</p>
          <h1 className="nv-display" style={{ fontSize: 36, fontWeight: 400, marginBottom: 8, color: INK, lineHeight: 1.1 }}>The Next Metro Vancouver<br /><em style={{ color: CEDAR }}>The AI Edition</em></h1>
          <p style={{ fontSize: 14, marginBottom: 40, color: DIM }}>Partner prospectus — authorized access only</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Access code"
              aria-label="Access code"
              style={{ flex: 1, padding: '12px 16px', borderRadius: 2, fontSize: 14, color: INK, outline: 'none', background: '#fff', border: `1px solid ${error ? '#B0524A' : CEDAR_DIM}` }}
            />
            <button onClick={submit} style={{ padding: '12px 26px', borderRadius: 2, fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', cursor: 'pointer', background: CEDAR, color: CREAM, border: 'none' }}>Enter</button>
          </div>
          {error && <p style={{ fontSize: 13, marginTop: 12, color: '#B0524A' }}>Invalid access code</p>}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem', position: 'relative', borderBottom: `1px solid rgba(42,37,32,0.1)` }}>
        <div style={{ textAlign: 'center', maxWidth: 860 }}>
          <Reveal><p className="nv-mono" style={{ fontSize: 10, letterSpacing: '0.5em', color: CEDAR, marginBottom: 36, textTransform: 'uppercase' }}>Partner Prospectus · 2026 · An Urban Planet Convening</p></Reveal>
          <Reveal delay={0.2}><h1 className="nv-display" style={{ fontSize: 'clamp(48px, 8vw, 102px)', fontWeight: 400, color: INK, lineHeight: 0.98, margin: '0 0 16px', letterSpacing: '-0.02em' }}>The Next<br />Metro Vancouver<span style={{ color: CEDAR }}>.</span></h1></Reveal>
          <Reveal delay={0.35}><p className="nv-display" style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontStyle: 'italic', fontWeight: 300, color: CEDAR, margin: '0 0 28px' }}>The AI Edition</p></Reveal>
          <Reveal delay={0.5}><div style={{ width: 60, height: 1, margin: '0 auto 30px', background: `linear-gradient(90deg, transparent, ${CEDAR}, transparent)` }} /></Reveal>
          <Reveal delay={0.6}><p className="nv-display" style={{ fontSize: 'clamp(18px, 2.2vw, 23px)', fontStyle: 'italic', fontWeight: 300, color: TEXT, lineHeight: 1.55, maxWidth: 600, margin: '0 auto' }}>Every city wants to be an AI city. Vancouver has the intrinsic assets — this is where leaders are making British Columbia&apos;s AI future happen.</p></Reveal>
          <Reveal delay={0.75}>
            <div className="nv-mono" style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap', marginTop: 48, fontSize: 10, letterSpacing: '0.25em', color: DIM }}>
              <span>49°17′N — PACIFIC GATEWAY</span><span>AUTUMN 2026</span><span>VANCOUVER, BRITISH COLUMBIA</span>
            </div>
          </Reveal>
        </div>
      </section>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>

        {/* ── I · PREMISE ── */}
        <section>
          <Reveal>
            <Eyebrow>I · The Premise</Eyebrow>
            <SectionTitle>The assets are intrinsic. The decision isn&apos;t.</SectionTitle>
            <Body lead>In the AI economy, the scarce inputs are clean power, deep talent, trusted institutions and a place people want to live. Vancouver has all four. What it doesn&apos;t yet have is the decision to use them.</Body>
            <Body>The AI build-out is the largest infrastructure race of the era, and it runs on things that cannot be conjured: abundant clean electricity, cool climates, research universities, global talent pipelines, and the quality of life that makes that talent stay. These are not policies. They are endowments — and Metro Vancouver holds a remarkable concentration of them.</Body>
            <Body>Hydroelectric power among the cleanest on the continent. A research bench at UBC and SFU with decades of machine-learning pedigree. The deepest visual-effects, animation and gaming talent pool in the country. An immigration system that admits the engineers other jurisdictions turn away. And the Pacific position: the gateway between North American compute and Asian markets.</Body>
            <Body>What the region lacks is not raw material but conversion: the anchor investments, the policy clarity, and the shared ambition to turn an enviable position into a defining industry. Toronto claimed the research crown. Seattle and the Bay Area claimed the capital. Vancouver&apos;s window to claim its own seat is open — and windows like this one do not stay open.</Body>
            <Body>The Next Metro Vancouver: The AI Edition convenes the people who can make the conversion — the premiers and mayors, the utility and port executives, the founders, the chairs of the research bench, the institutional capital — for one editorially curated afternoon under the Urban Planet thesis: consequential decisions are made in cities, and this one is due.</Body>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginTop: 56, padding: '40px 0', borderTop: `1px solid rgba(42,37,32,0.12)`, borderBottom: `1px solid rgba(42,37,32,0.12)` }}>
              <Stat value="15" label="Years convening decision-makers" />
              <Stat value="100+" label="CityAge events across North America" />
              <Stat value="25,000" label="Verified decision-makers in the network" />
            </div>
          </Reveal>
        </section>

        <Rule />

        {/* ── II · AGENDA ── */}
        <section>
          <Reveal>
            <Eyebrow>II · The Agenda</Eyebrow>
            <SectionTitle>Six questions, one afternoon.</SectionTitle>
            <Body lead>The program is editorially curated — built like a magazine issue, not a trade show. Six questions that decide whether Vancouver becomes an AI city, each examined in a moderated fireside with the people closest to the answer.</Body>
          </Reveal>
          {QUESTIONS.map((q, i) => (
            <Reveal key={q.n} delay={i * 0.08}>
              <div style={{ display: 'flex', gap: 24, marginTop: 38, paddingTop: 30, borderTop: '1px solid rgba(42,37,32,0.1)' }}>
                <div className="nv-display" style={{ fontSize: 48, fontWeight: 300, color: CEDAR, lineHeight: 1, minWidth: 40 }}>{q.n}</div>
                <div>
                  <h3 className="nv-display" style={{ fontSize: 25, fontWeight: 500, color: INK, margin: '0 0 12px' }}>{q.t}</h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'rgba(42,37,32,0.8)', fontWeight: 300, margin: 0 }}>{q.b}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        <Rule />

        {/* ── III · THE ROOM ── */}
        <section>
          <Reveal>
            <Eyebrow>III · The Room</Eyebrow>
            <SectionTitle>Curated by editors, not underwriters.</SectionTitle>
            <Body lead>The Next Metro Vancouver is invitation-led. Seats are curated the way a correspondent builds a source list: for what each person knows, decides or controls — never for what they paid. The room is assembled from five constituencies:</Body>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
              {[
                { t: 'Government', b: 'Provincial ministers, mayors and senior officials with files in technology, energy, trade and immigration.' },
                { t: 'Founders & Operators', b: 'The AI founders building here, and the studio, gaming and life-science operators who employ the region\u2019s digital talent at scale.' },
                { t: 'Power & Infrastructure', b: 'The utility, the port, the data-centre builders and the infrastructure investors who decide what physically gets built.' },
                { t: 'Capital', b: 'Venture, pension and institutional investors weighing the region — including the ones who haven\u2019t committed yet.' },
                { t: 'The Research Bench', b: 'University leadership and the machine-learning researchers whose work the whole thesis rests on.' },
              ].map(c => (
                <div key={c.t} style={{ padding: '18px 22px', background: '#F2EDE2', borderLeft: `2px solid ${CEDAR}` }}>
                  <div className="nv-display" style={{ fontSize: 20, fontWeight: 500, color: INK }}>{c.t}</div>
                  <div style={{ fontSize: 14.5, lineHeight: 1.65, color: 'rgba(42,37,32,0.75)', fontWeight: 300, marginTop: 6 }}>{c.b}</div>
                </div>
              ))}
            </div>
            <p className="nv-mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: DIM, marginTop: 28, lineHeight: 1.8 }}>Names and program to be announced through autumn 2026, drawn from the speaker bench of fifteen years of CityAge convenings in this region.</p>
          </Reveal>
        </section>

        <Rule />

        {/* ── IV · PARTNERSHIP ── */}
        <section>
          <Reveal>
            <Eyebrow>IV · The Partnership</Eyebrow>
            <SectionTitle>What a partner actually gets.</SectionTitle>
            <Body lead>Partnerships are limited by design — a small number per convening, each aligned with one of the six questions. Partners shape the questions on the table. They do not buy the answers.</Body>
          </Reveal>
          {[
            { k: 'Tier 01 · One per event', t: 'Title Partner', b: 'Your name on the convening itself. First position in all editorial and campaign material, a seat in the program\u2019s framing conversation, a private pre-event dinner with speakers, and a curated introduction list built from the room. The title partner is in the story, not beside it.' },
            { k: 'Tier 02 · One per question', t: 'Knowledge Partner', b: 'Ownership of one of the six questions: input on its framing, a voice in its fireside, and the post-event intelligence brief carrying your name to the full CityAge network.' },
            { k: 'Tier 03 · The premium instrument', t: 'Micro-Network', b: 'The most concentrated product CityAge makes: eight to twelve principals, personally curated by the publisher around your single objective, convened privately alongside the main event. No stage, no audience — just the right table.' },
          ].map((t, i) => (
            <Reveal key={t.t} delay={i * 0.1}>
              <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(42,37,32,0.1)' }}>
                <p className="nv-mono" style={{ fontSize: 9.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: CEDAR, margin: '0 0 8px' }}>{t.k}</p>
                <h3 className="nv-display" style={{ fontSize: 27, fontWeight: 500, color: INK, margin: '0 0 10px' }}>{t.t}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'rgba(42,37,32,0.8)', fontWeight: 300, margin: 0 }}>{t.b}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <Body><span style={{ display: 'block', marginTop: 40 }}>Every tier includes presence in the event&apos;s editorial coverage and the post-event brief distributed to CityAge&apos;s network of 25,000 verified decision-makers. The partnership schedule, with investment levels, is available on request.</span></Body>
          </Reveal>
        </section>

        <Rule />

        {/* ── V · CONVENER ── */}
        <section>
          <Reveal>
            <Eyebrow>V · The Convener</Eyebrow>
            <SectionTitle>Why this room holds.</SectionTitle>
            <Body lead>Convening authority cannot be bought; it is earned over time, in print and in person. The Next Metro Vancouver is led by CityAge founder Miro Cernetig, whose three decades in journalism are the platform&apos;s credibility anchor — including years covering this city and this coast.</Body>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
              {[
                { w: 'Bureau Chief, The Globe and Mail', h: 'Beijing · New York · The Arctic · Vancouver' },
                { w: 'Michener Award', h: 'Canada\u2019s highest honour for public-service journalism' },
                { w: 'Coverage spanning Gorbachev to Thatcher', h: 'Decades reporting on the people who run the world' },
              ].map(c => (
                <div key={c.w} style={{ padding: '16px 20px', background: '#F2EDE2', borderLeft: `2px solid ${CEDAR}` }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: INK }}>{c.w}</div>
                  <div className="nv-mono" style={{ fontSize: 11, color: DIM, marginTop: 4, letterSpacing: '0.06em' }}>{c.h}</div>
                </div>
              ))}
            </div>
            <Body><span style={{ display: 'block', marginTop: 32 }}>That record is reinforced by fifteen years of CityAge convenings: more than one hundred events across North America, a verified network of twenty-five thousand decision-makers, and a 2026 Ottawa summit that put ambassadors, military commanders and northern leaders on the same stage.</span></Body>
            <Body>Vancouver is where CityAge lives. This convening is the company&apos;s home game — programmed with the institutional memory of fifteen years of rooms in this region.</Body>
            <p className="nv-display" style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 300, color: TEXT, lineHeight: 1.6, margin: '36px 0 0', paddingLeft: 22, borderLeft: `2px solid ${CEDAR}` }}>&ldquo;The room is curated by editors, not underwriters — that is the entire value of the room.&rdquo;</p>
          </Reveal>
        </section>

        <Rule />

        {/* ── VI · INVITATION ── */}
        <section style={{ textAlign: 'center' }}>
          <Reveal>
            <Eyebrow>VI · The Invitation</Eyebrow>
            <h2 className="nv-display" style={{ fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 400, color: INK, lineHeight: 1.15, margin: '0 0 28px' }}>The AI century needs cities.<br /><em style={{ color: CEDAR }}>This one is deciding whether to show up.</em></h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(42,37,32,0.8)', fontWeight: 300, maxWidth: 560, margin: '0 auto 48px' }}>Title and knowledge partnerships for The Next Metro Vancouver: The AI Edition are being placed now, in conversation with a short list of organizations whose work aligns with the six questions. The first conversation is thirty minutes with the publisher.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, maxWidth: 640, margin: '0 auto 56px' }}>
              {[
                { t: 'Autumn', s: '2026 · Vancouver' },
                { t: '6', s: 'Questions · Editorially Curated' },
                { t: '1', s: 'Title Partnership Available' },
              ].map(x => (
                <div key={x.s} style={{ padding: '22px 16px', border: `1px solid rgba(42,37,32,0.15)` }}>
                  <div className="nv-display" style={{ fontSize: 26, fontWeight: 500, color: INK }}>{x.t}</div>
                  <div className="nv-mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginTop: 8, lineHeight: 1.6 }}>{x.s}</div>
                </div>
              ))}
            </div>
            <a href="mailto:miro@cityage.com?subject=The%20Next%20Metro%20Vancouver%20Partnership" style={{ display: 'inline-block', padding: '15px 42px', background: INK, color: CREAM, fontSize: 14, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>Start the conversation</a>
          </Reveal>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid rgba(42,37,32,0.12)', padding: '40px 1.5rem', textAlign: 'center' }}>
        <p className="nv-mono" style={{ fontSize: 10, letterSpacing: '0.25em', color: DIM, lineHeight: 2.2, textTransform: 'uppercase' }}>
          Miro Cernetig · CEO &amp; Publisher, CityAge · miro@cityage.com<br />
          CityAge · An Urban Planet Convening · © 2026 CityAge Media
        </p>
      </footer>
    </div>
  )
}
