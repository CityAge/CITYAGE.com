import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Northern Century — Concept Thesis — CityAge',
  description:
    'The Northern Century — the new fulcrum where security, climate and capital converge. A CityAge Urban Planet franchise. Ottawa · Arlington · Vancouver.',
  robots: 'noindex, nofollow',
}

export default function NorthernCenturyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="nc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono&display=swap');
        .nc-root {
          background: #07090C;
          color: #D9D2C5;
          min-height: 100vh;
          font-family: 'DM Sans', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .nc-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .nc-mono { font-family: 'DM Mono', monospace; }
        @media (prefers-reduced-motion: reduce) {
          .nc-root * { animation: none !important; transition: none !important; }
        }
      `}</style>
      {children}
    </div>
  )
}
