'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function renderMarkdown(md: string): string {
  return md
    .replace(/^# .+$/gm, '')
    .replace(/^\*(?!\*).*(?<!\*)\*$/gm, '')
    .replace(/^## Before Sunrise$/gm, '<h2 style="font-family:JetBrains Mono,monospace;font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#C5A059;margin-top:3.5rem;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid rgba(0,0,0,0.08)">Before Sunrise</h2>')
    .replace(/^## The Number$/gm, '<h2 style="font-family:JetBrains Mono,monospace;font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#C5A059;margin-top:3.5rem;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid rgba(0,0,0,0.08)">The Number</h2>')
    .replace(/^## (.+)$/gm, '<h2 style="font-family:JetBrains Mono,monospace;font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(0,0,0,0.35);margin-top:3.5rem;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid rgba(0,0,0,0.08)">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-family:Playfair Display,Georgia,serif;font-size:clamp(22px,3.5vw,30px);font-weight:900;line-height:1.15;letter-spacing:-0.01em;color:#000;margin-top:1.5rem;margin-bottom:1.25rem">$1</h3>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(0,0,0,0.08);margin:2.5rem 0" />')
    .replace(/^\*\*(.+?)\*\*$/gm, '<p style="font-family:Libre Baskerville,Georgia,serif;font-size:17px;font-weight:700;line-height:1.5;color:#000;margin-top:2rem;margin-bottom:0.75rem">$1</p>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#000;text-decoration:underline;text-decoration-color:#C5A059;text-decoration-thickness:1.5px;text-underline-offset:3px">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#000">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="font-style:italic;color:rgba(0,0,0,0.55)">$1</em>')
    .replace(/^(?!<)(.*\S.*)$/gm, '<p style="font-family:Libre Baskerville,Georgia,serif;font-size:17px;line-height:1.9;color:rgba(0,0,0,0.75);margin-bottom:1.25rem">$1</p>')
}

export default function DaybreakDubaiPage() {
  const [brief, setBrief] = useState<any>(null)
  const [archive, setArchive] = useState<any[]>([])
  const [heroUrl, setHeroUrl] = useState('')
  const [heroCredit, setHeroCredit] = useState({name:'',url:''})
  const [sunriseText, setSunriseText] = useState('Dubai')
  const [dubaiTime, setDubaiTime] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [answering, setAnswering] = useState(false)
  const [showArchive, setShowArchive] = useState(false)

  useEffect(() => {
    // Load data
    async function load() {
      const { data: latest } = await supabase
        .from('briefs').select('id,title,body,published_at')
        .eq('vertical','Daybreak Dubai').eq('status','published')
        .order('published_at',{ascending:false}).limit(1).single()
      setBrief(latest)

      const { data: arc } = await supabase
        .from('briefs').select('id,title,published_at')
        .eq('vertical','Daybreak Dubai').eq('status','published')
        .order('published_at',{ascending:false}).limit(20)
      setArchive(arc || [])

      // Unsplash
      try {
        const r = await fetch(
          'https://api.unsplash.com/search/photos?query=Dubai+skyline+luxury&per_page=5&orientation=landscape&content_filter=high',
          {headers:{'Authorization':'Client-ID AadZIJdXXBV5p9Dm989wFElgbQiZLJmTClSELMZrf18'}}
        )
        if (r.ok) {
          const d = await r.json()
          const photos = d.results
          if (photos?.length) {
            const p = photos[Math.floor(Math.random()*Math.min(3,photos.length))]
            setHeroUrl(p.urls.regular)
            setHeroCredit({name:`Photo by ${p.user.name}`,url:`${p.user.links.html}?utm_source=cityage&utm_medium=referral`})
          }
        }
      } catch {}
    }
    load()

    // Clock + sunrise
    function tick() {
      const now = new Date()
      setDubaiTime(now.toLocaleString('en-US',{timeZone:'Asia/Dubai',hour:'numeric',minute:'2-digit',hour12:true}))
      // Simple sunrise approx for Dubai — sunrise ~6am varies slightly
      const dubaiDate = new Date(now.toLocaleString('en-US',{timeZone:'Asia/Dubai'}))
      const h = dubaiDate.getHours(), m = dubaiDate.getMinutes()
      const minsNow = h * 60 + m
      // Dubai sunrise roughly 6:00-6:30am year round
      const sunriseMin = 370 // 6:10am
      const diff = minsNow - sunriseMin
      if (diff >= 0 && diff < 720) {
        if (diff < 60) setSunriseText(`☀ Sunrise was ${diff}m ago`)
        else setSunriseText(`☀ Sunrise was ${Math.floor(diff/60)}h ${diff%60}m ago`)
      } else if (diff < 0 && diff > -120) {
        setSunriseText(`☀ Sunrise in ${Math.abs(diff)}m`)
      } else {
        const toNext = (24*60 - minsNow) + sunriseMin
        setSunriseText(`☀ Next sunrise in ${Math.floor(toNext/60)}h ${toNext%60}m`)
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
      const res = await fetch('/api/dubai-ask',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({question})
      })
      const data = await res.json()
      setAnswer(data.answer || 'No answer found.')
    } catch { setAnswer('Something went wrong. Try again.') }
    setAnswering(false)
  }

  const briefDate = brief ? new Date(brief.published_at).toLocaleDateString('en-US',{
    weekday:'long',year:'numeric',month:'long',day:'numeric',timeZone:'Asia/Dubai'
  }) : ''

  const cleanedBody = brief?.body?.split('\n').filter((l:string) => {
    const t = l.trim()
    if (t.startsWith('# Daybreak Dubai')) return false
    if (t.startsWith('*') && t.endsWith('*') && t.includes('Dubai') && t.includes('202')) return false
    return true
  }).join('\n') || ''

  const html = brief ? renderMarkdown(cleanedBody) : ''

  const S: Record<string,React.CSSProperties> = {
    wrap: {minHeight:'100vh',background:'#F8F6F1',fontFamily:'sans-serif'},
    // Hero
    hero: {position:'relative',width:'100%',height:'92vh',minHeight:'600px',overflow:'hidden',background:'#111'},
    heroBg: {position:'absolute',inset:0,backgroundImage:heroUrl?`url(${heroUrl})`:'linear-gradient(135deg,#1a1a2e,#0f3460)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.7,transition:'opacity 0.8s'},
    heroOverlay: {position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0.3) 40%,rgba(0,0,0,0.8) 85%,rgba(0,0,0,0.92) 100%)'},
    heroTop: {position:'absolute',top:0,left:0,right:0,padding:'1.5rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',zIndex:10},
    heroBack: {fontFamily:'JetBrains Mono,monospace',fontSize:'10px',letterSpacing:'0.25em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.5)',textDecoration:'none'},
    heroTime: {fontFamily:'JetBrains Mono,monospace',fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.35)'},
    heroSub: {fontFamily:'JetBrains Mono,monospace',fontSize:'9px',letterSpacing:'0.2em',textTransform:'uppercase' as const,color:'#000',background:'#C5A059',padding:'0.4rem 1.25rem',textDecoration:'none'},
    heroContent: {position:'absolute',bottom:0,left:0,right:0,padding:'0 2rem 2.5rem',textAlign:'center',zIndex:10},
    heroLabel: {fontFamily:'JetBrains Mono,monospace',fontSize:'9px',letterSpacing:'0.35em',textTransform:'uppercase' as const,color:'#C5A059',marginBottom:'1rem'},
    heroTitle: {fontFamily:'Playfair Display,Times New Roman,serif',fontSize:'clamp(4.5rem,13vw,10rem)',fontWeight:900,lineHeight:0.88,letterSpacing:'-0.02em',color:'#fff',textTransform:'uppercase' as const,marginBottom:'1.5rem'},
    heroBeats: {fontFamily:'JetBrains Mono,monospace',fontSize:'9px',letterSpacing:'0.3em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.3)',marginBottom:'1.25rem'},
    heroSunrise: {display:'inline-block',fontFamily:'JetBrains Mono,monospace',fontSize:'10px',letterSpacing:'0.15em',color:'rgba(255,255,255,0.55)',border:'1px solid rgba(255,255,255,0.2)',padding:'0.4rem 1rem'},
    heroCredit: {position:'absolute',bottom:'1rem',right:'1.5rem',fontFamily:'JetBrains Mono,monospace',fontSize:'8px',color:'rgba(255,255,255,0.25)',textDecoration:'none',zIndex:10},
    // Date bar
    dateBar: {background:'#0a0a0a',padding:'0.875rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between'},
    dateBarDate: {fontFamily:'JetBrains Mono,monospace',fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.35)'},
    dateBarRight: {fontFamily:'JetBrains Mono,monospace',fontSize:'9px',letterSpacing:'0.2em',textTransform:'uppercase' as const,color:'#C5A059'},
    // Ask
    askBar: {background:'#fff',borderBottom:'2px solid #000',padding:'1rem 2rem'},
    askForm: {maxWidth:'680px',margin:'0 auto',display:'flex'},
    askInput: {flex:1,fontFamily:'JetBrains Mono,monospace',fontSize:'12px',padding:'0.8rem 1rem',border:'1px solid rgba(0,0,0,0.15)',borderRight:'none',background:'#F8F6F1',outline:'none'},
    askBtn: {fontFamily:'JetBrains Mono,monospace',fontSize:'10px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase' as const,padding:'0.8rem 1.5rem',background:'#000',color:'#fff',border:'none',cursor:'pointer'},
    askAnswer: {maxWidth:'680px',margin:'1rem auto 0',fontFamily:'Libre Baskerville,Georgia,serif',fontSize:'15px',lineHeight:1.7,color:'rgba(0,0,0,0.7)',padding:'1rem 1.25rem',background:'#f0ede6',borderLeft:'3px solid #C5A059'},
    // Article
    article: {maxWidth:'680px',margin:'0 auto',padding:'2.5rem 2rem 4rem'},
    // Subscribe
    subscribe: {background:'#0a0a0a',padding:'4rem 2rem',textAlign:'center' as const},
    subTitle: {fontFamily:'Playfair Display,serif',fontSize:'2rem',fontWeight:900,color:'#fff',marginBottom:'0.5rem'},
    subLabel: {fontFamily:'JetBrains Mono,monospace',fontSize:'9px',letterSpacing:'0.25em',textTransform:'uppercase' as const,color:'#C5A059',marginBottom:'1.5rem'},
    subText: {fontFamily:'Libre Baskerville,serif',fontSize:'15px',color:'rgba(255,255,255,0.35)',lineHeight:1.7,marginBottom:'2rem'},
    subForm: {display:'flex',maxWidth:'400px',margin:'0 auto'},
    subInput: {flex:1,padding:'0.85rem 1rem',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRight:'none',color:'#fff',fontFamily:'JetBrains Mono,monospace',fontSize:'12px',outline:'none'},
    subBtn: {padding:'0.85rem 1.5rem',background:'#C5A059',color:'#000',fontFamily:'JetBrains Mono,monospace',fontSize:'10px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase' as const,border:'none',cursor:'pointer'},
    // Archive
    archiveWrap: {borderTop:'1px solid rgba(0,0,0,0.1)',padding:'2.5rem 2rem'},
    archiveInner: {maxWidth:'680px',margin:'0 auto'},
    archiveToggle: {display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',marginBottom:'1.5rem'},
    archiveH: {fontFamily:'JetBrains Mono,monospace',fontSize:'9px',letterSpacing:'0.3em',textTransform:'uppercase' as const,color:'rgba(0,0,0,0.3)'},
    archiveItem: {display:'flex',alignItems:'baseline',justifyContent:'space-between',padding:'0.875rem 0',borderBottom:'1px solid rgba(0,0,0,0.05)',textDecoration:'none'},
    archiveDate: {fontFamily:'Libre Baskerville,serif',fontSize:'15px',color:'rgba(0,0,0,0.6)'},
    archiveArrow: {fontFamily:'JetBrains Mono,monospace',fontSize:'9px',color:'rgba(0,0,0,0.2)'},
    // Footer
    footer: {borderTop:'2px solid #000',padding:'2.5rem 2rem',textAlign:'center' as const,background:'#F8F6F1'},
    footerLink: {fontFamily:'Playfair Display,serif',fontSize:'1.25rem',fontWeight:900,color:'#000',textDecoration:'none'},
    footerSub: {fontFamily:'JetBrains Mono,monospace',fontSize:'8px',letterSpacing:'0.25em',textTransform:'uppercase' as const,color:'rgba(0,0,0,0.25)',marginTop:'0.5rem'},
    footerCopy: {fontFamily:'JetBrains Mono,monospace',fontSize:'8px',color:'rgba(0,0,0,0.15)',marginTop:'1.25rem'},
  }

  return (
    <div style={S.wrap}>
      {/* HERO */}
      <div style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroOverlay} />
        <div style={S.heroTop}>
          <a href="https://cityagemag.vercel.app" style={S.heroBack}>← CityAge</a>
          <span style={S.heroTime}>{dubaiTime} · Dubai</span>
          <a href="#subscribe" style={S.heroSub}>Subscribe</a>
        </div>
        <div style={S.heroContent}>
          <p style={S.heroLabel}>A CityAge Intelligence Letter</p>
          <h1 style={S.heroTitle}>Daybreak<br/>Dubai</h1>
          <p style={S.heroBeats}>Money · Luxury · Real Estate · Restaurants · Wellness</p>
          <span style={S.heroSunrise}>{sunriseText}</span>
        </div>
        {heroCredit.name && (
          <a href={heroCredit.url} target="_blank" rel="noopener" style={S.heroCredit}>
            {heroCredit.name} · Unsplash
          </a>
        )}
      </div>

      {/* DATE BAR */}
      {brief && (
        <div style={S.dateBar}>
          <span style={S.dateBarDate}>{briefDate}</span>
          <span style={S.dateBarRight}>Today's Brief</span>
        </div>
      )}

      {/* ASK BAR */}
      <div style={S.askBar}>
        <form style={S.askForm} onSubmit={handleAsk}>
          <input style={S.askInput} type="text"
            placeholder="Ask us anything about Dubai — real estate, restaurants, investment, lifestyle..."
            value={question} onChange={e => setQuestion(e.target.value)} />
          <button type="submit" style={S.askBtn} disabled={answering}>
            {answering ? '...' : 'Ask'}
          </button>
        </form>
        {answer && <div style={S.askAnswer} dangerouslySetInnerHTML={{__html:answer.replace(/\n/g,'<br/>')}} />}
      </div>

      {/* BRIEF */}
      {brief ? (
        <>
          <div style={S.article}>
            <div dangerouslySetInnerHTML={{__html:html}} />
          </div>
          <div style={{borderTop:'1px solid rgba(0,0,0,0.08)',padding:'2rem',textAlign:'center'}}>
            <p style={{fontFamily:'Libre Baskerville,serif',fontStyle:'italic',fontSize:'14px',color:'rgba(0,0,0,0.3)'}}>Before anyone at dinner knows.</p>
          </div>
        </>
      ) : (
        <div style={{textAlign:'center',padding:'8rem 2rem'}}>
          <p style={{fontFamily:'Playfair Display,serif',fontSize:'2.5rem',fontWeight:900,color:'rgba(0,0,0,0.1)'}}>Before sunrise</p>
          <p style={{fontFamily:'Libre Baskerville,serif',color:'rgba(0,0,0,0.3)',marginTop:'1rem'}}>The next brief arrives tomorrow morning.</p>
        </div>
      )}

      {/* SUBSCRIBE */}
      <div style={S.subscribe} id="subscribe">
        <p style={S.subTitle}>Daybreak Dubai</p>
        <p style={S.subLabel}>Daily · Free · 5 minutes · Dubai time</p>
        <p style={S.subText}>What opened. What sold. What it cost.<br/>Before anyone at dinner knows.</p>
        <div style={S.subForm}>
          <input type="email" placeholder="your@email.com" style={S.subInput} />
          <button style={S.subBtn}>Subscribe</button>
        </div>
      </div>

      {/* ARCHIVE */}
      {archive.length > 1 && (
        <div style={S.archiveWrap}>
          <div style={S.archiveInner}>
            <div style={S.archiveToggle} onClick={() => setShowArchive(!showArchive)}>
              <h3 style={S.archiveH}>Archive</h3>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'9px',color:'rgba(0,0,0,0.25)'}}>
                {showArchive ? '↑ Close' : `↓ ${archive.length - 1} briefs`}
              </span>
            </div>
            {showArchive && archive.slice(1).map((b:any) => (
              <a key={b.id} href={`/dispatches/${b.id}`} style={S.archiveItem}>
                <span style={S.archiveDate}>
                  {new Date(b.published_at).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',timeZone:'Asia/Dubai'})}
                </span>
                <span style={S.archiveArrow}>Read →</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={S.footer}>
        <a href="https://cityagemag.vercel.app" style={S.footerLink}>CityAge</a>
        <p style={S.footerSub}>Intelligence for The Urban Planet</p>
        <p style={S.footerCopy}>© {new Date().getFullYear()} The Influence Company & CityAge Media</p>
      </footer>
    </div>
  )
}
// cache bust Sat Mar 28 07:17:52 UTC 2026
