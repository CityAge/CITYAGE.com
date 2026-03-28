import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Intelligence Letter — Canada–Europe Connects | CityAge',
  description: 'Defence procurement, dual-use technology, and trans-Atlantic trade corridors converge in the capital. A CityAge Intelligence Letter for Canada–Europe Connects, Ottawa, May 26 2026.',
}

// ── Content — swap individual fields for Supabase in next iteration ──
const letter = {
  client:   'Canada–Europe Connects',
  series:   'The Intelligence Letter',
  issue:    'Special Edition — May 26, 2026',
  dateline: 'Ottawa, Ontario',
  editor: {
    name:    'Miro Cernetig',
    initials:'MC',
    role:    'Editor & Publisher, CityAge',
  },
  note: [
    'Ottawa this week is not a backdrop. It is the room where three converging forces — defence procurement, dual-use technology, and trans-Atlantic trade — are being decided by the people who will actually sign the papers.',
    'What follows is your intelligence briefing for Canada–Europe Connects. Read it before the first session. The conversations will make more sense.',
  ],
  lead: {
    vertical: 'Power',
    headline: 'Why Ottawa Is the Most Important Room in Trans-Atlantic Defence This Spring',
    dek: 'Canada and Europe are rewriting their procurement relationship in real time. The decisions taken this week will shape industrial policy on both sides of the Atlantic for a decade.',
    date: 'May 26, 2026',
    readTime: '7 min read',
  },
  pullquote: {
    text: '"The alliance that doesn\'t share industrial capacity will not survive the next decade of contested supply chains."',
    attr: '— CityAge Intelligence, Trans-Atlantic Security Brief, 2026',
  },
  articles: [
    {
      num: '01',
      vertical: 'Defence',
      title: 'Europe\'s Procurement Window Is Narrow — and Canada Knows It',
      excerpt: 'With NATO rearmament accelerating, European capitals are moving faster than Canadian industry has historically been asked to match.',
    },
    {
      num: '02',
      vertical: 'Trade',
      title: 'Dual-Use Technology Is the New Trade Corridor',
      excerpt: 'From quantum sensors to satellite communications, the line between civilian and military application has collapsed. Ottawa is catching up.',
    },
    {
      num: '03',
      vertical: 'Cities',
      title: 'Why Mid-Size Canadian Cities Are Emerging as Defence Industrial Hubs',
      excerpt: 'Aerospace clusters in Winnipeg, Halifax, and Victoria are attracting European prime contractors looking for stable, allied production capacity.',
    },
  ],
  briefs: {
    title: 'Five Things to Know Before the First Session',
    items: [
      'Canada\'s defence budget commitment to NATO is under renewed scrutiny from five European allies',
      'The CETA investment provisions are being invoked more frequently than any period since ratification',
      'Three European prime contractors have opened Canadian offices in the past 18 months',
      'Ottawa\'s National Capital Commission is hosting a record 14 bilateral delegations this spring',
      'The Indo-Pacific Strategy intersects with trans-Atlantic priorities in ways not yet publicly articulated',
    ],
  },
  sponsor: {
    name: 'Export Development Canada',
    message: 'Supporting Canadian businesses expanding into European markets.',
  },
}

// ── Shared section label ──
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '9px',
      letterSpacing: '0.28em', textTransform: 'uppercase' as const,
      color: '#c0bdb7', marginBottom: '22px',
      display: 'flex', alignItems: 'center', gap: '12px',
    }}>
      {children}
      <div style={{ flex: 1, height: '1px', background: '#eceae6' }} />
    </div>
  )
}

export default function CanadaEuropeConnectsLetter() {
  return (
    <div style={{ background: '#F2F2F0', minHeight: '100vh' }}>

      {/* ── Top navigation bar ── */}
      <div style={{
        background: '#1a1a1a', padding: '7px 36px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          letterSpacing: '0.2em', textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
        }}>
          ← CityAge
        </Link>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          letterSpacing: '0.22em', textTransform: 'uppercase' as const,
          color: '#C5A059',
        }}>
          {letter.series}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          letterSpacing: '0.2em', textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,0.3)',
        }}>
          {letter.dateline}
        </span>
      </div>

      {/* ── Letter shell ── */}
      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        background: '#ffffff',
        borderLeft: '1px solid #dddbd6',
        borderRight: '1px solid #dddbd6',
        borderBottom: '1px solid #dddbd6',
      }}>

        {/* ── MASTHEAD ── */}
        <div style={{
          padding: '40px 36px 28px',
          borderBottom: '2.5px solid #1a1a1a',
          textAlign: 'center' as const,
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            color: '#aeaba4', marginBottom: '18px',
          }}>
            Presented for <strong style={{ color: '#1a1a1a' }}>{letter.client}</strong>
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 10vw, 68px)',
            fontWeight: 900, letterSpacing: '0.06em',
            lineHeight: 1, color: '#1a1a1a',
            textTransform: 'uppercase' as const,
            marginBottom: '10px',
          }}>
            CITYAGE
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.28em', textTransform: 'uppercase' as const,
            color: '#aeaba4', marginBottom: '18px',
          }}>
            Intelligence for The Urban Planet
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center' }}>
            <div style={{ flex: 1, height: '1px', background: '#dddbd6', maxWidth: '70px' }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.28em', textTransform: 'uppercase' as const,
              color: '#aeaba4', whiteSpace: 'nowrap' as const,
            }}>
              {letter.series}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#dddbd6', maxWidth: '70px' }} />
          </div>
        </div>

        {/* ── DATELINE ── */}
        <div style={{
          background: '#F2F2F0', borderBottom: '1px solid #dddbd6',
          padding: '9px 36px', display: 'flex', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.15em', textTransform: 'uppercase' as const,
            color: '#aeaba4',
          }}>
            {letter.dateline} — May 26, 2026
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.15em', textTransform: 'uppercase' as const,
            color: '#C5A059', fontWeight: 700,
          }}>
            {letter.issue}
          </span>
        </div>

        {/* ── EDITOR'S NOTE ── */}
        <div style={{ padding: '36px 36px 32px', borderBottom: '1px solid #eceae6' }}>
          <SectionLabel>Editor's Note</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '50%',
              background: '#1a1a1a', color: '#C5A059',
              fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {letter.editor.initials}
            </div>
            <div>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: '15px',
                fontWeight: 700, color: '#1a1a1a', marginBottom: '3px',
              }}>
                {letter.editor.name}
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px',
                letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                color: '#aeaba4',
              }}>
                {letter.editor.role}
              </p>
            </div>
          </div>
          {letter.note.map((para, i) => (
            <p key={i} style={{
              fontFamily: 'var(--font-serif)', fontSize: '16px',
              lineHeight: 1.72, color: '#2c2a27',
              marginBottom: i < letter.note.length - 1 ? '15px' : 0,
            }}>
              {para}
            </p>
          ))}
        </div>

        {/* ── LEAD STORY ── */}
        <div style={{ padding: '36px 36px 32px', borderBottom: '2.5px solid #1a1a1a' }}>
          <SectionLabel>Lead Story</SectionLabel>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            color: '#C5A059', marginBottom: '12px', display: 'block',
          }}>
            {letter.lead.vertical}
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 5vw, 34px)',
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '14px',
          }}>
            {letter.lead.headline}
          </h2>
          <p style={{
            fontFamily: 'var(--font-serif)', fontSize: '16px',
            lineHeight: 1.68, color: '#5a5855',
            marginBottom: '18px', paddingBottom: '18px',
            borderBottom: '1px solid #eceae6',
          }}>
            {letter.lead.dek}
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.15em', textTransform: 'uppercase' as const,
            color: '#aeaba4', marginBottom: '20px',
          }}>
            <span>{letter.lead.date}</span>
            <span style={{ color: '#dddbd6' }}>·</span>
            <span>{letter.lead.readTime}</span>
            <span style={{ color: '#dddbd6' }}>·</span>
            <span>CityAge Analysis</span>
          </div>
          <Link href="/canada-europe-connects" style={{
            display: 'inline-block', background: '#C5A059', color: '#1a1a1a',
            fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            padding: '9px 20px', textDecoration: 'none',
          }}>
            Read Full Briefing →
          </Link>
        </div>

        {/* ── PULLQUOTE ── */}
        <div style={{ background: '#1a1a1a', padding: '30px 36px' }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '19px',
            fontWeight: 700, fontStyle: 'italic',
            lineHeight: 1.52, color: '#fff', marginBottom: '12px',
          }}>
            {letter.pullquote.text}
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.2em', textTransform: 'uppercase' as const,
            color: '#C5A059',
          }}>
            {letter.pullquote.attr}
          </p>
        </div>

        {/* ── INTELLIGENCE BRIEFS ── */}
        <div style={{ padding: '32px 36px', borderBottom: '2.5px solid #1a1a1a' }}>
          <SectionLabel>Intelligence Briefs</SectionLabel>
          {letter.articles.map((art, i) => (
            <div key={i} style={{
              display: 'flex', gap: '18px',
              padding: i === 0 ? '0 0 20px' : '20px 0',
              borderBottom: i < letter.articles.length - 1 ? '1px solid #eceae6' : 'none',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '18px',
                fontWeight: 700, color: '#e4e2de',
                lineHeight: 1, flexShrink: 0, width: '24px', paddingTop: '3px',
              }}>
                {art.num}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                  color: '#aeaba4', marginBottom: '6px',
                }}>
                  {art.vertical}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '17px',
                  fontWeight: 700, lineHeight: 1.3,
                  color: '#1a1a1a', marginBottom: '7px',
                }}>
                  {art.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-serif)', fontSize: '14px',
                  lineHeight: 1.72, color: '#7a7672',
                }}>
                  {art.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── SPONSOR ── */}
        <div style={{
          padding: '13px 36px', borderBottom: '1px solid #dddbd6',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '8px',
            letterSpacing: '0.25em', textTransform: 'uppercase' as const,
            color: '#c0bdb7', flexShrink: 0,
          }}>
            Partner
          </span>
          <div style={{ width: '1px', height: '20px', background: '#dddbd6', flexShrink: 0 }} />
          <p style={{
            fontFamily: 'var(--font-serif)', fontSize: '12px',
            lineHeight: 1.55, color: '#6a6660', flex: 1,
          }}>
            Presented with{' '}
            <strong style={{ fontWeight: 700, color: '#2c2a27' }}>{letter.sponsor.name}</strong>
            {' '}— {letter.sponsor.message}
          </p>
        </div>

        {/* ── FIVE THINGS ── */}
        <div style={{
          padding: '32px 36px', borderBottom: '2.5px solid #1a1a1a',
          background: '#F2F2F0',
        }}>
          <SectionLabel>{letter.briefs.title}</SectionLabel>
          {letter.briefs.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '13px',
              padding: '12px 0',
              borderBottom: i < letter.briefs.items.length - 1 ? '1px solid #dddbd6' : 'none',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: '4px', height: '4px', background: '#C5A059',
                borderRadius: '50%', flexShrink: 0, marginTop: '9px',
              }} />
              <p style={{
                fontFamily: 'var(--font-serif)', fontSize: '15px',
                lineHeight: 1.65, color: '#2c2a27',
              }}>
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div style={{ background: '#1a1a1a', padding: '34px 36px 28px' }}>
          <div style={{
            paddingBottom: '18px', marginBottom: '18px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '26px',
              fontWeight: 900, color: '#fff',
              letterSpacing: '0.06em', textTransform: 'uppercase' as const,
              marginBottom: '2px',
            }}>
              CITYAGE
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '8px',
              letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.25)', marginBottom: '6px',
            }}>
              Intelligence for The Urban Planet
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: '#C5A059',
            }}>
              {letter.series}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '16px', marginBottom: '16px' }}>
            {['Unsubscribe', 'Update Preferences', 'View Online', 'CityAge.com', 'Privacy'].map(l => (
              <Link key={l} href="/" style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px',
                letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                color: 'rgba(255,255,255,0.25)', textDecoration: 'none',
              }}>
                {l}
              </Link>
            ))}
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '8px',
            letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)', lineHeight: 1.7,
          }}>
            Published by CityAge in partnership with {letter.client}.<br />
            © 2026 CityAge Intelligence. All rights reserved. Vancouver, BC.
          </p>
        </div>

      </div>
    </div>
  )
}
