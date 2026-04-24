import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Space to Ice — Knowledge Partner — CityAge',
  description: 'Space to Ice — Arctic sovereignty, northern infrastructure, and the space economy above Canada\'s North. A CityAge intelligence event, Ottawa, Fall 2026.',
  robots: 'noindex, nofollow',
}

export default function SpaceToIceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#040a14] text-white min-h-screen relative overflow-hidden">
      <style>{`
        @keyframes auroraPulse1 {
          0%, 100% { opacity: 0.03; transform: translateX(-10%) scaleY(1); }
          25% { opacity: 0.07; transform: translateX(5%) scaleY(1.1); }
          50% { opacity: 0.04; transform: translateX(-5%) scaleY(0.95); }
          75% { opacity: 0.06; transform: translateX(8%) scaleY(1.05); }
        }
        @keyframes auroraPulse2 {
          0%, 100% { opacity: 0.04; transform: translateX(10%) scaleY(1.05); }
          30% { opacity: 0.06; transform: translateX(-8%) scaleY(0.9); }
          60% { opacity: 0.08; transform: translateX(3%) scaleY(1.1); }
          80% { opacity: 0.03; transform: translateX(-5%) scaleY(1); }
        }
        @keyframes auroraPulse3 {
          0%, 100% { opacity: 0.02; transform: translateX(5%) scaleY(1.1); }
          35% { opacity: 0.05; transform: translateX(-12%) scaleY(0.95); }
          65% { opacity: 0.07; transform: translateX(8%) scaleY(1.05); }
          85% { opacity: 0.03; transform: translateX(-3%) scaleY(1); }
        }
        @keyframes frostSlide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(50%); }
        }
      `}</style>
      {/* Aurora layer 1 — cold blue */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'linear-gradient(180deg, transparent 0%, rgba(45,122,171,0.08) 20%, rgba(90,159,196,0.05) 40%, transparent 70%)',
        animation: 'auroraPulse1 12s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Aurora layer 2 — green shimmer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'linear-gradient(170deg, transparent 10%, rgba(109,184,154,0.06) 30%, rgba(90,159,196,0.04) 50%, transparent 75%)',
        animation: 'auroraPulse2 17s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Aurora layer 3 — deep blue */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'linear-gradient(190deg, transparent 5%, rgba(58,141,186,0.05) 25%, rgba(168,204,224,0.03) 45%, transparent 65%)',
        animation: 'auroraPulse3 23s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
