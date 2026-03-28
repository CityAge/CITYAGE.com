import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Intelligence Letter — Canada–Europe Connects | CityAge',
  description: 'Defence procurement, dual-use technology, and trans-Atlantic trade corridors converge in the capital. A CityAge Intelligence Letter for Canada–Europe Connects, Ottawa, May 26 2026.',
}

const letter = {
  client: 'Canada–Europe Connects',
  series: 'The Intelligence Letter',
  issue: 'Special Edition — May 26, 2026',
  dateline: 'Ottawa, Ontario',
  editor: {
    name: 'Miro Cernetig',
    role: 'Editor, CityAge Intelligence',
    initials: 'MC',
  },
  note: [
    'This week, Ottawa becomes the fulcrum of a trans-Atlantic conversation that will shape the next decade of defence procurement, clean technology, and trade architecture.',
    'Canada and Europe are not simply allies — they are increasingly each other\'s most viable strategic alternative. What happens in this room over the next two days will outlast the headlines.',
  ],
  lead: {
    vertical: 'Power',
    headline: 'Why Ottawa Is the Most Important Room in the Trans-Atlantic Alliance Right Now',
    dek: 'As Washington recalibrates its commitments, Canada and Europe are quietly building a new bilateral architecture — and the decisions made this week will set its foundations.',
    date: 'May 26, 2026',
    readTime: '7 min read',
    tag: 'CityAge Analysis',
  },
  pullquote: {
    text: '"The Canada–Europe relationship is no longer a courtesy call. It is a strategic necessity."',
    attribution: '— CityAge Intelligence Briefing, Spring 2026',
  },
  articles: [
    {
      num: '01',
      vertical: 'Defence',
      title: 'NATO\'s Northern Flank Is Now a Procurement Opportunity',
      excerpt: 'Canada\'s $38B defence commitment is creating the largest single contracting window in a generation — and European primes are better positioned than they\'ve ever been.',
    },
    {
      num: '02',
      vertical: 'Trade',
      title: 'CETA at Ten: What the Numbers Actually Show',
      excerpt: 'A decade after ratification, bilateral trade has grown 34% — but the sectors that matter most for the next decade are only now coming online.',
    },
    {
      num: '03',
      vertical: 'Technology',
      title: 'Dual-Use Technology Is the New Diplomatic Currency',
      excerpt: 'From quantum communications to autonomous systems, the technologies that define military advantage are the same ones powering the clean economy.',
    },
  ],
  briefs: {
    title: 'Five Signals to Watch',
    subtitle: 'Ottawa, May 2026',
    items: [
      'Canada\'s Arctic sovereignty framework opens $12B in infrastructure contracts to European partners',
      'The EU Carbon Border Adjustment Mechanism reshapes Canadian export strategy in real time',
      'Three European defence primes have opened Ottawa offices in the past 18 months',
      'Clean hydrogen corridors between Halifax and Rotterdam move from pilot to policy',
      'Ottawa\'s new critical minerals office positions Canada as Europe\'s most stable supplier',
    ],
  },
  sponsor: {
    name: 'Export Development Canada',
    message: 'Helping Canadian companies access European markets with confidence.',
  },
}

// ── Reusable section label ──
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '9px',
      letterSpacing: '0.28em',
      textTransform: 'uppercase' as const,
      color: '#c0bdb7',
      marginBottom: '22px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      {children}
      <div style={{ flex: 1, height: '1px', background: '#eceae6' }} />
    </div>
  )
}

export default function CanadaEuropeIntelligenceLetter() {
  return (
    <div style={{ background: '#F2F2F0', minHeight: '100vh' }}>

      {/* ── BACK NAV ── */}
      <div style={{ background: '#1a1a1a', padding: '8px 36px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <Link href="/canada-europe-connects" style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
          }}>
            ← Canada–Europe Connects
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', background: '#fff', border: '1px solid #dddbd6' }}>

        {/* ── TOP BAR ── */}
        <div style={{ background: '#1a1a1a', padding: '7px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
            CityAge Intelligence
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C5A059' }}>
            {letter.series}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
            Ottawa
          </span>
        </div>

        {/* ── MASTHEAD ── */}
        <div style={{ background: '#fff', padding: '40px 36px 28px', borderBottom: '2.5px solid #1a1a1a', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#aeaba4', marginBottom: '18px' }}>
            Presented for <strong style={{ color: '#1a1a1a' }}>{letter.client}</strong>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 10vw, 68px)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            lineHeight: 1,
            color: '#1a1a1a',
            marginBottom: '10px',
            textTransform: 'uppercase',
          }}>
            CITYAGE
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#aeaba4', marginBottom: '18px' }}>
            Intelligence for The Urban Planet
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center' }}>
            <div style={{ flex: 1, height: '1px', background: '#dddbd6', maxWidth: '70px' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#aeaba4', whiteSpace: 'nowrap' }}>
              {letter.series}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#dddbd6', maxWidth: '70px' }} />
          </div>
        </div>

        {/* ── DATELINE ── */}
        <div style={{ background: '#F2F2F0', borderBottom: '1px solid #dddbd6', padding: '9px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#aeaba4' }}>
            {letter.dateline} — May 26, 2026
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C5A059', fontWeight: 700 }}>
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
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {letter.editor.initials}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '3px' }}>
                {letter.editor.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#aeaba4' }}>
                {letter.editor.role}
              </div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', lineHeight: 1.72, color: '#2c2a27' }}>
            {letter.note.map((para, i) => (
              <p key={i} style={{ marginBottom: i < letter.note.length - 1 ? '15px' : 0 }}>{para}</p>
            ))}
          </div>
        </div>

        {/* ── LEAD STORY ── */}
        <div style={{ padding: '36px 36px 32px', borderBottom: '2.5px solid #1a1a1a' }}>
          <SectionLabel>Lead Story</SectionLabel>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C5A059', marginBottom: '12px', display: 'block' }}>
            {letter.lead.vertical}
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 5vw, 34px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '14px' }}>
            {letter.lead.headline}
          </h2>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', lineHeight: 1.68, color: '#5a5855', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #eceae6' }}>
            {letter.lead.dek}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#aeaba4', marginBottom: '20px' }}>
            <span>{letter.lead.date}</span>
            <span style={{ color: '#dddbd6' }}>·</span>
            <span>{letter.lead.readTime}</span>
            <span style={{ color: '#dddbd6' }}>·</span>
            <span>{letter.lead.tag}</span>
          </div>
          <Link href="/canada-europe-connects" style={{
            display: 'inline-block', background: '#C5A059', color: '#1a1a1a',
            fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            padding: '9px 20px', textDecoration: 'none',
          }}>
            Read Full Analysis →
          </Link>
        </div>

        {/* ── PULLQUOTE ── */}
        <div style={{ background: '#1a1a1a', padding: '30px 36px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.52, color: '#fff', marginBottom: '12px' }}>
            {letter.pullquote.text}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A059' }}>
            {letter.pullquote.attribution}
          </div>
        </div>

        {/* ── ARTICLES ── */}
        <div style={{ padding: '32px 36px', borderBottom: '2.5px solid #1a1a1a' }}>
          <SectionLabel>This Week's Intelligence</SectionLabel>
          {letter.articles.map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: '18px',
              padding: i === 0 ? '0 0 20px' : '20px 0',
              borderBottom: i < letter.articles.length - 1 ? '1px solid #eceae6' : 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: '#e4e2de', lineHeight: 1, flexShrink: 0, width: '24px', paddingTop: '3px' }}>
                {a.num}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aeaba4', marginBottom: '6px' }}>
                  {a.vertical}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, lineHeight: 1.3, color: '#1a1a1a', marginBottom: '7px' }}>
                  {a.title}
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', lineHeight: 1.72, color: '#7a7672' }}>
                  {a.excerpt}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SPONSOR ── */}
        <div style={{ padding: '13px 36px', borderBottom: '1px solid #dddbd6', background: '#fff', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c0bdb7', flexShrink: 0 }}>
            Partner
          </span>
          <div style={{ width: '1px', height: '20px', background: '#dddbd6', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '12px', lineHeight: 1.55, color: '#6a6660', flex: 1 }}>
            Presented with <strong style={{ fontWeight: 700, color: '#2c2a27' }}>{letter.sponsor.name}</strong> — {letter.sponsor.message}
          </span>
        </div>

        {/* ── BRIEFS ── */}
        <div style={{ padding: '32px 36px', borderBottom: '2.5px solid #1a1a1a', background: '#F2F2F0' }}>
          <SectionLabel>{letter.briefs.title}</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '21px', fontWeight: 900, color: '#1a1a1a' }}>
              {letter.briefs.title}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c0bdb7' }}>
              {letter.briefs.subtitle}
            </div>
          </div>
          {letter.briefs.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '13px', padding: '12px 0', borderBottom: i < letter.briefs.items.length - 1 ? '1px solid #dddbd6' : 'none', alignItems: 'flex-start' }}>
              <div style={{ width: '4px', height: '4px', background: '#C5A059', borderRadius: '50%', flexShrink: 0, marginTop: '9px' }} />
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', lineHeight: 1.65, color: '#2c2a27' }}>{item}</div>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div style={{ background: '#1a1a1a', padding: '34px 36px 28px' }}>
          <div style={{ paddingBottom: '18px', marginBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 900, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
              CITYAGE
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '6px' }}>
              Intelligence for The Urban Planet
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C5A059' }}>
              {letter.series}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            {['Unsubscribe', 'Update Preferences', 'View Online', 'CityAge.com', 'Privacy'].map(link => (
              <span key={link} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                {link}
              </span>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)', lineHeight: 1.7 }}>
            Published by CityAge in partnership with Canada–Europe Connects.<br />
            © 2026 CityAge Intelligence. All rights reserved. Vancouver, BC.
          </div>
        </div>

      </div>
    </div>
  )
}
