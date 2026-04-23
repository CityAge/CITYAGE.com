import { createClient } from '@/lib/supabase/server'
import { DubaiHero } from './hero'
import { DubaiAskBar } from './ask-bar'
import { DubaiArchive } from './archive'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Daybreak Dubai — A CityAge Intelligence Letter',
  description: 'Money. Luxury. Real Estate. Restaurants. Wellness. Before anyone at dinner knows.',
}

function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line) continue
    if (/^# /.test(line)) continue
    if (/^\*[^*].*[^*]\*$/.test(line)) continue
    if (line === '## Before Sunrise' || line === '## The Number') {
      out.push(`<h2 style="font-family:monospace;font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#C5A059;margin-top:3.5rem;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid rgba(0,0,0,0.08)">${line.slice(3)}</h2>`)
      continue
    }
    if (/^## /.test(line)) {
      out.push(`<h2 style="font-family:monospace;font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(0,0,0,0.35);margin-top:3.5rem;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid rgba(0,0,0,0.08)">${line.slice(3)}</h2>`)
      continue
    }
    if (/^### /.test(line)) {
      out.push(`<h3 style="font-family:Georgia,serif;font-size:clamp(22px,3.5vw,30px);font-weight:900;line-height:1.15;color:#000;margin-top:1.5rem;margin-bottom:1.25rem">${line.slice(4)}</h3>`)
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
      out.push(`<p style="font-family:Georgia,serif;font-size:17px;font-weight:700;line-height:1.5;color:#000;margin-top:2rem;margin-bottom:0.75rem">${processed}</p>`)
    } else {
      out.push(`<p style="font-family:Georgia,serif;font-size:17px;line-height:1.9;color:rgba(0,0,0,0.75);margin-bottom:1.25rem">${processed}</p>`)
    }
  }
  return out.join('\n')
}

export default async function DaybreakDubaiPage() {
  const supabase = await createClient()

  const { data: brief } = await supabase
    .from('briefs')
    .select('id,title,body,published_at')
    .eq('vertical', 'Daybreak Dubai')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  const { data: archive } = await supabase
    .from('briefs')
    .select('id,title,published_at')
    .eq('vertical', 'Daybreak Dubai')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  const briefDate = brief
    ? new Date(brief.published_at).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Dubai',
      })
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

      {/* Hero — client component handles Unsplash + clock + sunrise */}
      <DubaiHero />

      {/* Date bar */}
      {brief && (
        <div style={{ background: '#0a0a0a', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{briefDate}</span>
          <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A059' }}>Today&apos;s Brief</span>
        </div>
      )}

      {/* Ask bar — client component */}
      <DubaiAskBar />

      {/* Brief */}
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

      {/* Subscribe */}
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

      {/* Archive — client component for toggle */}
      <DubaiArchive items={archive || []} />

      {/* Footer */}
      <footer style={{ borderTop: '2px solid #000', padding: '2.5rem 2rem', textAlign: 'center', background: '#F8F6F1' }}>
        <a href="https://cityagemag.vercel.app" style={{ fontFamily: 'Georgia,serif', fontSize: '1.25rem', fontWeight: 900, color: '#000', textDecoration: 'none' }}>CityAge</a>
        <p style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)', marginTop: '0.5rem' }}>Intelligence for The Urban Planet</p>
        <p style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(0,0,0,0.15)', marginTop: '1.25rem' }}>© {new Date().getFullYear()} The Influence Company &amp; CityAge Media</p>
      </footer>
    </div>
  )
}
