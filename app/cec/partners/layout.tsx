import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CEC Knowledge Partner — CityAge',
  description: 'Canada Europe Connects — Become a Knowledge Partner. May 26, 2026, Ottawa.',
  robots: 'noindex, nofollow',
}

export default function CECPartnersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <style>{`
        @keyframes goldPulse {
          0%, 100% { opacity: 0.7; width: 48px; }
          50% { opacity: 1; width: 64px; }
        }
      `}</style>
      {children}
    </div>
  )
}
