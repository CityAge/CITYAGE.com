'use client'

import { useState, useEffect, useRef } from 'react'

interface Speaker {
  id: string
  name: string
  title: string | null
  organisation: string | null
  photo_url: string | null
  event_name: string | null
  city: string | null
  year: number | null
}

interface Props {
  speakers: Speaker[]
}

function SpeakerPhoto({ speaker, size = 'md' }: { speaker: Speaker, size?: 'sm' | 'md' | 'lg' }) {
  const [imgError, setImgError] = useState(false)
  const initials = speaker.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const sizeClass = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-24 h-24' : 'w-20 h-20'

  return (
    <div className={`${sizeClass} flex-shrink-0 overflow-hidden bg-[#1a1a1a] relative`}>
      {speaker.photo_url && !imgError ? (
        <img
          src={speaker.photo_url}
          alt={speaker.name}
          className="w-full h-full object-cover object-top"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-serif font-black text-lg text-white/20">{initials}</span>
        </div>
      )}
    </div>
  )
}

// Single scrolling reel row
function ReelRow({ speakers, direction, speed }: { speakers: Speaker[], direction: 'left' | 'right', speed: number }) {
  const doubled = [...speakers, ...speakers, ...speakers]

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex gap-1"
        style={{
          animation: `reel-${direction} ${speed}s linear infinite`,
          width: 'max-content',
        }}
      >
        {doubled.map((speaker, i) => (
          <div key={`${speaker.id}-${i}`} className="relative group flex-shrink-0">
            <div className="w-[72px] h-[72px] overflow-hidden bg-[#111] relative">
              {speaker.photo_url ? (
                <img
                  src={speaker.photo_url}
                  alt={speaker.name}
                  className="w-full h-full object-cover object-top grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                  <span className="font-serif font-black text-sm text-white/20">
                    {speaker.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                  </span>
                </div>
              )}
            </div>
            {/* Hover card */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black border border-white/10 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-48">
              <div className="font-serif font-bold text-[11px] text-white leading-tight mb-0.5">{speaker.name}</div>
              {speaker.title && <div className="font-mono text-[8px] tracking-[0.1em] uppercase text-white/40 leading-tight">{speaker.title}</div>}
              {speaker.organisation && <div className="font-mono text-[8px] tracking-[0.1em] uppercase text-[#C5A059] leading-tight">{speaker.organisation}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SpeakersClient({ speakers }: Props) {
  const [search, setSearch] = useState('')
  const [activeEvent, setActiveEvent] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  const mosaicRef = useRef<HTMLDivElement>(null)

  // Animate counter on mount
  useEffect(() => {
    const target = speakers.length
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [speakers.length])

  const events = [...new Set(speakers.map(s => s.event_name).filter(Boolean))] as string[]

  const filtered = speakers.filter(s => {
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.organisation || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.title || '').toLowerCase().includes(search.toLowerCase())
    const matchEvent = !activeEvent || s.event_name === activeEvent
    return matchSearch && matchEvent
  })

  // Split speakers into 3 reel rows
  const third = Math.ceil(speakers.length / 3)
  const row1 = speakers.slice(0, third)
  const row2 = speakers.slice(third, third * 2)
  const row3 = speakers.slice(third * 2)

  // Pad short rows
  while (row1.length < 8) row1.push(...speakers.slice(0, 8 - row1.length))
  while (row2.length < 8) row2.push(...speakers.slice(0, 8 - row2.length))
  while (row3.length < 8) row3.push(...speakers.slice(0, 8 - row3.length))

  return (
    <>
      <style>{`
        @keyframes reel-left {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes reel-right {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }
        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HERO: CINEMATIC REEL ── */}
      <section className="bg-black pt-0 pb-0 overflow-hidden relative">

        {/* Gradient overlays for fade effect on sides */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Three reel rows */}
        <div className="flex flex-col gap-1 pt-1">
          <ReelRow speakers={row1} direction="left" speed={40} />
          <ReelRow speakers={row2} direction="right" speed={55} />
          <ReelRow speakers={row3} direction="left" speed={45} />
        </div>

        {/* Overlay: counter + headline */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-sm px-10 py-8 text-center border border-white/10">
            <div
              className="font-serif font-black text-white leading-none mb-2"
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', animation: 'count-up 0.5s ease-out' }}
            >
              {count.toLocaleString()}
            </div>
            <div className="font-mono text-[11px] tracking-[0.35em] uppercase text-[#C5A059] mb-1">
              Leaders & Growing
            </div>
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30">
              From The Urban Planet · Since 2012
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH + FILTER ── */}
      <section className="bg-black border-b border-white/10 sticky top-[100px] z-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row items-start md:items-center gap-4">

          {/* Search */}
          <div className="relative flex-shrink-0 w-full md:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search speakers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-[11px] tracking-[0.1em] py-2.5 pl-9 pr-4 outline-none focus:border-[#C5A059] transition-colors"
            />
          </div>

          {/* Event filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0 flex-1">
            <button
              onClick={() => setActiveEvent(null)}
              className={`font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 flex-shrink-0 transition-colors ${!activeEvent ? 'bg-[#C5A059] text-black' : 'text-white/30 hover:text-white border border-white/10'}`}
            >
              All
            </button>
            {events.map(event => (
              <button
                key={event}
                onClick={() => setActiveEvent(activeEvent === event ? null : event)}
                className={`font-mono text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 flex-shrink-0 whitespace-nowrap transition-colors ${activeEvent === event ? 'bg-[#C5A059] text-black' : 'text-white/30 hover:text-white border border-white/10'}`}
              >
                {event}
              </button>
            ))}
          </div>

          {/* Result count */}
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/20 flex-shrink-0">
            {filtered.length} shown
          </div>
        </div>
      </section>

      {/* ── MOSAIC GRID ── */}
      <section ref={mosaicRef} className="bg-[#0a0a0a] flex-grow">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/20">
                No speakers found
              </p>
            </div>
          ) : (
            <>
              {/* Group by event when not searching */}
              {!search && !activeEvent ? (
                events.map(eventName => {
                  const eventSpeakers = filtered.filter(s => s.event_name === eventName)
                  if (eventSpeakers.length === 0) return null
                  const year = eventSpeakers[0]?.year
                  const city = eventSpeakers[0]?.city
                  return (
                    <div key={eventName} className="mb-20">
                      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-white/10">
                        <div>
                          <h2 className="font-serif font-black text-[1.3rem] md:text-[1.6rem] tracking-tight text-white">
                            {eventName}
                          </h2>
                          <div className="flex items-center gap-3 mt-1">
                            {city && <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/25">{city}</span>}
                            {year && <><span className="text-white/10 text-[8px]">·</span><span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/25">{year}</span></>}
                          </div>
                        </div>
                        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/15">
                          {eventSpeakers.length} speakers
                        </span>
                      </div>
                      <SpeakerMosaic speakers={eventSpeakers} />
                    </div>
                  )
                })
              ) : (
                <SpeakerMosaic speakers={filtered} />
              )}
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/10 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C5A059] mb-3">
              Join the network
            </div>
            <p className="font-serif text-white/50 text-[15px] leading-[1.65] max-w-[500px]">
              CityAge convenes the leaders of The Urban Planet. If you are building something that matters, we would like to hear from you.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <a href="/purpose" className="inline-block border border-white/20 text-white font-mono text-[9px] font-bold tracking-[0.2em] uppercase px-6 py-3 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors">
              Our Purpose
            </a>
            <a href="mailto:miro@cityage.com" className="inline-block bg-[#C5A059] text-black font-mono text-[9px] font-bold tracking-[0.2em] uppercase px-6 py-3 hover:bg-white transition-colors">
              Get in Touch →
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

function SpeakerMosaic({ speakers }: { speakers: Speaker[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-px bg-white/5">
      {speakers.map(speaker => (
        <SpeakerCard key={speaker.id} speaker={speaker} />
      ))}
    </div>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const initials = speaker.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div
      className="relative group cursor-pointer bg-[#111] aspect-square overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo */}
      {speaker.photo_url && !imgError ? (
        <img
          src={speaker.photo_url}
          alt={speaker.name}
          className={`w-full h-full object-cover object-top transition-all duration-500 ${hovered ? 'grayscale-0 scale-105 brightness-100' : 'grayscale brightness-60'}`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
          <span className="font-serif font-black text-xl text-white/15">{initials}</span>
        </div>
      )}

      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-black/80 flex flex-col justify-end p-2 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="font-serif font-bold text-[10px] leading-tight text-white mb-0.5 line-clamp-2">
          {speaker.name}
        </div>
        {speaker.title && (
          <div className="font-mono text-[7px] tracking-[0.08em] uppercase text-white/40 leading-tight line-clamp-1">
            {speaker.title}
          </div>
        )}
        {speaker.organisation && (
          <div className="font-mono text-[7px] tracking-[0.08em] uppercase text-[#C5A059] leading-tight line-clamp-1">
            {speaker.organisation}
          </div>
        )}
      </div>
    </div>
  )
}
