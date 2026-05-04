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
            <a href="/verticals/ice-to-space">Verticals</a>
            <a href="#events">Events</a>
            <a href="#partner">Partner</a>
          </nav>
          <a className="header-cta" href="#signals">
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
              <p className="eyebrow">Sunday · May 3, 2026</p>
              <h1>The 3% of Earth that runs the world.</h1>
              <p className="hero-subhead">
                The continuous intelligence brief on the Urban Planet — where
                75%+ of global GDP, population and consumption is concentrated.
              </p>
              <div className="hero-actions" aria-label="Primary actions">
                <a className="button primary" href="#signals">
                  Subscribe
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
            <strong>25K+ subscribers</strong>
            <span>Decision-makers reading daily</span>
          </div>
        </section>

        <section className="section signals" id="signals">
          <div className="section-head" data-reveal>
            <p className="eyebrow">
              Updated 6:00 AM Vancouver · 9:00 AM Washington · 3:00 PM Brussels · 9:00 PM Singapore
            </p>
            <h2>Signals from the Urban Planet.</h2>
          </div>
          <div className="signal-grid">
            {/* Lead signal — full structured brief, headline links to detail page */}
            <Link
              href="/signals/ai-power-site-selector"
              className="signal-card lead"
              data-reveal
            >
              <div className="bucket-row">
                <span className="bucket">Frontiers</span>
                <span className="timestamp">2h ago</span>
              </div>
              <h3>Power availability is becoming the real AI site selector.</h3>
              <div className="rows">
                <div>
                  <span className="row-label">What happened</span>
                  <p className="row-body">
                    New data center commitments are chasing grid-ready regions.
                    Hyperscalers and sovereign compute funds are bypassing
                    traditional tech hubs for places with surplus baseload.
                  </p>
                </div>
                <div>
                  <span className="row-label">Why it matters</span>
                  <p className="row-body">
                    Compute strategy is now energy strategy. Cities with grid
                    capacity will capture the next wave of trillion-dollar
                    industrial infrastructure.
                  </p>
                </div>
                <div>
                  <span className="row-label">Who benefits</span>
                  <p className="row-body">
                    Utilities, provincial regulators, fast-permitting cities,
                    and landholders adjacent to high-capacity transmission.
                  </p>
                </div>
                <div className="row-premium">
                  <span className="row-label">
                    What&rsquo;s next
                    <span className="pro-stamp">Pro &middot; Free preview</span>
                  </span>
                  <p className="row-body">
                    Watch transmission queues, sovereign compute incentives,
                    and the first wave of provincial industrial strategies
                    explicitly tying AI investment to grid permits.
                  </p>
                </div>
              </div>
              <span className="vertical-chip">AI Infrastructure</span>
            </Link>

            {/* Tier 2 — standard signal, links to article */}
            <Link
              href={`/article-preview/${FEATURED_SIGNAL.id}`}
              className="signal-card"
              data-reveal
            >
              <div className="bucket-row">
                <span className="bucket">Money</span>
                <span className="timestamp">This morning</span>
              </div>
              <h3>Iran War sends borrowing costs surging, squeezing city budgets.</h3>
              <div className="rows">
                <div>
                  <span className="row-label">What happened</span>
                  <p className="row-body">
                    Treasury yields jumped on Middle East risk. Municipal
                    bond spreads widened across North America and Europe.
                  </p>
                </div>
                <div>
                  <span className="row-label">Why it matters</span>
                  <p className="row-body">
                    Cities funding housing and infrastructure on long-dated
                    debt now face higher interest costs at the worst time.
                  </p>
                </div>
                <div className="row-premium">
                  <span className="row-label">
                    What&rsquo;s next
                    <span className="pro-stamp">Pro &middot; Free preview</span>
                  </span>
                  <p className="row-body">
                    Expect a wave of paused capital projects and renewed
                    pressure on federal infrastructure backstops in Q3.
                  </p>
                </div>
              </div>
              <span className="vertical-chip">Urban Capital</span>
              <span className="read-more">Read in full</span>
            </Link>

            {/* Tier 3 — Pro locked, third row gated */}
            <article className="signal-card locked" data-reveal>
              <div className="bucket-row">
                <span className="bucket">Power</span>
                <span className="timestamp">Yesterday</span>
              </div>
              <h3>National security strategy is entering municipal procurement.</h3>
              <div className="rows">
                <div>
                  <span className="row-label">What happened</span>
                  <p className="row-body">
                    Ports, airports, water, power and cyber are being
                    rewritten as shared resilience infrastructure across
                    Canada and NATO.
                  </p>
                </div>
                <div>
                  <span className="row-label">Why it matters</span>
                  <p className="row-body">
                    Federal defence dollars are rerouting through cities
                    able to host dual-use procurement at scale.
                  </p>
                </div>
                <div className="row-premium">
                  <span className="row-label">
                    What&rsquo;s next
                  </span>
                  <p className="row-body">
                    Three procurement signals point to where the next
                    $40 billion of defence-resilience capital will land
                    over the next eighteen months. The shortlist already
                    includes&mdash;
                  </p>
                </div>
              </div>
              <Link className="lock-cta" href="mailto:membership@cityage.com?subject=CITYAGE%20Subscribe" aria-label="Subscribe to CITYAGE for full access">
                <svg className="lock-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 6V4.5C5 2.567 6.567 1 8.5 1S12 2.567 12 4.5V6h.5A1.5 1.5 0 0 1 14 7.5v6A1.5 1.5 0 0 1 12.5 15h-9A1.5 1.5 0 0 1 2 13.5v-6A1.5 1.5 0 0 1 3.5 6H5zm1 0h5V4.5C11 3.119 9.881 2 8.5 2S6 3.119 6 4.5V6z"/>
                </svg>
                Continue with Pro
              </Link>
              <span className="vertical-chip">Defence Cities</span>
            </article>

            {/* Tier 2 — standard signal */}
            <Link
              href="/signals/canada-europe-industrial-corridors"
              className="signal-card"
              data-reveal
            >
              <div className="bucket-row">
                <span className="bucket">Power</span>
                <span className="timestamp">5h ago</span>
              </div>
              <h3>Industrial alliances are being written through city corridors.</h3>
              <div className="rows">
                <div>
                  <span className="row-label">What happened</span>
                  <p className="row-body">
                    Canada and three EU member states quietly aligned
                    procurement timelines on critical minerals and
                    dual-use technology.
                  </p>
                </div>
                <div>
                  <span className="row-label">Why it matters</span>
                  <p className="row-body">
                    Trade is now industrial policy. Metros become the
                    operational unit of trans-Atlantic alliance.
                  </p>
                </div>
                <div className="row-premium">
                  <span className="row-label">
                    What&rsquo;s next
                    <span className="pro-stamp">Pro &middot; Free preview</span>
                  </span>
                  <p className="row-body">
                    Watch the Ottawa-Berlin-Helsinki track and the
                    minerals MOU expected before fall.
                  </p>
                </div>
              </div>
              <span className="vertical-chip">Canada-Europe</span>
              <span className="read-more">Read in full</span>
            </Link>

            {/* Tier 3 — Pro locked */}
            <article className="signal-card locked" data-reveal>
              <div className="bucket-row">
                <span className="bucket">Frontiers</span>
                <span className="timestamp">Yesterday</span>
              </div>
              <h3>The Arctic is no longer remote from orbital economics.</h3>
              <div className="rows">
                <div>
                  <span className="row-label">What happened</span>
                  <p className="row-body">
                    Ground stations, defence, shipping and resource
                    monitoring are converging in northern urban hubs
                    from Inuvik to Tromsø.
                  </p>
                </div>
                <div>
                  <span className="row-label">Why it matters</span>
                  <p className="row-body">
                    Arctic sovereignty is becoming an orbital infrastructure
                    play. Capital is following.
                  </p>
                </div>
                <div className="row-premium">
                  <span className="row-label">
                    What&rsquo;s next
                  </span>
                  <p className="row-body">
                    Three sovereign actors are positioning ahead of the
                    NATO Arctic council meetings. The deal flow we are
                    tracking suggests a window opens in&mdash;
                  </p>
                </div>
              </div>
              <Link className="lock-cta" href="mailto:membership@cityage.com?subject=CITYAGE%20Subscribe" aria-label="Subscribe to CITYAGE for full access">
                <svg className="lock-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 6V4.5C5 2.567 6.567 1 8.5 1S12 2.567 12 4.5V6h.5A1.5 1.5 0 0 1 14 7.5v6A1.5 1.5 0 0 1 12.5 15h-9A1.5 1.5 0 0 1 2 13.5v-6A1.5 1.5 0 0 1 3.5 6H5zm1 0h5V4.5C11 3.119 9.881 2 8.5 2S6 3.119 6 4.5V6z"/>
                </svg>
                Continue with Pro
              </Link>
              <span className="vertical-chip">Ice to Space</span>
            </article>
          </div>
        </section>

        <section className="events-strip" id="events" data-reveal>
          <div className="events-strip-head">
            <p className="eyebrow">Upcoming convenings</p>
          </div>
          <div className="events-strip-list">
            <a href="https://www.tickettailor.com/events/cityage/2062411" target="_blank" rel="noopener">
              <time dateTime="2026-05-26">May 26, 2026</time>
              <strong>Canada Europe Connects</strong>
              <span>Ottawa</span>
              <em>Invite only</em>
            </a>
            <a href="#partner">
              <time dateTime="2026-09">September 2026</time>
              <strong>Canada-Europe Urban Corridor</strong>
              <span>London</span>
              <em>Coming</em>
            </a>
            <a href="#partner">
              <time dateTime="2026-11">November 2026</time>
              <strong>Ice to Space Forum</strong>
              <span>Ottawa</span>
              <em>Coming</em>
            </a>
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
          <a href="#events">Events</a>
          <a href="#partner">Partner</a>
        </nav>
      </footer>
    </div>
  )
}
