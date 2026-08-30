'use client'

import { WORDMARK_COMPACT_ON_INK } from '@/components/magazine-header'
import { useEffect, useRef, useState } from 'react'
import './studio.css'

const HOUSE = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/partners', label: 'Partners' },
  { href: '/studio', label: 'Studio' },
] as const

const HERO_VIMEO = '1197477652'

const APPEARS = [
  { file: 'nyt.jpg', alt: 'The New York Times' },
  { file: 'economi.jpg', alt: 'The Economist' },
  { file: 'natgeo.jpg', alt: 'National Geographic' },
  { file: '60.jpg', alt: '60 Minutes' },
  { file: 'cbc.jpg', alt: 'CBC' },
  { file: 'pbs.jpg', alt: 'PBS' },
  { file: 'tiff.jpg', alt: 'TIFF' },
  { file: 'leo.jpg', alt: 'LEO Awards' },
  { file: 'long.jpg', alt: 'Long Beach IFF' },
  { file: 'sonoma.jpg', alt: 'Sonoma IFF' },
  { file: 'cannes.jpg', alt: 'Festival de Cannes' },
  { file: 'feratum.jpg', alt: 'Feratum' },
  { file: 'canal.jpg', alt: 'CANAL+' },
  { file: 'cordillera.jpg', alt: 'Cordillera' },
  { file: 'aporto.jpg', alt: 'A Porto International Short Film Festival' },
  { file: 'baddass.jpg', alt: 'Vancouver Badass Film Festival' },
  { file: 'victoria.jpg', alt: 'Victoria Film Festival' },
]

type Film = {
  id: string
  title: string
  type: string
  desc: string
  awards: string[]
  vimeoId: string | null
  stillImage: string | null
  watchUrl?: string
  bg: string
}

const FILMS: Film[] = [
  {
    id: 'best-day-ever',
    title: 'Best Day Ever',
    type: 'Short Film · Doug Coupland',
    desc: "Doug Coupland's meditation on the urban experience — what it means to live a life in the city, and what the best day of it might look like.",
    awards: ['CityAge Studio'],
    vimeoId: '393076418',
    stillImage: null,
    bg: "url('/best-day-ever-thumb.jpg') center/cover no-repeat",
  },
  {
    id: 'facing-saddam',
    title: 'Facing Saddam',
    type: 'Documentary Feature',
    desc: 'The definitive portrait of Saddam Hussein — told through the eyes of those who faced him in his palaces, his prisons, and his final hours.',
    awards: ['National Geographic Channel', 'Directed by Miro Cernetig'],
    vimeoId: null,
    stillImage: '/facing-saddam-still.png',
    bg: "url('/facing-saddam-thumb.png') center/cover no-repeat",
  },
  {
    id: 'sketch-in-the-city',
    title: 'Sketch In The City',
    type: 'Short Film',
    desc: 'An urban portrait through drawing — capturing the texture, rhythm, and character of city life one sketch at a time.',
    awards: ['CityAge Studio'],
    vimeoId: '241956203',
    stillImage: null,
    bg: "url('/sketch-in-the-city-thumb.jpg') center/cover no-repeat",
  },
  {
    id: 'west-coast-modernism',
    title: 'West Coast Modernism',
    type: 'Documentary Short',
    desc: "Architect James Cheng and the design philosophy that shaped Vancouver — a portrait of the city's most influential urban mind and the buildings he left behind.",
    awards: ['CityAge Studio'],
    vimeoId: '287190902',
    stillImage: null,
    bg: "url('/grosvenor-thumb.jpg') center/cover no-repeat",
  },
  {
    id: 'grosvenor-history',
    title: 'Grosvenor: A Century of Cities',
    type: 'Corporate Film',
    desc: "One of the world's great property families has been creating places for people to live and work for over 300 years. A brand film for Grosvenor Pacific.",
    awards: ['CityAge Studio'],
    vimeoId: '266034155',
    stillImage: null,
    bg: "url('/grosvenor-history-thumb.jpg') center/cover no-repeat",
  },
  {
    id: 'harbour-air',
    title: 'Harbour Air',
    type: 'Documentary Short',
    desc: "Forty years flying the coast of British Columbia — a portrait of North America's largest seaplane airline and the wild, beautiful geography it connects.",
    awards: ['CityAge Studio'],
    vimeoId: '141440365',
    stillImage: null,
    bg: "url('/harbour-air-thumb.jpg') center/cover no-repeat",
  },
  {
    id: 'digging-up-a-ship',
    title: 'Digging Up A Ship',
    type: 'Documentary',
    desc: 'The extraordinary story of an archaeological excavation — and what an ancient vessel reveals about the city built above it.',
    awards: ['CityAge Studio'],
    vimeoId: '199052432',
    stillImage: null,
    bg: 'linear-gradient(145deg,#0d1008 0%,#080a05 100%)',
  },
  {
    id: 'deep-sea-mining',
    title: 'Deep Sea Mining',
    type: 'Documentary',
    desc: 'From the ocean floor to the cities of the future — the race to extract the metals powering the energy transition.',
    awards: ['CityAge Studio'],
    vimeoId: '286643094',
    stillImage: null,
    bg: "url('/deep-sea-mining-thumb.jpg') center/cover no-repeat",
  },
  {
    id: 'chinas-sexual-revolution',
    title: 'China’s Sexual Revolution',
    type: 'Documentary · 2007 · CBC',
    desc: '',
    awards: [],
    vimeoId: null,
    stillImage: null,
    watchUrl: 'https://tubitv.com/movies/608855/china-s-sexual-revolution',
    bg: "url('/chinas-sexual-revolution-thumb.jpg') center/cover no-repeat",
  },
]

function vimeoSrc(id: string, controlsOff = false) {
  const extra = controlsOff ? '&controls=0' : ''
  return `https://player.vimeo.com/video/${id}?autoplay=1&muted=0&color=B8956A&title=0&byline=0&portrait=0${extra}`
}

export function StudioPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const stillRef = useRef<HTMLImageElement>(null)
  const platoTimer = useRef<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [info, setInfo] = useState<Film | null>(null)
  const [iframeSrc, setIframeSrc] = useState(() => vimeoSrc(HERO_VIMEO, true))
  const [iframeOn, setIframeOn] = useState(true)
  const [stillOn, setStillOn] = useState(false)
  const [platoOn, setPlatoOn] = useState(true)

  function clearPlatoTimer() {
    if (platoTimer.current != null) {
      window.clearTimeout(platoTimer.current)
      platoTimer.current = null
    }
  }

  function openHero() {
    setIframeSrc(vimeoSrc(HERO_VIMEO, true))
    setIframeOn(true)
    setStillOn(false)
    if (stillRef.current) stillRef.current.removeAttribute('src')
    setActiveId(null)
    setInfo(null)
    setPlatoOn(true)
    clearPlatoTimer()
    platoTimer.current = window.setTimeout(() => setPlatoOn(false), 5200)
  }

  useEffect(() => {
    clearPlatoTimer()
    platoTimer.current = window.setTimeout(() => setPlatoOn(false), 5200)
    return () => clearPlatoTimer()
  }, [])

  function postVimeo(method: string, value: number | boolean) {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    win.postMessage(JSON.stringify({ method, value }), '*')
  }

  function toggleMute() {
    if (!iframeRef.current?.src) return
    const next = !muted
    setMuted(next)
    postVimeo('setVolume', next ? 0 : 1)
    postVimeo('setMuted', next)
  }

  function stopHero() {
    setMuted(false)
    openHero()
  }

  function playFilm(film: Film) {
    if (film.watchUrl) {
      window.open(film.watchUrl, '_blank', 'noopener,noreferrer')
      return
    }

    clearPlatoTimer()
    setPlatoOn(false)
    setActiveId(film.id)
    setInfo(film)

    if (film.stillImage) {
      setIframeOn(false)
      setIframeSrc('')
      setStillOn(true)
      if (stillRef.current) stillRef.current.src = film.stillImage
      return
    }

    setStillOn(false)
    if (!film.vimeoId) return
    setIframeSrc(vimeoSrc(film.vimeoId))
    setIframeOn(true)
  }

  return (
    <div id="page-studio">
      <div className="sv-hero">
        <nav className="sv-nav">
          <div className="sv-house-left">
            <button
              type="button"
              className="sv-burger"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <a href="/" className={`sv-house-mark ${WORDMARK_COMPACT_ON_INK}`}>
              CITYAGE
            </a>
            <div className={`sv-drawer${menuOpen ? ' is-open' : ''}`}>
              {HOUSE.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="sv-house-right">
            <div className="sv-house-links">
              {HOUSE.map((link) => (
                <a key={link.href} href={link.href} className={link.href === '/studio' ? 'is-here' : undefined}>
                  {link.label}
                </a>
              ))}
            </div>
            <a href="/#subscribe" className="sv-subscribe">
              Subscribe
            </a>
          </div>
        </nav>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={stillRef}
          className="sv-still"
          alt=""
          style={{ display: stillOn ? 'block' : 'none' }}
        />
        <iframe
          ref={iframeRef}
          className={`sv-iframe${iframeOn ? ' sv-visible' : ''}`}
          src={iframeSrc}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="CityAge Studio"
        />

        <div className={`sv-plato${platoOn ? '' : ' hidden'}`}>
          <span className="sv-p-pre">Plato Said —</span>
          <span className="sv-p-l1">Those who tell</span>
          <span className="sv-p-l2">the stories</span>
          <span className="sv-p-l3">rule the world.</span>
        </div>

        <div className="sv-player-btns">
          <button type="button" className="sv-mute-btn" onClick={toggleMute} title="Toggle sound">
            {muted ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
            <span>{muted ? 'Sound Off' : 'Sound On'}</span>
          </button>
          <button type="button" className="sv-stop-btn" onClick={stopHero} title="Stop video">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
            <span>Stop</span>
          </button>
        </div>

        <div className="sv-fade" />

        <div className={`sv-info${info ? ' sv-visible' : ''}`}>
          {info && (
            <>
              <span className="sv-info-type">{info.type}</span>
              <div className="sv-info-title">{info.title}</div>
              <div className="sv-info-desc">{info.desc}</div>
              <div className="sv-info-awards">
                {info.awards.map((award) => (
                  <span key={award} className="sv-award">
                    {award}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="sv-logos">
        <span className="sv-logos-label">Where Our Work Appears</span>
        {APPEARS.map((logo) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={logo.file}
            className="sv-logo-img"
            src={`/studio/logos/${logo.file}`}
            alt={logo.alt}
          />
        ))}
      </div>

      <div className="sv-shelf">
        <span className="sv-shelf-label">Select a film</span>
        <div className="sv-row">
          {FILMS.map((film) => {
            const cardClass = `sv-card${activeId === film.id ? ' sv-active' : ''}`
            const inner = (
              <>
                <div className="sv-thumb" style={{ background: film.bg }}>
                  {!film.watchUrl && <span className="sv-thumb-title">{film.title}</span>}
                  <div className="sv-thumb-play">
                    <div className="sv-play-btn">
                      <div className="sv-tri" />
                    </div>
                  </div>
                </div>
                <div className="sv-card-foot">
                  <div className="sv-card-name">{film.title}</div>
                  <div className="sv-card-type">{film.type}</div>
                </div>
              </>
            )

            if (film.watchUrl) {
              return (
                <a
                  key={film.id}
                  id={`sv-c-${film.id}`}
                  className={cardClass}
                  href={film.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              )
            }

            return (
              <button
                key={film.id}
                type="button"
                id={`sv-c-${film.id}`}
                className={cardClass}
                onClick={() => playFilm(film)}
              >
                {inner}
              </button>
            )
          })}
        </div>
      </div>

      <div className="sv-cta">
        <div className="sv-cta-name">CityAge Studio</div>
        <div className="sv-cta-lead">We put ideas in motion.</div>
        <p className="sv-cta-text">
          Our documentaries and films have been seen by millions of people. We make films and brands. We take on a few projects a year, by choice.
        </p>
      </div>
    </div>
  )
}
