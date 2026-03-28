'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Dubai coordinates for sunrise calc
const DUBAI_LAT = 25.2048
const DUBAI_LON = 55.2708

function getSunrise(date: Date, lat: number, lon: number): Date {
  const rad = Math.PI / 180
  const d = date.getUTCDate() + (date.getUTCMonth() + 1) * 30.44 + date.getUTCFullYear() * 365.25
  const n = Math.round(d - 2451545 - 0.0009 - lon / 360)
  const solarNoon = 2451545 + 0.0009 + lon / 360 + n
  const m = (357.5291 + 0.98560028 * (solarNoon - 2451545)) % 360
  const c = 1.9148 * Math.sin(m * rad) + 0.0200 * Math.sin(2 * m * rad) + 0.0003 * Math.sin(3 * m * rad)
  const lam = (m + c + 180 + 102.9372) % 360
  const jTransit = solarNoon + 0.0053 * Math.sin(m * rad) - 0.0069 * Math.sin(2 * lam * rad)
  const decl = Math.asin(Math.sin(lam * rad) * Math.sin(23.4397 * rad))
  const h0 = -0.0833
  const cosH = (Math.sin(h0 * rad) - Math.sin(lat * rad) * Math.sin(decl)) / (Math.cos(lat * rad) * Math.cos(decl))
  if (cosH < -1 || cosH > 1) return new Date(jTransit * 86400000)
  const h = Math.acos(cosH) / rad
  const jRise = jTransit - h / 360
  // Convert Julian to JS date
  const msRise = (jRise - 2440587.5) * 86400000
  return new Date(msRise)
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^# .+$/gm, '')
    .replace(/^\*(?!\*).*(?<!\*)\*$/gm, '')
    .replace(/^## Before Sunrise$/gm, '<h2 class="section-gold">Before Sunrise</h2>')
    .replace(/^## The Lead$/gm, '<h2 class="section-dim">The Lead</h2>')
    .replace(/^## The Market$/gm, '<h2 class="section-dim">The Market</h2>')
    .replace(/^## The Table$/gm, '<h2 class="section-dim">The Table</h2>')
    .replace(/^## The Life$/gm, '<h2 class="section-dim">The Life</h2>')
    .replace(/^## The Number$/gm, '<h2 class="section-gold">The Number</h2>')
    .replace(/^## (.+)$/gm, '<h2 class="section-dim">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="story-hed">$1</h3>')
    .replace(/^---$/gm, '<hr class="divider" />')
    .replace(/^\*\*(.+?)\*\*$/gm, '<p class="market-lead">$1</p>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="source-link">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^(?!<)(.*\S.*)$/gm, '<p class="body">$1</p>')
}

export default function DaybreakDubaiPage() {
  const [brief, setBrief] = useState<any>(null)
  const [archive, setArchive] = useState<any[]>([])
  const [heroImage, setHeroImage] = useState<{url:string,credit:string,creditUrl:string}|null>(null)
  const [sunriseText, setSunriseText] = useState('')
  const [dubaiTime, setDubaiTime] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [answering, setAnswering] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Load brief
    async function load() {
      const { data: latest } = await supabase
        .from('briefs')
        .select('id, title, body, published_at')
        .eq('vertical', 'Daybreak Dubai')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1)
        .single()
      setBrief(latest)

      const { data: arc } = await supabase
        .from('briefs')
        .select('id, title, published_at')
        .eq('vertical', 'Daybreak Dubai')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(20)
      setArchive(arc || [])

      // Fetch Unsplash hero
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=Dubai+skyline+luxury+architecture&per_page=5&orientation=landscape&content_filter=high`,
          { headers: { 'Authorization': 'Client-ID AadZIJdXXBV5p9Dm989wFElgbQiZLJmTClSELMZrf18' } }
        )
        if (res.ok) {
          const data = await res.json()
          const photos = data.results
          if (photos?.length) {
            const photo = photos[Math.floor(Math.random() * Math.min(3, photos.length))]
            setHeroImage({
              url: photo.urls.full,
              credit: `Photo by ${photo.user.name}`,
              creditUrl: `${photo.user.links.html}?utm_source=cityage&utm_medium=referral`
            })
          }
        }
      } catch {}

      setLoaded(true)
    }
    load()

    // Live clock + sunrise
    function tick() {
      const now = new Date()
      const time = now.toLocaleString('en-US', {
        timeZone: 'Asia/Dubai', hour: 'numeric', minute: '2-digit', hour12: true
      })
      setDubaiTime(time)

      const sunrise = getSunrise(now, DUBAI_LAT, DUBAI_LON)
      // Adjust to Dubai time (UTC+4)
      const dubaiOffset = 4 * 60 * 60 * 1000
      const nowDubai = now.getTime() + dubaiOffset
      const sunriseDubai = sunrise.getTime() + dubaiOffset
      const diffMs = nowDubai - sunriseDubai
      const diffMin = Math.round(diffMs / 60000)

      if (diffMin >= 0 && diffMin < 720) {
        if (diffMin < 60) setSunriseText(`Sunrise was ${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`)
        else {
          const h = Math.floor(diffMin / 60)
          const m = diffMin % 60
          setSunriseText(`Sunrise was ${h}h ${m}m ago`)
        }
      } else {
        const nextSunrise = new Date(sunrise.getTime() + 86400000)
        const toNext = Math.round((nextSunrise.getTime() + dubaiOffset - nowDubai) / 60000)
        const h = Math.floor(toNext / 60)
        const m = toNext % 60
        setSunriseText(`Next sunrise in ${h}h ${m}m`)
      }
    }
    tick()
    const timer = setInterval(tick, 30000)
    return () => clearInterval(timer)
  }, [])

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || answering) return
    setAnswering(true)
    setAnswer('')
    try {
      const res = await fetch('/api/dubai-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await res.json()
      setAnswer(data.answer || 'No answer found.')
    } catch {
      setAnswer('Something went wrong. Try again.')
    }
    setAnswering(false)
  }

  const briefDate = brief
    ? new Date(brief.published_at).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Dubai'
      })
    : ''

  const cleanedBody = brief?.body
    ?.split('\n')
    .filter((l: string) => {
      const t = l.trim()
      if (t.startsWith('# Daybreak Dubai')) return false
      if (t.startsWith('*') && t.endsWith('*') && t.includes('Dubai') && t.includes('202')) return false
      return true
    })
    .join('\n') || ''

  const html = brief ? renderMarkdown(cleanedBody) : ''

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8F6F1; }

        /* Hero */
        .hero {
          position: relative;
          width: 100%;
          height: 90vh;
          min-height: 600px;
          overflow: hidden;
          background: #111;
        }
        .hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.65;
          transition: opacity 1s ease;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%);
        }
        .hero-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .hero-back {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }
        .hero-back:hover { color: #C5A059; }
        .hero-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .hero-subscribe {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #000;
          background: #C5A059;
          padding: 0.4rem 1.2rem;
          text-decoration: none;
          transition: background 0.2s;
        }
        .hero-subscribe:hover { background: #fff; }
        .hero-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 3rem 2rem 2.5rem;
          text-align: center;
        }
        .hero-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #C5A059;
          margin-bottom: 1rem;
        }
        .hero-title {
          font-family: 'Playfair Display', 'Times New Roman', serif;
          font-size: clamp(4rem, 12vw, 9rem);
          font-weight: 900;
          line-height: 0.88;
          letter-spacing: -0.02em;
          color: #fff;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .hero-beats {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 1.25rem;
        }
        .hero-sunrise {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0.4rem 1rem;
        }
        .hero-credit {
          position: absolute;
          bottom: 1rem; right: 1.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
        }
        .hero-credit:hover { color: rgba(255,255,255,0.6); }

        /* Date bar */
        .date-bar {
          background: #0a0a0a;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .date-bar-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .date-bar-edition {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #C5A059;
        }

        /* Ask bar */
        .ask-bar {
          background: #fff;
          border-bottom: 2px solid #000;
          padding: 1rem 2rem;
        }
        .ask-form {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          gap: 0;
        }
        .ask-input {
          flex: 1;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.05em;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(0,0,0,0.15);
          border-right: none;
          background: #F8F6F1;
          color: #000;
          outline: none;
          transition: border-color 0.2s;
        }
        .ask-input:focus { border-color: #C5A059; }
        .ask-input::placeholder { color: rgba(0,0,0,0.3); }
        .ask-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.75rem 1.5rem;
          background: #000;
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .ask-btn:hover { background: #C5A059; color: #000; }
        .ask-answer {
          max-width: 680px;
          margin: 1rem auto 0;
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(0,0,0,0.7);
          padding: 1rem;
          background: #f0ede6;
          border-left: 3px solid #C5A059;
        }

        /* Article */
        .article-wrap {
          max-width: 680px;
          margin: 0 auto;
          padding: 3rem 2rem 4rem;
        }
        .section-gold {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #C5A059;
          margin-top: 3.5rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .section-dim {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.35);
          margin-top: 3.5rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .story-hed {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 4vw, 30px);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.01em;
          color: #000;
          margin-top: 1.25rem;
          margin-bottom: 1.25rem;
        }
        .body {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 17px;
          line-height: 1.85;
          color: rgba(0,0,0,0.78);
          margin-bottom: 1.25rem;
        }
        .market-lead {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.5;
          color: #000;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .source-link {
          color: #000;
          text-decoration: underline;
          text-decoration-color: #C5A059;
          text-decoration-thickness: 1.5px;
          text-underline-offset: 3px;
          transition: text-decoration-color 0.2s;
        }
        .source-link:hover { text-decoration-color: #000; }
        .divider {
          border: none;
          border-top: 1px solid rgba(0,0,0,0.08);
          margin: 2.5rem 0;
        }
        strong { font-weight: 700; color: #000; }
        em { font-style: italic; color: rgba(0,0,0,0.55); }

        /* Footer tagline */
        .brief-footer {
          border-top: 1px solid rgba(0,0,0,0.08);
          padding: 2rem;
          text-align: center;
        }
        .brief-footer p {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-style: italic;
          font-size: 14px;
          color: rgba(0,0,0,0.3);
        }

        /* Subscribe */
        .subscribe {
          background: #0a0a0a;
          padding: 4rem 2rem;
          text-align: center;
        }
        .subscribe h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .subscribe .sub-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #C5A059;
          margin-bottom: 1.5rem;
        }
        .subscribe p {
          font-family: 'Libre Baskerville', serif;
          font-size: 15px;
          color: rgba(255,255,255,0.4);
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .sub-form {
          display: flex;
          max-width: 400px;
          margin: 0 auto;
          gap: 0;
        }
        .sub-input {
          flex: 1;
          padding: 0.85rem 1rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-right: none;
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          outline: none;
        }
        .sub-input::placeholder { color: rgba(255,255,255,0.2); }
        .sub-input:focus { border-color: #C5A059; }
        .sub-btn {
          padding: 0.85rem 1.5rem;
          background: #C5A059;
          color: #000;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .sub-btn:hover { background: #fff; }

        /* Archive */
        .archive {
          border-top: 1px solid rgba(0,0,0,0.1);
          padding: 3rem 2rem;
        }
        .archive-inner { max-width: 680px; margin: 0 auto; }
        .archive-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          margin-bottom: 1.5rem;
        }
        .archive-toggle h3 {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.3);
        }
        .archive-toggle span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: rgba(0,0,0,0.25);
        }
        .archive-item {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 0.875rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .archive-item:hover { opacity: 0.6; }
        .archive-date {
          font-family: 'Libre Baskerville', serif;
          font-size: 15px;
          color: rgba(0,0,0,0.6);
        }
        .archive-arrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: rgba(0,0,0,0.2);
        }
        .archive-item:hover .archive-arrow { color: #C5A059; }

        /* Footer */
        .site-footer {
          border-top: 2px solid #000;
          padding: 2.5rem 2rem;
          text-align: center;
          background: #F8F6F1;
        }
        .site-footer a {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 900;
          color: #000;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: color 0.2s;
        }
        .site-footer a:hover { color: #C5A059; }
        .site-footer .ft-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.25);
          margin-top: 0.5rem;
        }
        .site-footer .ft-copy {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          color: rgba(0,0,0,0.15);
          margin-top: 1.25rem;
        }

        @media (max-width: 640px) {
          .hero-title { font-size: clamp(3.5rem, 18vw, 6rem); }
          .ask-form { flex-direction: column; }
          .ask-input { border-right: 1px solid rgba(0,0,0,0.15); border-bottom: none; }
          .sub-form { flex-direction: column; }
          .sub-input { border-right: 1px solid rgba(255,255,255,0.12); border-bottom: none; }
          .date-bar { flex-direction: column; gap: 0.5rem; text-align: center; }
        }
      `}</style>

      <div style={{minHeight:'100vh', background:'#F8F6F1'}}>

        {/* HERO */}
        <div className="hero">
          {heroImage && (
            <img src={heroImage.url} alt="Dubai" className="hero-img" />
          )}
          {!heroImage && (
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)'}} />
          )}
          <div className="hero-overlay" />

          {/* Top bar */}
          <div className="hero-top">
            <a href="https://cityagemag.vercel.app" className="hero-back">← CityAge</a>
            <span className="hero-time">{dubaiTime} · Dubai</span>
            <a href="#subscribe" className="hero-subscribe">Subscribe</a>
          </div>

          {/* Title */}
          <div className="hero-content">
            <p className="hero-label">A CityAge Intelligence Letter</p>
            <h1 className="hero-title">Daybreak<br/>Dubai</h1>
            <p className="hero-beats">Money · Luxury · Real Estate · Restaurants · Wellness</p>
            {sunriseText && <span className="hero-sunrise">☀ {sunriseText}</span>}
          </div>

          {/* Photo credit */}
          {heroImage && (
            <a href={heroImage.creditUrl} target="_blank" rel="noopener" className="hero-credit">
              {heroImage.credit} · Unsplash
            </a>
          )}
        </div>

        {/* DATE BAR */}
        {brief && (
          <div className="date-bar">
            <span className="date-bar-date">{briefDate}</span>
            <span className="date-bar-edition">Today's Brief</span>
          </div>
        )}

        {/* ASK BAR */}
        <div className="ask-bar">
          <form className="ask-form" onSubmit={handleAsk}>
            <input
              type="text"
              className="ask-input"
              placeholder="Ask us anything about Dubai — real estate, restaurants, investment, life..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
            <button type="submit" className="ask-btn" disabled={answering}>
              {answering ? 'Asking...' : 'Ask'}
            </button>
          </form>
          {answer && (
            <div className="ask-answer" dangerouslySetInnerHTML={{__html: answer.replace(/\n/g,'<br/>')}} />
          )}
        </div>

        {/* BRIEF */}
        {brief ? (
          <>
            <div className="article-wrap">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
            <div className="brief-footer">
              <p>Before anyone at dinner knows.</p>
            </div>
          </>
        ) : (
          <div style={{textAlign:'center',padding:'8rem 2rem'}}>
            <p style={{fontFamily:'Playfair Display,serif',fontSize:'2.5rem',fontWeight:900,color:'rgba(0,0,0,0.1)'}}>Before sunrise</p>
            <p style={{fontFamily:'Libre Baskerville,serif',color:'rgba(0,0,0,0.3)',marginTop:'1rem'}}>The next brief arrives tomorrow morning.</p>
          </div>
        )}

        {/* SUBSCRIBE */}
        <div className="subscribe" id="subscribe">
          <h2>Daybreak Dubai</h2>
          <p className="sub-label">Daily · Free · 5 minutes · Dubai time</p>
          <p>What opened. What sold. What it cost.<br/>Before anyone at dinner knows.</p>
          <div className="sub-form">
            <input type="email" placeholder="your@email.com" className="sub-input" />
            <button className="sub-btn">Subscribe</button>
          </div>
        </div>

        {/* ARCHIVE */}
        {archive.length > 1 && (
          <div className="archive">
            <div className="archive-inner">
              <div className="archive-toggle" onClick={() => setShowArchive(!showArchive)}>
                <h3>Archive</h3>
                <span>{showArchive ? '↑ Close' : '↓ Show all'}</span>
              </div>
              {showArchive && archive.slice(1).map((b: any) => (
                <a key={b.id} href={`/dispatches/${b.id}`} className="archive-item">
                  <span className="archive-date">
                    {new Date(b.published_at).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Dubai'
                    })}
                  </span>
                  <span className="archive-arrow">Read →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="site-footer">
          <a href="https://cityagemag.vercel.app">CityAge</a>
          <p className="ft-sub">Intelligence for The Urban Planet</p>
          <p className="ft-copy">© {new Date().getFullYear()} The Influence Company & CityAge Media</p>
        </footer>
      </div>
    </>
  )
}
