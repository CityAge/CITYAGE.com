import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Next Metro Vancouver: The AI Edition — Partners — CityAge',
  description:
    'The Next Metro Vancouver: The AI Edition — the leaders making British Columbia\u2019s AI future happen. An Urban Planet convening, Vancouver, Autumn 2026.',
  robots: 'noindex, nofollow',
}

export default function NextVancouverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="nv-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono&display=swap');
        .nv-root {
          background: #FAF6EE;
          color: #2A2520;
          min-height: 100vh;
          font-family: 'DM Sans', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .nv-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .nv-mono { font-family: 'DM Mono', monospace; }
        @media (prefers-reduced-motion: reduce) {
          .nv-root * { animation: none !important; transition: none !important; }
        }
      `}</style>
      {children}
    </div>
  )
}
