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

// Configuration for the 'read' mode — points at a real magazine article.
// Keep this in sync with what's published in the Supabase magazine table.
const READ_OF_THE_WEEK = {
  id: '2ad28ce6-2f2c-44be-98b5-db85dafbed25',
  vertical: 'Money',
  readTime: 8,
  headline: "Mark Carney's Infrastructure Bet Could Reshape Canadian Cities",
  deck: "The Prime Minister's $50 billion infrastructure plan puts urban investment at the centre of economic policy.",
}

// Tier-2 Signal that links to a real article (free deep dive).
const FEATURED_SIGNAL = {
  id: '41365717-a9f4-4d51-b3ff-6b7ed72b938d',
  tag: 'Urban Capital',
  headline: 'Iran War sends borrowing costs surging, squeezing city budgets.',
  teaser:
    'Rising Treasury yields hit housing, infrastructure bonds and municipal finance worldwide.',
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
        <Link className="brand" href="/" aria-label="CITYAGE — Intelligence for the Urban Planet">
          <span className="brand-name">CITYAGE</span>
          <span className="brand-divider" aria-hidden="true">|</span>
          <span className="brand-tagline">Intelligence for the Urban Planet</span>
        </Link>
        <div className="site-header-right">
          <nav className="nav" aria-label="Primary navigation">
            <a href="#signals">Signals</a>
            <a href="#verticals">Verticals</a>
            <a href="#pro">Pro</a>
            <a href="#events">Events</a>
            <a href="#partner">Partner</a>
          </nav>
          <a className="header-cta" href="#signals">
            Get Daily Signals
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
              <p className="eyebrow">Sunday · May 3, 2026</p>
              <h1>The 3% of Earth that runs the world.</h1>
              <p className="hero-subhead">
                Daily intelligence on cities, capital, infrastructure, energy,
                geopolitics and technology.
              </p>
              <div className="hero-actions" aria-label="Primary actions">
                <a className="button primary" href="#signals">
                  Get Daily Signals
                </a>
                <a className="button secondary" href="#pro">
                  Join Pro
                </a>
              </div>
              <p className="hero-readers">
                Read by executives, investors, policymakers and the people
                building the urban century.
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
                  <strong>{READ_OF_THE_WEEK.vertical}</strong> · {READ_OF_THE_WEEK.readTime} min
                </p>
                <h2 id="read-week">{READ_OF_THE_WEEK.headline}</h2>
                <p className="read-deck">{READ_OF_THE_WEEK.deck}</p>
                <Link
                  className="read-cta"
                  href={`/article-preview/${READ_OF_THE_WEEK.id}`}
                  aria-label={`Read full article: ${READ_OF_THE_WEEK.headline}`}
                >
                  Read in full
                </Link>
              </aside>
            )}
          </div>
        </section>

        <section className="trust-bar" aria-label="CITYAGE proof points" data-reveal>
          <div>
            <strong>Since 2012</strong>
            <span>Intelligence and convening</span>
          </div>
          <div>
            <strong>100+ convenings</strong>
            <span>Leaders in the room</span>
          </div>
          <div>
            <strong>50+ cities</strong>
            <span>Global urban markets</span>
          </div>
          <div>
            <strong>75% of global GDP</strong>
            <span>Created and consumed in cities</span>
          </div>
        </section>

        <section className="section signals" id="signals">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Today&rsquo;s Signals</p>
            <h2>What leaders need to know before the day moves.</h2>
            <a href="#pro">See the full briefing</a>
          </div>
          <div className="signal-grid">
            <article className="signal-card lead" data-reveal>
              <span className="tag">AI Infrastructure</span>
              <h3>Power availability is becoming the real AI site selector.</h3>
              <dl>
                <div>
                  <dt>What happened</dt>
                  <dd>New data center commitments are chasing grid-ready regions.</dd>
                </div>
                <div>
                  <dt>Why it matters</dt>
                  <dd>Compute strategy is now energy strategy.</dd>
                </div>
                <div>
                  <dt>Who benefits</dt>
                  <dd>Utilities, landholders, provinces and fast-permitting cities.</dd>
                </div>
                <div>
                  <dt>Next</dt>
                  <dd>Watch transmission queues and sovereign compute incentives.</dd>
                </div>
              </dl>
            </article>

            <Link
              href={`/article-preview/${FEATURED_SIGNAL.id}`}
              className="signal-card linked"
              data-reveal
            >
              <span className="tag">{FEATURED_SIGNAL.tag}</span>
              <h3>{FEATURED_SIGNAL.headline}</h3>
              <p>{FEATURED_SIGNAL.teaser}</p>
              <span className="read-link">Read in full</span>
            </Link>

            {/* Locked Pro card — Defence Cities */}
            <article className="signal-card locked" data-reveal>
              <span className="tag">Defence Cities</span>
              <h3>National security strategy is entering municipal procurement.</h3>
              <p className="preview-fade">
                Ports, airports, water, power and cyber systems are becoming the
                shared operating layer for resilience. The procurement signal
                points to a shift in how federal defence dollars are routed
                through cities&mdash;
              </p>
              <Link className="lock-cta" href="#pro" aria-label="Continue reading with CITYAGE Pro">
                <svg className="lock-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 6V4.5C5 2.567 6.567 1 8.5 1S12 2.567 12 4.5V6h.5A1.5 1.5 0 0 1 14 7.5v6A1.5 1.5 0 0 1 12.5 15h-9A1.5 1.5 0 0 1 2 13.5v-6A1.5 1.5 0 0 1 3.5 6H5zm1 0h5V4.5C11 3.119 9.881 2 8.5 2S6 3.119 6 4.5V6z"/>
                </svg>
                Continue with Pro
              </Link>
            </article>

            <article className="signal-card" data-reveal>
              <span className="tag">Canada-Europe</span>
              <h3>Industrial alliances are being written through city corridors.</h3>
              <p>
                Trade, talent and clean energy ties are turning metros into
                diplomatic infrastructure.
              </p>
            </article>

            {/* Locked Pro card — Ice to Space */}
            <article className="signal-card locked" data-reveal>
              <span className="tag">Ice to Space</span>
              <h3>The Arctic is no longer remote from orbital economics.</h3>
              <p className="preview-fade">
                Ground stations, defence, shipping and resource monitoring are
                converging in northern urban hubs. Three sovereign actors are
                quietly positioning&mdash;
              </p>
              <Link className="lock-cta" href="#pro" aria-label="Continue reading with CITYAGE Pro">
                <svg className="lock-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 6V4.5C5 2.567 6.567 1 8.5 1S12 2.567 12 4.5V6h.5A1.5 1.5 0 0 1 14 7.5v6A1.5 1.5 0 0 1 12.5 15h-9A1.5 1.5 0 0 1 2 13.5v-6A1.5 1.5 0 0 1 3.5 6H5zm1 0h5V4.5C11 3.119 9.881 2 8.5 2S6 3.119 6 4.5V6z"/>
                </svg>
                Continue with Pro
              </Link>
            </article>
          </div>
        </section>

        <section className="section verticals" id="verticals">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Premium Verticals</p>
            <h2>Own the intersections where power is moving.</h2>
          </div>
          <div className="vertical-grid">
            <Link href="/verticals/ice-to-space" data-reveal>
              <span>01</span>
              <h3>Ice to Space</h3>
              <p>
                Arctic cities, orbital systems, defence logistics and northern
                capital.
              </p>
            </Link>
            <Link href="/verticals/canada-europe" data-reveal>
              <span>02</span>
              <h3>Canada-Europe</h3>
              <p>
                Trade corridors, strategic minerals, talent, energy and
                diplomatic networks.
              </p>
            </Link>
            <Link href="/verticals/ai-infrastructure" data-reveal>
              <span>03</span>
              <h3>AI Infrastructure</h3>
              <p>Compute, power, land, permitting, cooling, fiber and sovereign strategy.</p>
            </Link>
            <Link href="/verticals/energy-transition" data-reveal>
              <span>04</span>
              <h3>Energy Transition</h3>
              <p>
                Grid modernization, clean industry, city demand and investable
                projects.
              </p>
            </Link>
            <Link href="/verticals/defence-cities" data-reveal>
              <span>05</span>
              <h3>Defence Cities</h3>
              <p>
                Urban resilience, dual-use procurement and security-critical
                infrastructure.
              </p>
            </Link>
            <Link href="/verticals/urban-capital" data-reveal>
              <span>06</span>
              <h3>Urban Capital</h3>
              <p>Where institutional money meets housing, mobility, ports and power.</p>
            </Link>
          </div>
        </section>

        <section className="section pro" id="pro">
          <div className="pro-copy" data-reveal>
            <p className="eyebrow">CITYAGE Pro</p>
            <h2>
              For executives, investors, policymakers and builders who cannot
              wait for consensus.
            </h2>
            <p>
              Weekly deep briefings, private calls, searchable archives, member
              network access and priority invitations to CITYAGE convenings.
            </p>
            <a
              className="button primary"
              href="mailto:membership@cityage.com?subject=CITYAGE%20Pro%20Access"
            >
              Apply for Access
            </a>
          </div>
          <div className="pro-list" data-reveal>
            <div>
              <strong>Weekly briefings</strong>
              <span>Signal, consequence, next move.</span>
            </div>
            <div>
              <strong>Private calls</strong>
              <span>Member-only conversations with operators and policy leaders.</span>
            </div>
            <div>
              <strong>Archives</strong>
              <span>Find the pattern before it becomes consensus.</span>
            </div>
            <div>
              <strong>Priority events</strong>
              <span>Rooms built around decisions, not panels.</span>
            </div>
          </div>
        </section>

        <section className="section events" id="events">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Events Engine</p>
            <h2>Rooms where capital, policy and infrastructure meet.</h2>
          </div>
          <div className="event-list">
            <article data-reveal>
              <time dateTime="2026-05">May 2026</time>
              <h3>Canada Europe Connects</h3>
              <p>
                Invite-only summit on Canada-Europe trade, defence and dual-use
                technology.
              </p>
              <span>Ottawa</span>
            </article>
            <article data-reveal>
              <time dateTime="2026-09">September 2026</time>
              <h3>Canada-Europe Urban Corridor</h3>
              <p>
                Strategic industries, capital formation, ports, energy and city
                diplomacy.
              </p>
              <span>London</span>
            </article>
            <article data-reveal>
              <time dateTime="2026-11">November 2026</time>
              <h3>Ice to Space Forum</h3>
              <p>
                Northern cities, orbital infrastructure, defence logistics and
                resource intelligence.
              </p>
              <span>Ottawa</span>
            </article>
          </div>
        </section>

        <section className="partner kp" id="partner" data-reveal>
          <div className="kp-intro">
            <p className="eyebrow">Become a Knowledge Partner</p>
            <h2>Build your franchise on the Urban Planet.</h2>
            <p>
              CityAge Knowledge Partners co-build a vertical inside our platform.
              You bring the strategic priority. We bring the intelligence
              pipeline, the editorial voice, the convening engine and the
              network of decision-makers we&rsquo;ve built over fifteen years.
            </p>
          </div>
          <div className="kp-pillars">
            <div>
              <strong>Signal</strong>
              <span>A branded weekly intelligence brief in your domain, in the CityAge voice.</span>
            </div>
            <div>
              <strong>Campaign</strong>
              <span>An editorial push around your strategic priority — research, reporting, briefings.</span>
            </div>
            <div>
              <strong>Event</strong>
              <span>An invite-only convening on your topic. Chatham House, fifty to one hundred leaders.</span>
            </div>
            <div>
              <strong>Network</strong>
              <span>Curated introductions inside our 25,000+ decision-maker base.</span>
            </div>
          </div>
          <a
            className="button secondary dark kp-cta"
            href="mailto:partners@cityage.com?subject=Knowledge%20Partner%20Inquiry"
          >
            Apply to Partner
          </a>
        </section>
      </main>

      <footer className="footer">
        <Link className="brand" href="/">
          <span className="brand-name">CITYAGE</span>
          <span className="brand-divider" aria-hidden="true">|</span>
          <span className="brand-tagline">Intelligence for the Urban Planet</span>
        </Link>
        <nav aria-label="Footer navigation">
          <a href="#signals">Signals</a>
          <a href="#pro">Pro</a>
          <a href="#events">Events</a>
          <a href="#partner">Partner</a>
        </nav>
      </footer>
    </div>
  )
}
