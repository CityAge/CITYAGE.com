'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line) continue
    if (/^# /.test(line)) continue
    if (/^\*[^*].*[^*]\*$/.test(line)) continue

    if (line === '## Before Sunrise' || line === '## The Number') {
      out.push(`<h2 style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#C5A059;margin-top:3.5rem;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid rgba(0,0,0,0.08)">${line.slice(3)}</h2>`)
      continue
    }
    if (/^## /.test(line)) {
      out.push(`<h2 style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(0,0,0,0.35);margin-top:3.5rem;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid rgba(0,0,0,0.08)">${line.slice(3)}</h2>`)
      continue
    }
    if (/^### /.test(line)) {
      out.push(`<h3 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(22px,3.5vw,30px);font-weight:900;line-height:1.15;color:#000;margin-top:1.5rem;margin-bottom:1.25rem">${line.slice(4)}</h3>`)
      continue
    }
    if (line === '---') {
      out.push('<hr style="border:none;border-top:1px solid rgba(0,0,0,0.08);margin:2.5rem 0" />')
      continue
    }

    const isBoldLead = /^\*\*[^*].*[^*]\*\*$/.test(line)
    const processed = line
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#000;text-decoration:underline;text-decoration-color:#C5A059;text-decoration-thickness:1.5px;text-underline-offset:3px">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#000">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em style="font-style:italic;color:rgba(0,0,0,0.55)">$1</em>')

    if (isBoldLead) {
      out.push(`<p style="font-family:'Libre Baskerville',Georgia,serif;font-size:17px;font-weight:700;line-height:1.5;color:#000;margin-top:2rem;margin-bottom:0.75rem">${processed}</p>`)
    } else {
      out.push(`<p style="font-family:'Libre Baskerville',Georgia,serif;font-size:17px;line-height:1.9;color:rgba(0,0,0,0.75);margin-bottom:1.25rem">${processed}</p>`)
    }
  }
  return out.join('\n')
}

export default function DaybreakDubaiPage() {
  const [brief, setBrief] = useState<any>(null)
  const [archive, setArchive] = useState<any[]>([])
  const [heroUrl, setHeroUrl] = useState('')
  const [heroCredit, setHeroCredit] = useState({ name: '', url: '' })
  const [sunriseText, setSunriseText] = useState('Dubai')
  const [dubaiTime, setDubaiTime] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [answering, setAnswering] = useState(false)
  const [showArchive, setShowArchive] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: latest } = await supabase
        .from('briefs').select('id,title,body,published_at')
        .eq('vertical', 'Daybreak Dubai').eq('status', 'published')
        .order('published_at', { ascending: false }).limit(1).single()
      setBrief(latest)

      const { data: arc } = await supabase
        .from('briefs').select('id,title,published_at')
        .eq('vertical', 'Daybreak Dubai').eq('status', 'published')
        .order('published_at', { ascending: false }).limit(20)
      setArchive(arc || [])

      try {
        const r = await fetch(
          'https://api.unsplash.com/search/photos?query=Dubai+skyline+luxury+architecture&per_page=5&orientation=landscape&content_filter=high',
          { headers: { Authorization: 'Client-ID AadZIJdXXBV5p9Dm989wFElgbQiZLJmTClSELMZrf18' } }
        )
        if (r.ok) {
          const d = await r.json()
          const photos = d.results
          if (photos?.length) {
            const p = photos[Math.floor(Math.random() * Math.min(3, photos.length))]
            setHeroUrl(p.urls.regular)
            setHeroCredit({ name: `Photo by ${p.user.name}`, url: `${p.user.links.html}?utm_source=cityage&utm_medium=referral` })
          }
        }
      } catch { /* non-fatal */ }
    }
    load()

    function tick() {
      const now = new Date()
      setDubaiTime(now.toLocaleString('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', minute: '2-digit', hour12: true }))
      const dubaiDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }))
      const minsNow = dubaiDate.getHours() * 60 + dubaiDate.getMinutes()
      const sunriseMin = 370
      const diff = minsNow - sunriseMin
      if (diff >= 0 && diff < 720) {
        if (diff < 60) setSunriseText(`Sunrise was ${diff}m ago`)
        else setSunriseText(`Sunrise was ${Math.floor(diff / 60)}h ${diff % 60}m ago`)
      } else {
        const toNext = (24 * 60 - minsNow) + sunriseMin
        setSunriseText(`Next sunrise in ${Math.floor(toNext / 60)}h ${toNext % 60}m`)
      }
    }
    tick()
    const t = setInterval(tick, 30000)
    return () => clearInterval(t)
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
    } catch { setAnswer('Something went wrong. Try again.') }
    setAnswering(false)
  }

  const briefDate = brief
    ? new Date(brief.published_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Dubai' })
    : ''

  const cleanedBody = brief?.body?.split('\n').filter((l: string) => {
    const t = l.trim()
    if (t.startsWith('# Daybreak Dubai')) return false
    if (/^\*[^*].*Dubai.*202/.test(t)) return false
    return true
  }).join('\n') || ''

  const html = brief ? renderMarkdown(cleanedBody) : ''

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F1' }}>

      {/* HERO */}
      <div style={{ position: 'relative', width: '100%', height: '92vh', minHeight: '600px', overflow: 'hidden', background: '#111' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: heroUrl ? `url(${heroUrl})` : 'linear-gradient(135deg,#1a1a2e,#0f3460)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.7, transition: 'opacity 0.8s' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0.3) 40%,rgba(0,0,0,0.82) 85%,rgba(0,0,0,0.95) 100%)' }} />

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
          <a href="https://cityagemag.vercel.app" style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← CityAge</a>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{dubaiTime} · Dubai</span>
          <a href="#subscribe" style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', background: '#C5A059', padding: '0.4rem 1.25rem', textDecoration: 'none' }}>Subscribe</a>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 2rem 2.5rem', textAlign: 'center', zIndex: 10 }}>
          <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C5A059', marginBottom: '1rem' }}>A CityAge Intelligence Letter</p>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(4.5rem,13vw,10rem)', fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.02em', color: '#fff', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Daybreak<br />Dubai
          </h1>
          <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem' }}>
            Money · Luxury · Real Estate · Restaurants · Wellness
          </p>
          <span style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.4rem 1rem' }}>
            ☀ {sunriseText}
          </span>
        </div>

        {heroCredit.name && (
          <a href={heroCredit.url} target="_blank" rel="noopener" style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', zIndex: 10 }}>
            {heroCredit.name} · Unsplash
          </a>
        )}
      </div>

      {/* DATE BAR */}
      {brief && (
        <div style={{ background: '#0a0a0a', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{briefDate}</span>
          <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A059' }}>{"Today's Brief"}</span>
        </div>
      )}

      {/* ASK BAR */}
      <div style={{ background: '#fff', borderBottom: '2px solid #000', padding: '1rem 2rem' }}>
        <form style={{ maxWidth: '680px', margin: '0 auto', display: 'flex' }} onSubmit={handleAsk}>
          <input type="text"
            style={{ flex: 1, fontFamily: 'monospace', fontSize: '12px', padding: '0.8rem 1rem', border: '1px solid rgba(0,0,0,0.15)', borderRight: 'none', background: '#F8F6F1', outline: 'none' }}
            placeholder="Ask us anything about Dubai — real estate, restaurants, investment, lifestyle..."
            value={question} onChange={e => setQuestion(e.target.value)} />
          <button type="submit" disabled={answering}
            style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.8rem 1.5rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {answering ? '...' : 'Ask'}
          </button>
        </form>
        {answer && (
          <div style={{ maxWidth: '680px', margin: '1rem auto 0', fontFamily: 'Georgia,serif', fontSize: '15px', lineHeight: 1.7, color: 'rgba(0,0,0,0.7)', padding: '1rem 1.25rem', background: '#f0ede6', borderLeft: '3px solid #C5A059' }}
            dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, '<br/>') }} />
        )}
      </div>

      {/* BRIEF */}
      {brief ? (
        <>
          <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: '14px', color: 'rgba(0,0,0,0.3)' }}>Before anyone at dinner knows.</p>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
          <p style={{ fontFamily: 'Georgia,serif', fontSize: '2.5rem', fontWeight: 900, color: 'rgba(0,0,0,0.1)' }}>Before sunrise</p>
          <p style={{ fontFamily: 'Georgia,serif', color: 'rgba(0,0,0,0.3)', marginTop: '1rem' }}>The next brief arrives tomorrow morning.</p>
        </div>
      )}

      {/* SUBSCRIBE */}
      <div id="subscribe" style={{ background: '#0a0a0a', padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Georgia,serif', fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>Daybreak Dubai</p>
        <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C5A059', marginBottom: '1.5rem' }}>Daily · Free · 5 minutes · Dubai time</p>
        <p style={{ fontFamily: 'Georgia,serif', fontSize: '15px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, marginBottom: '2rem' }}>
          What opened. What sold. What it cost.<br />Before anyone at dinner knows.
        </p>
        <div style={{ display: 'flex', maxWidth: '400px', margin: '0 auto' }}>
          <input type="email" placeholder="your@email.com"
            style={{ flex: 1, padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRight: 'none', color: '#fff', fontFamily: 'monospace', fontSize: '12px', outline: 'none' }} />
          <button style={{ padding: '0.85rem 1.5rem', background: '#C5A059', color: '#000', fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Subscribe</button>
        </div>
      </div>

      {/* ARCHIVE */}
      {archive.length > 1 && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', padding: '2.5rem 2rem' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '1.5rem' }} onClick={() => setShowArchive(!showArchive)}>
              <h3 style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>Archive</h3>
              <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(0,0,0,0.25)' }}>{showArchive ? '↑ Close' : `↓ ${archive.length - 1} briefs`}</span>
            </div>
            {showArchive && archive.slice(1).map((b: any) => (
              <a key={b.id} href={`/dispatches/${b.id}`}
                style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)', textDecoration: 'none' }}>
                <span style={{ fontFamily: 'Georgia,serif', fontSize: '15px', color: 'rgba(0,0,0,0.6)' }}>
                  {new Date(b.published_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Dubai' })}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(0,0,0,0.2)' }}>Read →</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: '2px solid #000', padding: '2.5rem 2rem', textAlign: 'center', background: '#F8F6F1' }}>
        <a href="https://cityagemag.vercel.app" style={{ fontFamily: 'Georgia,serif', fontSize: '1.25rem', fontWeight: 900, color: '#000', textDecoration: 'none' }}>CityAge</a>
        <p style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)', marginTop: '0.5rem' }}>Intelligence for The Urban Planet</p>
        <p style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(0,0,0,0.15)', marginTop: '1.25rem' }}>© {new Date().getFullYear()} The Influence Company & CityAge Media</p>
      </footer>
    </div>
  )
}
