'use client'

import { useState, useEffect } from 'react'

export function DubaiHero() {
  const [heroUrl, setHeroUrl] = useState('')
  const [heroCredit, setHeroCredit] = useState({ name: '', url: '' })
  const [sunriseText, setSunriseText] = useState('Dubai')
  const [dubaiTime, setDubaiTime] = useState('')

  useEffect(() => {
    // Fetch Unsplash photo
    fetch('https://api.unsplash.com/search/photos?query=Dubai+skyline+luxury+architecture&per_page=5&orientation=landscape&content_filter=high', {
      headers: { Authorization: 'Client-ID AadZIJdXXBV5p9Dm989wFElgbQiZLJmTClSELMZrf18' }
    }).then(r => r.json()).then(d => {
      const photos = d.results
      if (photos?.length) {
        const p = photos[Math.floor(Math.random() * Math.min(3, photos.length))]
        setHeroUrl(p.urls.regular)
        setHeroCredit({ name: `Photo by ${p.user.name}`, url: `${p.user.links.html}?utm_source=cityage&utm_medium=referral` })
      }
    }).catch(() => {})

    function tick() {
      const now = new Date()
      setDubaiTime(now.toLocaleString('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', minute: '2-digit', hour12: true }))
      const dubaiDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }))
      const minsNow = dubaiDate.getHours() * 60 + dubaiDate.getMinutes()
      const sunriseMin = 370 // ~6:10am Dubai
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '92vh', minHeight: '600px', overflow: 'hidden', background: '#111' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: heroUrl ? `url(${heroUrl})` : 'linear-gradient(135deg,#1a1a2e,#0f3460)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.72, transition: 'opacity 1s'
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0.25) 35%,rgba(0,0,0,0.8) 80%,rgba(0,0,0,0.95) 100%)' }} />

      {/* Top nav */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <a href="https://cityagemag.vercel.app" style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← CityAge</a>
        <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{dubaiTime} · Dubai</span>
        <a href="#subscribe" style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', background: '#C5A059', padding: '0.4rem 1.25rem', textDecoration: 'none' }}>Subscribe</a>
      </div>

      {/* Wordmark + sunrise */}
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
  )
}
