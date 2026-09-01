'use client'

import { CityAgeMark } from '@/components/magazine-header-chrome'
import { useEffect, useRef, useState } from 'react'
import './studio.css'

const HOUSE = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/partners', label: 'Partners' },
  { href: '/studio', label: 'Studio' },
] as const

const HERO_VIMEO = '1197477652'
const HERO_STILL = '/studio-hero-still.jpg'

const APPEARS = [
  { file: 'natgeo.jpg', alt: 'National Geographic' },
  { file: 'economi.jpg', alt: 'The Economist' },
  { file: '60.jpg', alt: '60 Minutes' },
  { file: 'cbc.jpg', alt: 'CBC' },
  { file: 'nyt.jpg', alt: 'The New York Times' },
  { file: 'pbs.jpg', alt: 'PBS' },
  { file: 'appletv.jpg', alt: 'Apple TV' },
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
  thumb: string | null
  credit?: string
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
    thumb: '/best-day-ever-thumb.jpg',
  },
  {
    id: 'facing-saddam',
    title: 'Facing Saddam',
    type: 'Documentary Feature',
    desc: 'The definitive portrait of Saddam Hussein — told through the eyes of those who faced him in his palaces, his prisons, and his final hours.',
    awards: ['National Geographic Channel', 'Directed by Miro Cernetig'],
    vimeoId: null,
    stillImage: '/facing-saddam-still.png',
    watchUrl: 'https://tv.apple.com/ca/episode/facing-saddam/umc.cmc.71rhkd7ko45ypb6z2h4ywr4gs?showId=umc.cmc.3wiwjhiezu1c36dfaz8cnk21b',
    thumb: '/facing-saddam-still.png',
  },
  {
    id: 'facing-trump',
    title: 'Facing Trump',
    type: '',
    desc: '',
    awards: [],
    vimeoId: null,
    stillImage: '/facing-trump-thumb.jpg',
    watchUrl: 'https://tv.apple.com/ca/show/facing/umc.cmc.3wiwjhiezu1c36dfaz8cnk21b',
    thumb: '/facing-trump-thumb.jpg',
  },
  {
    id: 'sketch-in-the-city',
    title: 'Sketch In The City',
    type: 'Short Film',
    desc: 'An urban portrait through drawing — capturing the texture, rhythm, and character of city life one sketch at a time.',
    awards: ['CityAge Studio'],
    vimeoId: '241956203',
    stillImage: null,
    thumb: '/sketch-in-the-city-thumb.jpg',
  },
  {
    id: 'west-coast-modernism',
    title: 'West Coast Modernism',
    type: 'Documentary Short',
    desc: "Architect James Cheng and the design philosophy that shaped Vancouver — a portrait of the city's most influential urban mind and the buildings he left behind.",
    awards: ['CityAge Studio'],
    vimeoId: '287190902',
    stillImage: null,
    thumb: '/grosvenor-thumb.jpg',
  },
  {
    id: 'grosvenor-history',
    title: 'Grosvenor: A Century of Cities',
    type: 'Corporate Film',
    desc: "One of the world's great property families has been creating places for people to live and work for over 300 years. A brand film for Grosvenor Pacific.",
    awards: ['CityAge Studio'],
    vimeoId: '266034155',
    stillImage: null,
    thumb: '/grosvenor-history-thumb.jpg',
  },
  {
    id: 'harbour-air',
    title: 'Harbour Air',
    type: 'Documentary Short',
    desc: "Forty years flying the coast of British Columbia — a portrait of North America's largest seaplane airline and the wild, beautiful geography it connects.",
    awards: ['CityAge Studio'],
    vimeoId: '141440365',
    stillImage: null,
    thumb: '/harbour-air-thumb.jpg',
  },
  {
    id: 'digging-up-a-ship',
    title: 'Digging Up A Ship',
    type: 'Documentary',
    desc: 'The extraordinary story of an archaeological excavation — and what an ancient vessel reveals about the city built above it.',
    awards: ['CityAge Studio'],
    vimeoId: '199052432',
    stillImage: null,
    thumb: '/digging-up-a-ship-thumb.jpg',
  },
  {
    id: 'deep-sea-mining',
    title: 'Deep Sea Mining',
    type: 'Documentary',
    desc: 'From the ocean floor to the cities of the future — the race to extract the metals powering the energy transition.',
    awards: ['CityAge Studio'],
    vimeoId: '286643094',
    stillImage: null,
    thumb: '/deep-sea-mining-thumb.jpg',
  },
  {
    id: 'chinas-sexual-revolution',
    title: 'China’s Sexual Revolution',
    type: '',
    desc: '',
    awards: [],
    vimeoId: null,
    stillImage: null,
    watchUrl: 'https://tubitv.com/movies/608855/china-s-sexual-revolution',
    thumb: '/chinas-sexual-revolution-thumb.jpg',
  },
  {
    id: 'polar-bear-safari',
    title: 'Polar Bear Safari',
    type: '',
    desc: '',
    awards: [],
    vimeoId: null,
    stillImage: null,
    watchUrl: 'https://www.primevideo.com/detail/0SY3XAQ5LEZDYLQ9F41FDWZ84L',
    thumb: '/polar-bear-safari-thumb.jpg',
  },
  {
    id: 'carbon-hunters',
    title: 'Carbon Hunters',
    type: '',
    desc: '',
    awards: [],
    vimeoId: null,
    stillImage: null,
    watchUrl: 'https://www.youtube.com/watch?v=MLRBDD7x77M',
    thumb: '/carbon-hunters-thumb.jpg',
  },
  {
    id: 'juggling-dreams',
    title: 'Juggling Dreams',
    type: '',
    desc: '',
    awards: [],
    vimeoId: null,
    stillImage: null,
    watchUrl: 'https://www.primevideo.com/detail/0HBUUQSC8OYN1W79EVX02W0FFS',
    thumb: '/juggling-dreams-thumb.jpg',
  },
  {
    id: 'castros-gold',
    title: 'Castro’s Gold',
    type: '',
    desc: '',
    awards: [],
    vimeoId: null,
    stillImage: null,
    watchUrl: 'https://www.youtube.com/watch?v=sw2qF83VMTc',
    thumb: '/castros-gold-thumb.jpg',
  },
  {
    id: 'the-new-american-city',
    title: 'The New American City',
    type: '',
    desc: '',
    awards: [],
    vimeoId: null,
    stillImage: null,
    watchUrl: 'https://www.youtube.com/watch?v=xMhFP2oM3CY',
    thumb: '/new-american-city-thumb.jpg',
  },
  {
    id: 'giltrudes-dwelling',
    title: "Giltrude's Dwelling",
    type: '',
    desc: '',
    awards: [],
    vimeoId: '1197480982',
    stillImage: null,
    thumb: '/giltrudes-dwelling-thumb.jpg',
    credit: 'Directed by Jeremy Lutter',
  },
]

function vimeoSrc(id: string, controlsOff = false) {
  const extra = controlsOff ? '&controls=0' : ''
  return `https://player.vimeo.com/video/${id}?autoplay=1&muted=0&color=B8956A&title=0&byline=0&portrait=0&dnt=1${extra}#t=0s`
}

export function StudioPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [info, setInfo] = useState<Film | null>(null)
  const [iframeSrc, setIframeSrc] = useState('')
  const [iframeOn, setIframeOn] = useState(false)
  const [playNonce, setPlayNonce] = useState(0)
  const [stillSrc, setStillSrc] = useState(HERO_STILL)
  const [stillOn, setStillOn] = useState(false)
  const [platoOn, setPlatoOn] = useState(true)

  function openBlackPlato() {
    setIframeSrc('')
    setIframeOn(false)
    setStillSrc(HERO_STILL)
    setStillOn(false)
    setActiveId(null)
    setInfo(null)
    setMuted(false)
    setPlatoOn(true)
  }

  function playVimeo(id: string, controlsOff: boolean, poster: string | null) {
    setPlatoOn(false)
    setMuted(false)
    setStillSrc(poster || HERO_STILL)
    setStillOn(Boolean(poster))
    setPlayNonce((n) => n + 1)
    setIframeOn(false)
    setIframeSrc(vimeoSrc(id, controlsOff))
  }

  function playHeroReel() {
    setActiveId(null)
    setInfo(null)
    playVimeo(HERO_VIMEO, true, HERO_STILL)
  }

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (typeof event.data !== 'string') return
      try {
        const data = JSON.parse(event.data) as { event?: string }
        if (data.event === 'ended' && !activeId) openBlackPlato()
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [activeId])

  function postVimeo(method: string, value?: number | boolean | string) {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    win.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), '*')
  }

  function onHeroIframeLoad() {
    setIframeOn(true)
    postVimeo('addEventListener', 'ended')
  }

  function toggleMute() {
    if (!iframeSrc) {
      playHeroReel()
      return
    }
    const next = !muted
    setMuted(next)
    postVimeo('setVolume', next ? 0 : 1)
    postVimeo('setMuted', next)
  }

  function stopHero() {
    openBlackPlato()
  }

  function playFilm(film: Film) {
    if (film.watchUrl && !film.vimeoId) {
      window.open(film.watchUrl, '_blank', 'noopener,noreferrer')
      return
    }

    setActiveId(film.id)
    setInfo(film)

    if (film.vimeoId) {
      playVimeo(film.vimeoId, false, film.thumb || film.stillImage)
      return
    }

    setIframeOn(false)
    setIframeSrc('')
    setPlatoOn(false)
    if (film.stillImage) {
      setStillSrc(film.stillImage)
      setStillOn(true)
      return
    }

    setStillOn(false)
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
            <span className="sv-house-mark">
              <CityAgeMark tone="ink" size="compact" />
            </span>
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
            <a href="/subscribe" className="sv-subscribe">
              Subscribe
            </a>
          </div>
        </nav>

        {stillOn ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="sv-still" src={stillSrc} alt="" />
        ) : null}
        {iframeSrc ? (
          <iframe
            key={`${iframeSrc}-${playNonce}`}
            ref={iframeRef}
            className={`sv-iframe${iframeOn ? ' sv-visible' : ''}`}
            src={iframeSrc}
            onLoad={onHeroIframeLoad}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="CityAge Studio"
          />
        ) : null}

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

      <div className="sv-cta">
        <div className="sv-cta-name">CityAge Studio</div>
        <div className="sv-cta-lead">We put ideas in motion.</div>
        <p className="sv-cta-text">
          Our documentaries and films have been seen by millions of people. We make films and brands. We take on a few projects a year, by choice.
        </p>
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
            loading="lazy"
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
                <div className="sv-thumb">
                  {film.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={film.thumb} alt="" loading="lazy" />
                  ) : null}
                </div>
                <div className="sv-card-name">{film.title}</div>
                {film.credit ? <div className="sv-card-credit">{film.credit}</div> : null}
              </>
            )

            if (film.watchUrl && !film.vimeoId) {
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
    </div>
  )
}
