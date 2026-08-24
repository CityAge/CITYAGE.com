'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import './redesign.css'

const HERO_IMAGES = [
  { src: '/cityage-hero.png', alt: 'Skyline at dawn — boardroom view of the urban planet.' },
  { src: '/parliament-sunset.jpg', alt: 'Parliament Hill at golden hour.' },
]

const HERO_ROTATION_MS = 7000

// =====================================================
// Hero-side panel mode: 'moves' or 'read'
// Flip this single line to swap which card appears in the
// top-right slot next to the hero image.
//
// 'moves' = Today's 5 Moves (daily intelligence pulse)
// 'read'  = This Week's Read (single feature callout)
//
// Future modes can be added: 'event-countdown', 'editor-note', 'pro-brief'
// =====================================================
const PANEL_MODE: 'moves' | 'read' = 'read'

// Door stories are rooms already in the repo — not invented breaking news.
const READ_OF_THE_WEEK = {
  href: '/northern-century.html',
  vertical: 'Northern Century',
  readTime: 'The room',
  headline: 'The Northern Century',
  deck: 'Ideas and investments in the new geography of power.',
}

export default function HomePage() {
  // Hero rotation
  const [activeHero, setActiveHero] = useState(0)

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return
    const interval = setInterval(() => {
      setActiveHero((i) => (i + 1) % HERO_IMAGES.length)
    }, HERO_ROTATION_MS)
    return () => clearInterval(interval)
  }, [])

  // Fade-in-on-scroll for elements with data-reveal
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="cityage-redesign">
      <header className="site-header" data-reveal>
        <Link className="brand" href="/" aria-label="CITYAGE — everything happens on earth's 2%.">
          <span className="brand-name">CITYAGE</span>
          <span className="brand-divider" aria-hidden="true">|</span>
          <span className="brand-tagline">everything happens on earth&apos;s 2%.</span>
        </Link>
        <div className="site-header-right">
          <nav className="nav" aria-label="Primary navigation">
            <a href="/purpose">Purpose</a>
            <a href="#rooms">The Rooms</a>
          </nav>
          <a className="header-cta" href="#subscribe">
            Subscribe
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-media" aria-hidden="true">
            {HERO_IMAGES.map((hero, i) => (
              <div
                key={hero.src}
                className={`hero-slide ${i === activeHero ? 'active' : ''}`}
              >
                <Image
                  src={hero.src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
          <div className="hero-grid">
            <div className="hero-copy" data-reveal>
              <p className="eyebrow">Miro Cernetig, Publisher</p>
              <h1>We live on the urban planet.</h1>
              <p className="hero-subhead">
                Two percent of Earth. Everything happens here.
              </p>
              <div className="hero-actions" aria-label="Primary actions">
                <a className="button primary" href="#subscribe">
                  Subscribe
                </a>
                <a className="button secondary" href="#rooms">
                  Enter the rooms
                </a>
              </div>
              <p className="hero-readers">
                CityAge is the small rooms, drawn from 20,000 leaders. Come do the work.
              </p>
            </div>

            {PANEL_MODE === 'moves' ? (
              <aside className="moves-panel" aria-labelledby="today-moves" data-reveal>
                <div className="panel-kicker">Today</div>
                <h2 id="today-moves">5 Moves</h2>
                <ol className="moves-list">
                  <li>
                    <span>01</span>
                    <p>Port capital shifts toward Arctic-linked logistics.</p>
                  </li>
                  <li>
                    <span>02</span>
                    <p>Grid demand becomes the next AI infrastructure bottleneck.</p>
                  </li>
                  <li>
                    <span>03</span>
                    <p>Defence procurement moves closer to city-scale resilience.</p>
                  </li>
                  <li>
                    <span>04</span>
                    <p>Canada-Europe corridor gains industrial policy urgency.</p>
                  </li>
                  <li>
                    <span>05</span>
                    <p>Urban capital hunts for predictable infrastructure yield.</p>
                  </li>
                </ol>
              </aside>
            ) : (
              <aside className="read-panel" aria-labelledby="read-week" data-reveal>
                <div className="panel-kicker">The Read</div>
                <p className="read-meta">
                  <strong>{READ_OF_THE_WEEK.vertical}</strong> · {READ_OF_THE_WEEK.readTime}
                </p>
                <h2 id="read-week">{READ_OF_THE_WEEK.headline}</h2>
                <p className="read-deck">{READ_OF_THE_WEEK.deck}</p>
                <Link
                  className="read-cta"
                  href={READ_OF_THE_WEEK.href}
                  aria-label={`Enter the room: ${READ_OF_THE_WEEK.headline}`}
                >
                  Enter the room
                </Link>
              </aside>
            )}
          </div>
        </section>

        <section className="section signals" id="rooms">
          <div className="section-head" data-reveal>
            <p className="eyebrow">
              The rooms
            </p>
            <h2>Enter the rooms.</h2>
          </div>
          <div className="signal-grid">
            <Link
              href="/northern-century.html"
              className="signal-card lead"
              data-reveal
            >
              <div className="bucket-row">
                <span className="bucket">Northern Century</span>
                <span className="timestamp">The room</span>
              </div>
              <h3>Ideas and investments in the new geography of power.</h3>
              <div className="rows">
                <div>
                  <span className="row-label">The room</span>
                  <p className="row-body">
                    The Arctic and northern hemisphere — where capital,
                    sovereignty, and infrastructure now meet.
                  </p>
                </div>
                <div>
                  <span className="row-label">Why it is a room</span>
                  <p className="row-body">
                    A non-partisan network of the leaders, investors, and
                    innovators building what comes next in the North.
                  </p>
                </div>
              </div>
              <span className="vertical-chip">Enter the room</span>
            </Link>

            <article className="signal-card editor" data-reveal>
              <div className="bucket-row">
                <span className="bucket">From the Publisher</span>
                <span className="timestamp">Miro Cernetig</span>
              </div>
              <h3>We live on the urban planet.</h3>
              <p className="editor-body">
                Two percent of Earth. Everything happens here. CityAge is
                the small rooms, drawn from 20,000 leaders. Come do the work.
              </p>
              <div className="byline">
                <div className="portrait">
                  <Image
                    src="/miro-cernetig.png"
                    alt="Miro Cernetig"
                    fill
                    sizes="44px"
                  />
                </div>
                <div>
                  <span className="byline-name">Miro Cernetig</span>
                  <span className="byline-title">Publisher</span>
                </div>
              </div>
            </article>

            <Link
              href="/next-vancouver.html"
              className="signal-card"
              data-reveal
            >
              <div className="bucket-row">
                <span className="bucket">Next West</span>
                <span className="timestamp">The room</span>
              </div>
              <h3>The Next Vancouver — the Pacific room.</h3>
              <div className="rows">
                <div>
                  <span className="row-label">The room</span>
                  <p className="row-body">
                    The leaders deciding what this coast builds next —
                    ministers, mayors, investors, scientists, and the
                    executives in the room.
                  </p>
                </div>
                <div>
                  <span className="row-label">Why it is a room</span>
                  <p className="row-body">
                    The Next Metro Vancouver, in partnership with The
                    Vancouver Sun. A CityAge room, not a conference landing.
                  </p>
                </div>
              </div>
              <span className="vertical-chip">Enter the room</span>
              <span className="read-more">The Next Vancouver</span>
            </Link>

            <Link
              href="#subscribe"
              className="signal-card"
              data-reveal
            >
              <div className="bucket-row">
                <span className="bucket">The Influence Letter</span>
                <span className="timestamp">Subscribe</span>
              </div>
              <h3>Intelligence on infrastructure, defence, space, energy, and food systems.</h3>
              <div className="rows">
                <div>
                  <span className="row-label">The brief</span>
                  <p className="row-body">
                    Delivered before markets open. The door into the rooms.
                  </p>
                </div>
                <div>
                  <span className="row-label">The ask</span>
                  <p className="row-body">
                    Subscribe. Enter the rooms.
                  </p>
                </div>
              </div>
              <span className="vertical-chip">Subscribe free</span>
              <span className="read-more">The Influence Letter</span>
            </Link>
          </div>
        </section>

        <section className="events-strip" id="subscribe" data-reveal>
          <div className="events-strip-head">
            <p className="eyebrow">Subscribe · Enter the rooms</p>
          </div>
          <div className="events-strip-list">
            <a href="/northern-century.html">
              <time dateTime="2026">The room</time>
              <strong>Northern Century</strong>
              <span>Arctic &amp; North</span>
              <em>Enter</em>
            </a>
            <a href="/next-vancouver.html">
              <time dateTime="2026">The room</time>
              <strong>Next West</strong>
              <span>The Next Vancouver</span>
              <em>Enter</em>
            </a>
            <a href="#subscribe">
              <time dateTime="2026">Daily</time>
              <strong>The Influence Letter</strong>
              <span>Subscribe</span>
              <em>Free</em>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <Link className="brand" href="/">
          <span className="brand-name">CITYAGE</span>
          <span className="brand-divider" aria-hidden="true">|</span>
          <span className="brand-tagline">everything happens on earth&apos;s 2%.</span>
        </Link>
        <nav aria-label="Footer navigation">
          <a href="/purpose">Purpose</a>
          <a href="#rooms">The Rooms</a>
          <a href="#subscribe">Subscribe</a>
        </nav>
      </footer>
    </div>
  )
}
