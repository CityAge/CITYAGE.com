'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import Image from 'next/image'

const PASSCODE = 'CEC2026'

const SECTORS = [
  'AI & Cyber Defence',
  'Defence Procurement',
  'Canada–Europe Trade',
  'Dual-Use Technology',
  'Arctic Sovereignty',
  'Robotics & Semiconductors',
  'NATO Strategy',
  'Space & Satellites',
]

const TIERS = [
  {
    name: 'Strategic',
    price: '$15,000',
    highlight: true,
    features: [
      '10 complimentary invitations',
      'Category exclusivity',
      'Keynote and panel speaking opportunity',
      'Year-round branding across CEC website, signage, digital marketing & social media',
      'Newsletter sponsorship (pre and post-event)',
      'Co-branded post-event intelligence report',
      'VIP networking: customized access to future roundtables and receptions',
    ],
  },
  {
    name: 'Presenting',
    price: '$7,500',
    highlight: false,
    features: [
      '7 complimentary invitations',
      '"Presented by" session branding',
      'Speaking slot for your representative',
      'Year-round branding across CEC website, signage, digital marketing & social media',
      'Logo on post-event intelligence report',
      'VIP networking: customized access to roundtables and receptions',
    ],
  },
  {
    name: 'Supporting',
    price: '$5,000',
    highlight: false,
    features: [
      '5 complimentary invitations',
      'Logo on event materials and website',
      'Article in CityAge newsletter',
      'Attendee list (names and titles)',
      'VIP networking access',
    ],
  },
]

const STATS = [
  { num: '100+', label: 'Events' },
  { num: '50+', label: 'Cities' },
  { num: '25K+', label: 'Network' },
  { num: '15', label: 'Years' },
]

/* ─── Scroll-triggered reveal ─── */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el) } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-out ${className}`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ─── Parallax cover image ─── */
function ParallaxImage({ src }: { src: string }) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.3)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Image src={src} alt="" fill className="object-cover opacity-[0.14] mix-blend-screen" style={{ transform: `translateY(${offset}px) scale(1.1)` }} priority />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-[#080808]/30" />
    </div>
  )
}

/* ─── Gold line accent ─── */
function GoldLine({ className = '' }: { className?: string }) {
  return <div className={`h-[1.5px] w-12 bg-gradient-to-r from-[#c9a84c] to-[#a07d2e] animate-[goldPulse_4s_ease-in-out_infinite] ${className}`} />
}

/* ─── Section heading ─── */
function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[#c9a84c] text-[11px] sm:text-xs font-medium tracking-[0.3em] uppercase font-[family-name:var(--font-ui)]">{children}</p>
}

/* ─── Password gate ─── */
function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim().toUpperCase() === PASSCODE) { onSuccess() } else { setError(true); setTimeout(() => setError(false), 2000) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm w-full">
        <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-[family-name:var(--font-ui)] mb-6">CityAge</p>
        <h1 className="font-[family-name:var(--font-display)] text-white text-3xl sm:text-4xl mb-2">Canada Europe Connects</h1>
        <p className="text-white/40 text-sm font-[family-name:var(--font-ui)] tracking-wide mb-10">Partnership Briefing</p>
        <GoldLine className="mx-auto mb-10" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter access code"
            className={`w-full bg-transparent border ${error ? 'border-red-500/60' : 'border-white/15'} rounded-none px-4 py-3 text-center text-white text-sm tracking-widest font-[family-name:var(--font-mono)] placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 transition-colors`} />
          <button type="submit" className="w-full border border-[#c9a84c]/30 text-[#c9a84c] text-xs tracking-[0.25em] uppercase py-3 hover:bg-[#c9a84c]/5 transition-colors font-[family-name:var(--font-ui)]">Enter</button>
        </form>
        {error && <p className="text-red-400/70 text-xs mt-4 font-[family-name:var(--font-ui)]">Invalid code</p>}
        <p className="text-white/15 text-[10px] mt-12 font-[family-name:var(--font-ui)]">Contact miro@cityage.com for access</p>
      </div>
    </div>
  )
}

/* ─── Burned-in looping video background ─── */
function BurnedVideo({ src, className = '', opacity = 0.1 }: { src: string; className?: string; opacity?: number }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity, mixBlendMode: 'screen' }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}

/* ═══ MAIN PAGE ═══ */
export default function CECPartnersPage() {
  const [authenticated, setAuthenticated] = useState(false)

  if (!authenticated) return <PasswordGate onSuccess={() => setAuthenticated(true)} />

  return (
    <main className="overflow-hidden">

      {/* COVER */}
      <section className="relative min-h-screen flex flex-col justify-end px-8 sm:px-16 pb-16 sm:pb-24">
        <ParallaxImage src="/ottawa-feature.jpg" />
        {/* Waving Canadian flag burned in */}
        <BurnedVideo src="/canadian-flag.mp4" opacity={0.15} />
        <div className="absolute inset-5 sm:inset-8 border border-white/[0.06] pointer-events-none z-10" />
        <div className="relative z-20 max-w-3xl">
          <Reveal>
            <p className="text-white/30 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-[family-name:var(--font-ui)] mb-3">CityAge, in partnership with Earnscliffe, invites you to</p>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="font-[family-name:var(--font-display)] text-white text-5xl sm:text-7xl lg:text-8xl leading-[0.95] mb-4">Canada Europe<br />Connects</h1>
          </Reveal>
          <Reveal delay={400}>
            <p className="text-white/40 text-sm sm:text-base font-[family-name:var(--font-ui)] tracking-wide mb-6">May 26, 2026 &nbsp;·&nbsp; Ottawa, Canada</p>
            <GoldLine className="mb-6" />
            <span className="inline-block text-[#c9a84c] text-[10px] sm:text-xs tracking-[0.25em] uppercase border border-[#c9a84c]/25 px-4 py-2 font-[family-name:var(--font-ui)]">Become a Knowledge Partner</span>
          </Reveal>
        </div>
        <span className="absolute bottom-4 right-6 sm:bottom-6 sm:right-10 text-white/10 text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-ui)] z-20">CityAge</span>
      </section>

      {/* THE OPPORTUNITY */}
      <section className="relative px-8 sm:px-16 py-24 sm:py-32">
        <BurnedVideo src="/eu-flag.mp4" opacity={0.15} />
        <div className="absolute inset-5 sm:inset-8 border border-white/[0.06] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto sm:mx-0 sm:ml-[10%]">
          <Reveal>
            <SectionLabel>The opportunity</SectionLabel>
            <GoldLine className="mt-3 mb-8" />
          </Reveal>
          <Reveal delay={200}>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed font-[family-name:var(--font-serif)]">
              Canada has committed to doubling its defence spending. CETA is being repositioned as a strategic pipeline for dual-use technology. New trade corridors are opening between Canada and Europe.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed font-[family-name:var(--font-serif)] mt-6">
              We invite you to be in the room where partnerships form, deals take shape, and your brand is positioned at the centre of the growing trans-Atlantic opportunity.
            </p>
            <div className="mt-12 pt-6 border-t border-white/[0.06]">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {['100 vetted leaders', 'Invite-only', 'Chatham House Rules'].map((item) => (
                  <span key={item} className="text-white/35 text-xs tracking-wide font-[family-name:var(--font-ui)]">{item}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE ROOM */}
      <section className="relative px-8 sm:px-16 py-24 sm:py-32">
        <BurnedVideo src="/eu-flag.mp4" opacity={0.18} />
        <div className="max-w-3xl mx-auto sm:mx-0 sm:ml-[10%]">
          <Reveal>
            <SectionLabel>The room</SectionLabel>
            <GoldLine className="mt-3 mb-8" />
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {SECTORS.map((s) => (
                <span key={s} className="text-white/40 text-xs sm:text-sm px-3 sm:px-4 py-2 border border-white/10 font-[family-name:var(--font-ui)] tracking-wide">{s}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-12 pt-6 border-t border-white/[0.06]">
              <p className="text-white/40 text-sm leading-relaxed font-[family-name:var(--font-ui)]">
                Confirmed speakers from Google Cloud, Invest Ottawa, Embassy of Estonia, InDro Robotics, Skeleton Technologies, City of Kitchener, and more.
              </p>
            </div>
            <span className="inline-block mt-8 text-white/15 text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-mono)]">May 26 &nbsp;·&nbsp; Cours Bayview &nbsp;·&nbsp; Ottawa</span>
          </Reveal>
        </div>
      </section>

      {/* PARTNERSHIP TIERS */}
      <section className="px-8 sm:px-16 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionLabel>Partnership tiers</SectionLabel>
            <GoldLine className="mt-3 mb-10" />
          </Reveal>
          <Reveal delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.06]">
              {TIERS.map((tier) => (
                <div key={tier.name} className={`bg-[#080808] p-6 sm:p-8 ${tier.highlight ? 'border-t-2 border-t-[#c9a84c]/40' : ''}`}>
                  <p className="text-[#c9a84c] text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-[family-name:var(--font-ui)] mb-1">{tier.name}</p>
                  <p className="font-[family-name:var(--font-display)] text-white text-3xl sm:text-4xl mb-6">{tier.price}</p>
                  <ul className="space-y-3">
                    {tier.features.map((f, i) => (
                      <li key={i} className="text-white/40 text-xs sm:text-sm leading-relaxed font-[family-name:var(--font-ui)]">{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-center text-white/20 text-[10px] sm:text-xs tracking-[0.2em] uppercase mt-8 font-[family-name:var(--font-ui)]">Custom packages available upon request</p>
          </Reveal>
        </div>
      </section>

      {/* CITYAGE CREDENTIALS */}
      <section className="relative px-8 sm:px-16 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.04)_0%,_transparent_60%)]" />
        {/* Both flags, split screen */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex">
          <div className="w-1/2 relative">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.1, mixBlendMode: 'screen' }}>
              <source src="/canadian-flag.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="w-1/2 relative">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.1, mixBlendMode: 'screen' }}>
              <source src="/eu-flag.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="relative text-center max-w-2xl mx-auto">
          <Reveal>
            <SectionLabel>CityAge</SectionLabel>
            <GoldLine className="mx-auto mt-3 mb-10" />
          </Reveal>
          <Reveal delay={200}>
            <div className="flex justify-center gap-8 sm:gap-16">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-[family-name:var(--font-display)] text-white text-3xl sm:text-5xl">{s.num}</p>
                  <p className="text-white/30 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase mt-1 font-[family-name:var(--font-ui)]">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={400}>
            <p className="text-white/35 text-xs sm:text-sm mt-12 leading-relaxed font-[family-name:var(--font-ui)]">
              Featured on 60 Minutes &nbsp;·&nbsp; Wall Street Journal &nbsp;·&nbsp; BBC &nbsp;·&nbsp; National Geographic &nbsp;·&nbsp; Globe and Mail &nbsp;·&nbsp; The Economist &nbsp;·&nbsp; New York Times
            </p>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-8 sm:px-16 py-24 sm:py-32 text-center">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-white text-4xl sm:text-5xl mb-4">Let&apos;s talk.</h2>
          <GoldLine className="mx-auto mb-8" />
          <p className="text-white/60 text-sm tracking-wide font-[family-name:var(--font-ui)]">Miro Cernetig</p>
          <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase font-[family-name:var(--font-ui)] mt-1">CEO & Publisher</p>
          <a href="mailto:miro@cityage.com" className="inline-block text-white/40 text-sm font-[family-name:var(--font-mono)] mt-6 hover:text-[#c9a84c] transition-colors">miro@cityage.com</a>
          <p className="text-white/25 text-sm font-[family-name:var(--font-mono)] mt-1">cityage.com</p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-16">
            <a href="/cec-knowledge-partner.pdf" download className="inline-block border border-white/15 text-white/40 text-[10px] sm:text-xs tracking-[0.25em] uppercase px-8 py-3 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors font-[family-name:var(--font-ui)]">Download PDF</a>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="px-8 sm:px-16 py-8 flex justify-between items-center border-t border-white/[0.04]">
        <span className="text-white/10 text-[9px] tracking-[0.25em] uppercase font-[family-name:var(--font-ui)]">CityAge Media Inc.</span>
        <span className="text-white/10 text-[9px] tracking-[0.25em] uppercase font-[family-name:var(--font-ui)]">Vancouver &nbsp;·&nbsp; Washington DC</span>
      </footer>
    </main>
  )
}
