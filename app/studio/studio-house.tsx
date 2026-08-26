'use client'

import { useState } from 'react'
import './studio.css'

const HOUSE = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/partners', label: 'Partners' },
  { href: '/studio', label: 'Studio' },
]

const LOGOS = [
  'aporto.jpg',
  'pbs.jpg',
  'baddass.jpg',
  'cannes.jpg',
  'cbc.jpg',
  'cordillera.jpg',
  'economi.jpg',
  'feratum.jpg',
  'leo.jpg',
  'long.jpg',
  'natgeo.jpg',
  'sonoma.jpg',
  'nyt.jpg',
  'tiff.jpg',
  'canal.jpg',
  'victoria.jpg',
  '60.jpg',
].map((file) => `/studio/logos/${file}`)

const FILMS = [
  {
    title: 'Facing Saddam',
    deck: "A sobering depiction of the 'Butcher of Baghdad', cast in the hollows of the impressions he left on survivors of both his terror and his love.",
    poster: '/studio/posters-saddam.jpg',
    trailer: null as null | { kind: 'hosted' | 'youtube'; src: string },
  },
  {
    title: 'Solar Earth',
    deck: 'Corporate Video for Solar Earth Canada',
    poster: '/studio/posters-solarearth.jpg',
    trailer: {
      kind: 'hosted' as const,
      src: '/studio/Solar-Earth.mp4',
    },
  },
  {
    title: "Giltrude's Dwelling",
    deck: 'Orphaned at the age of 11, Giltrude, an interdimensional shut-in, has waited 15 years for her parents to come home. When a life or death dilemma comes knocking, Giltrude must look beyond her front door and face the outside universe.',
    poster: '/studio/posters-giltrude.jpg',
    trailer: {
      kind: 'youtube' as const,
      src: 'https://www.youtube.com/embed/WHe2jtngaSY?autoplay=1',
    },
  },
]

export function StudioHouse() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [playingHero, setPlayingHero] = useState(false)
  const [trailer, setTrailer] = useState<(typeof FILMS)[number]['trailer']>(null)

  return (
    <div className="studio-live">
      <div className="studio-live-bar">
        <a href="/" className="studio-live-mark">CityAge</a>
        <nav className="studio-live-links" aria-label="House">
          {HOUSE.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.href === '/studio' ? 'is-here' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="studio-live-burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            {menuOpen ? (
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <nav className="studio-live-drawer" aria-label="House">
          {HOUSE.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.href === '/studio' ? 'is-here' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}

      <section className="studio-live-hero" aria-label="CityAge Studio">
        {playingHero ? (
          <video
            src="/studio/CA-studio.mp4"
            poster="/studio/CAstudio-vid.png"
            controls
            autoPlay
            playsInline
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/studio/CAstudio-vid.png" alt="CITYAGE STUDIO" />
            <button type="button" className="studio-live-play" aria-label="Play Video" onClick={() => setPlayingHero(true)}>
              <svg viewBox="0 0 512 512" aria-hidden="true">
                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z" />
              </svg>
            </button>
          </>
        )}
      </section>

      <section className="studio-live-strip" aria-label="Festivals and broadcasters">
        <div className="studio-live-strip-track">
          {[...LOGOS, ...LOGOS].map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${src}-${i}`} src={src} alt="" />
          ))}
        </div>
      </section>

      <section className="studio-live-intro">
        <h1>CityAge Studio: End-to-End Storytelling.</h1>
        <p>
          CityAge Studio combines cutting-edge AI tools with the creative expertise of professionals who have worked with some of the world’s top brands. Every piece of content we produce—whether documentaries, teaser reels, or thought leadership materials—is original and crafted by humans.
        </p>
        <p>
          We also host events that engage a network of more than 25,000 leaders and excel at earned media, with our work featured in The New York Times, The Wall Street Journal, The Globe and Mail, the BBC, CBC, National Geographic, The Economist, 60 Minutes, and many other leading outlets.
        </p>
      </section>

      {FILMS.map((film) => (
        <section
          key={film.title}
          className="studio-live-film"
          style={{ backgroundImage: `url(${film.poster})` }}
          aria-label={film.title}
        >
          <div className="studio-live-film-copy">
            <h2>{film.title}</h2>
            <p>{film.deck}</p>
            {film.trailer && (
              <button type="button" className="studio-live-trailer" onClick={() => setTrailer(film.trailer)}>
                <svg viewBox="0 0 512 512" aria-hidden="true">
                  <path d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z" />
                </svg>
                View trailer
              </button>
            )}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="studio-live-film-still" src={film.poster} alt="" />
        </section>
      ))}

      {trailer && (
        <div className="studio-live-modal" role="dialog" aria-modal="true">
          <button type="button" className="studio-live-modal-close" onClick={() => setTrailer(null)}>
            Close
          </button>
          <div className="studio-live-modal-inner">
            {trailer.kind === 'hosted' ? (
              <video src={trailer.src} controls autoPlay playsInline />
            ) : (
              <iframe
                src={trailer.src}
                title="Trailer"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      <div className="studio-live-end">
        <a href="mailto:info@cityage.com">info@cityage.com</a>
      </div>
    </div>
  )
}
