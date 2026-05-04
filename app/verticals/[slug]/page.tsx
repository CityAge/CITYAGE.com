import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '../../redesign.css'

export const revalidate = 60
export const dynamic = 'force-dynamic'

/**
 * Premium Vertical pages.
 *
 * One template, configurable per slug via the VERTICALS map below.
 *
 * Verticals with `articleIds` populated render as full pages with an archive.
 * Verticals without articleIds render as thin "Coming Soon" pages — the
 * thesis is named, but the archive doesn't yet exist.
 *
 * Articles come from the existing Supabase magazine table; no new schema.
 * To launch a vertical fully, populate articleIds with real published IDs.
 */

type VerticalConfig = {
  slug: string
  name: string
  thesis: string
  description: string
  stats?: { value: string; label: string }[]
  articleIds?: string[]
}

const VERTICALS: Record<string, VerticalConfig> = {
  'ice-to-space': {
    slug: 'ice-to-space',
    name: 'Ice to Space',
    thesis:
      'Where Arctic cities, orbital systems, defence logistics and northern capital meet.',
    description:
      "CityAge tracks the convergence of Arctic sovereignty, orbital infrastructure, dual-use defence procurement and northern capital flows — the new frontier where security, technology and city-scale economies are being rewritten. Canada, Nordic states, NATO and a new generation of space and defence operators are rebuilding the rules.",
    stats: [
      { value: '$70B', label: "Canada's projected Arctic spend" },
      { value: 'NATO', label: 'Northern flank in focus' },
      { value: 'Daily', label: 'Signal cadence (launching 2026)' },
    ],
    articleIds: [
      'fc7e0d16-f930-48a1-96bf-ca5caaf3a841', // NATO's Arctic Strategy
      '489c255c-5f38-44f8-9aef-2720fb57f06d', // Institutional Capital Floods Space
      'b15af7d3-a188-430a-832f-6b94a0a88496', // SpaceX Starshield NATO Eyes
      '38b936bd-29d1-4c95-9c7b-3775b0134e33', // $200B Defence Procurement
    ],
  },
  'canada-europe': {
    slug: 'canada-europe',
    name: 'Canada-Europe',
    thesis:
      'Trade corridors, strategic minerals, talent, energy and diplomatic networks.',
    description:
      'The Canada-Europe corridor is becoming industrial policy. Critical minerals, dual-use technology, defence procurement and clean energy partnerships are turning trans-Atlantic ties into a coordinated industrial alliance — and Canada Europe Connects is where the players in this corridor meet.',
    stats: [
      { value: 'CEC', label: 'Ottawa · May 26, 2026' },
      { value: '100+', label: 'Decision-makers in the room' },
      { value: 'Trans-Atlantic', label: 'Industrial alliance focus' },
    ],
  },
  'ai-infrastructure': {
    slug: 'ai-infrastructure',
    name: 'AI Infrastructure',
    thesis:
      'Compute, power, land, permitting, cooling, fiber and sovereign strategy.',
    description:
      'AI strategy is now energy strategy. The constraints on the next decade of AI sit in transmission queues, water rights, permitting, sovereign compute incentives and the cities able to host gigawatts of new load. CityAge tracks the urban infrastructure layer underneath the AI race.',
  },
  'energy-transition': {
    slug: 'energy-transition',
    name: 'Energy Transition',
    thesis: 'Grid modernization, clean industry, city demand and investable projects.',
    description:
      'The energy transition is being built in cities — through demand, permitting, public-private partnerships and the long-duration capital chasing investable projects. CityAge follows the operators, capital and policymakers turning climate ambition into urban infrastructure.',
  },
  'defence-cities': {
    slug: 'defence-cities',
    name: 'Defence Cities',
    thesis:
      'Urban resilience, dual-use procurement and security-critical infrastructure.',
    description:
      'National security strategy is entering municipal procurement. Ports, airports, water, power and cyber systems are becoming the shared operating layer for resilience — and defence dollars are rerouting through the cities able to host them.',
  },
  'urban-capital': {
    slug: 'urban-capital',
    name: 'Urban Capital',
    thesis:
      'Where institutional money meets housing, mobility, ports and power.',
    description:
      'Pension funds, sovereign wealth, infrastructure managers and family offices are rewriting the rules for urban investment. CityAge tracks the long-duration capital looking for predictable infrastructure yield, climate-resilient assets and policy cover at the city scale.',
  },
}

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Toronto',
    })
  } catch {
    return ''
  }
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vertical = VERTICALS[slug]
  if (!vertical) notFound()

  // Fetch any populated articles
  let articles: Array<{
    id: string
    headline: string
    deck: string | null
    vertical: string | null
    sub_vertical: string | null
    read_time: number | null
    published_at: string | null
  }> = []

  if (vertical.articleIds && vertical.articleIds.length > 0) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      try {
        const supabase = await createClient()
        const { data } = await supabase
          .from('magazine')
          .select('id, headline, deck, vertical, sub_vertical, read_time, published_at')
          .in('id', vertical.articleIds)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
        articles = data || []
      } catch {
        articles = []
      }
    }
  }

  const hasContent = articles.length > 0

  return (
    <div className="cityage-redesign">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="CITYAGE — Intelligence for the Urban Planet">
          <span className="brand-name">CITYAGE</span>
          <span className="brand-divider" aria-hidden="true">|</span>
          <span className="brand-tagline">Intelligence for the Urban Planet</span>
        </Link>
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
      </header>

      <main className="vertical-page">
        <section className="vertical-hero">
          <div className="vertical-hero-inner">
            <p className="breadcrumb">
              <Link href="/#verticals">Verticals</Link>
              <span className="separator">/</span>
              <span>{vertical.name}</span>
            </p>

            <h1>{vertical.name}</h1>
            <p className="vertical-thesis">{vertical.thesis}</p>
            <p className="vertical-description">{vertical.description}</p>

            {vertical.stats && (
              <div className="vertical-stats">
                {vertical.stats.map((s) => (
                  <div key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="vertical-cta">
              <a
                className="button primary"
                href={`mailto:membership@cityage.com?subject=${encodeURIComponent(
                  `${vertical.name} — Pro brief`
                )}`}
              >
                Subscribe to {vertical.name}
              </a>
              <a className="button dark" href="/#partner">
                Partner with this vertical
              </a>
            </div>
          </div>
        </section>

        {hasContent ? (
          <section className="section">
            <div className="section-head">
              <p className="eyebrow">Archive</p>
              <h2>From the {vertical.name} desk.</h2>
            </div>
            <div className="archive-list">
              {articles.map((a) => (
                <Link key={a.id} href={`/article-preview/${a.id}`}>
                  <time dateTime={a.published_at || ''}>
                    {formatDate(a.published_at)}
                  </time>
                  <div>
                    <h3>{a.headline}</h3>
                    {a.deck && <p>{a.deck}</p>}
                    {a.sub_vertical && (
                      <span className="archive-tag">
                        {a.vertical} · {a.sub_vertical}
                      </span>
                    )}
                  </div>
                  <span className="read-time">{a.read_time || 5} min read</span>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="section">
            <div className="vertical-soon">
              <h2>Building this vertical now.</h2>
              <p>
                {vertical.name} is a CityAge focus. The dedicated archive,
                weekly Pro brief and event programming are launching through
                2026. Subscribe to be among the first.
              </p>
              <a
                className="button primary"
                href={`mailto:membership@cityage.com?subject=${encodeURIComponent(
                  `${vertical.name} — Be first`
                )}`}
              >
                Subscribe to {vertical.name}
              </a>
            </div>
          </section>
        )}
      </main>

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
