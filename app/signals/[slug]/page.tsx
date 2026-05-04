import Link from 'next/link'
import { notFound } from 'next/navigation'
import '../../redesign.css'

export const dynamic = 'force-dynamic'

/**
 * Signal detail pages.
 *
 * Every Signal card on the homepage promises a destination. This page
 * is that destination — a fuller version of the structured brief
 * (What happened / Why it matters / Who benefits / What's next),
 * with sources and related signals where available.
 *
 * For now, signals are configured statically in the SIGNALS map.
 * Once we wire the homepage Signal grid to the Supabase `signals`
 * table (or `documents` with promoted=true), this page will fetch
 * the same record by slug.
 */

type SignalRow = {
  label: string
  body: string
  premium?: boolean
}

type SignalConfig = {
  slug: string
  bucket: 'Power' | 'Money' | 'Cities' | 'Frontiers' | 'Culture'
  vertical?: string
  headline: string
  dek?: string
  publishedAt?: string
  rows: SignalRow[]
  sources?: { title: string; url: string }[]
}

const SIGNALS: Record<string, SignalConfig> = {
  'ai-power-site-selector': {
    slug: 'ai-power-site-selector',
    bucket: 'Frontiers',
    vertical: 'AI Infrastructure',
    headline: 'Power availability is becoming the real AI site selector.',
    dek: 'Compute strategy is now energy strategy. The next trillion dollars of AI infrastructure will follow grid permits, not tax breaks.',
    publishedAt: '2026-05-03',
    rows: [
      {
        label: 'What happened',
        body: 'New hyperscaler data center commitments and sovereign compute funds are bypassing traditional tech hubs in favour of regions with surplus baseload power and faster transmission permitting. Three jurisdictions in particular — Quebec, Texas, and the Nordics — are absorbing what would, even three years ago, have gone to Northern California or the Pacific Northwest. The pattern reflects a hard constraint: in the second half of this decade, AI compute scales with electrons, not incentives.',
      },
      {
        label: 'Why it matters',
        body: "Cities and provinces with grid capacity will capture the next wave of trillion-dollar industrial infrastructure. Those without will lose AI investment to neighbours, regardless of talent density. The decision is becoming permanent: a gigawatt-scale data center campus is a thirty-year commitment that locks in tax base, employment, and political weight. Energy policy and AI policy have collapsed into one question — and the cities answering it first will define the next decade.",
      },
      {
        label: 'Who benefits',
        body: 'Utilities able to add new generation quickly. Provincial regulators willing to pre-approve transmission. Cities with reusable industrial sites and fast permitting culture. Landholders adjacent to high-capacity transmission corridors. Sovereign wealth funds writing checks for grid-tied compute infrastructure as a long-duration asset class.',
      },
      {
        label: "What's next",
        body: 'Watch transmission queue prioritization in Ontario, Texas, and the Nordics. Watch sovereign compute incentives announced by Canada, the UAE, and Singapore in Q3. Expect at least one Canadian province to issue an explicit "AI infrastructure" industrial strategy tying provincial permits, hydro contracts, and federal innovation funding into a single offer to hyperscalers. The corridor that wins will set the template.',
        premium: true,
      },
    ],
  },
  'canada-europe-industrial-corridors': {
    slug: 'canada-europe-industrial-corridors',
    bucket: 'Power',
    vertical: 'Canada-Europe',
    headline: 'Industrial alliances are being written through city corridors.',
    dek: 'Trade is becoming industrial policy. Metros are emerging as the operational unit of trans-Atlantic alliance.',
    publishedAt: '2026-05-03',
    rows: [
      {
        label: 'What happened',
        body: 'Canada and three EU member states quietly aligned procurement timelines on critical minerals and dual-use technology over the past quarter, working through trade attachés and provincial economic development agencies rather than capital-to-capital diplomatic channels. The result is a working industrial roadmap covering rare earth processing, defence-grade semiconductors, and hydrogen — anchored in Ottawa, Berlin, Helsinki, and a handful of mid-sized industrial cities.',
      },
      {
        label: 'Why it matters',
        body: 'Trade is no longer about tariffs and ports — it is about who can deliver strategic capability fast. Metros are becoming the operational unit of alliance because they hold the labour, the planning capacity, and the existing industrial base. Federal governments draw the lines; cities execute. CityAge readers should expect more deals to bypass the WTO frame entirely in favour of city-to-city industrial pacts with national backing.',
      },
      {
        label: 'Who benefits',
        body: 'Mid-sized industrial cities with port access and trades capacity. Provinces and Länder able to commit infrastructure dollars on procurement-aligned timelines. Critical minerals processors. Dual-use defence manufacturers. Universities embedded in trans-Atlantic research alliances.',
      },
      {
        label: "What's next",
        body: 'Watch the Ottawa-Berlin-Helsinki track for an explicit industrial cooperation agreement before fall, likely announced around the NATO industrial policy meetings. Watch for a critical minerals MOU between Canada and Germany that names specific processing sites. Expect Canada Europe Connects in Ottawa on May 26 to surface several of the operators making this happen.',
        premium: true,
      },
    ],
  },
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-CA', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Toronto',
    })
  } catch {
    return ''
  }
}

export default async function SignalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const signal = SIGNALS[slug]
  if (!signal) notFound()

  return (
    <div className="cityage-redesign">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="CITYAGE — Intelligence for the Urban Planet">
          <span className="brand-name">CITYAGE</span>
          <span className="brand-divider" aria-hidden="true">|</span>
          <span className="brand-tagline">Intelligence for the Urban Planet</span>
        </Link>
        <div className="site-header-right">
          <nav className="nav" aria-label="Primary navigation">
            <a href="/#signals">Signals</a>
            <a href="/#verticals">Verticals</a>
            <a href="/#pro">Pro</a>
            <a href="/#events">Events</a>
            <a href="/#partner">Partner</a>
          </nav>
          <a className="header-cta" href="/#pro">
            Join Pro
          </a>
        </div>
      </header>

      <article className="article-page">
        <div className="article-hero">
          <div className="article-hero-inner">
            <div className="article-meta">
              <span className="vertical-tag">{signal.bucket}</span>
              {signal.vertical && (
                <>
                  <span className="separator">/</span>
                  <span>{signal.vertical}</span>
                </>
              )}
              {signal.publishedAt && (
                <>
                  <span className="separator">/</span>
                  <span>{formatDate(signal.publishedAt)}</span>
                </>
              )}
              <span className="separator">/</span>
              <span>Signal</span>
            </div>

            <h1 className="article-headline">{signal.headline}</h1>

            {signal.dek && <p className="article-deck">{signal.dek}</p>}

            <div className="article-byline">
              <span>
                By <strong>CITYAGE Editorial</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="article-body">
          {signal.rows.map((row) => (
            <section key={row.label} style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6f1622',
                marginTop: 0,
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                {row.label}
                {row.premium && (
                  <span className="pro-stamp">Pro &middot; Free preview</span>
                )}
              </h2>
              <p style={{ marginTop: 0 }}>{row.body}</p>
            </section>
          ))}
        </div>

        <div className="article-footer">
          <hr className="article-footer-divider" />
          <Link className="article-back" href="/#signals">
            ← All signals
          </Link>
        </div>
      </article>

      <footer className="footer">
        <Link className="brand" href="/">
          <span className="brand-name">CITYAGE</span>
          <span className="brand-divider" aria-hidden="true">|</span>
          <span className="brand-tagline">Intelligence for the Urban Planet</span>
        </Link>
        <nav aria-label="Footer navigation">
          <a href="/#signals">Signals</a>
          <a href="/#pro">Pro</a>
          <a href="/#events">Events</a>
          <a href="/#partner">Partner</a>
        </nav>
      </footer>
    </div>
  )
}
