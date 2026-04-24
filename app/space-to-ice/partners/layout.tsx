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
          0%, 100% { opacity: 0.12; transform: translateX(-10%) scaleY(1); }
          25% { opacity: 0.35; transform: translateX(5%) scaleY(1.2); }
          50% { opacity: 0.18; transform: translateX(-5%) scaleY(0.9); }
          75% { opacity: 0.28; transform: translateX(8%) scaleY(1.1); }
        }
        @keyframes auroraPulse2 {
          0%, 100% { opacity: 0.15; transform: translateX(10%) scaleY(1.1); }
          30% { opacity: 0.3; transform: translateX(-8%) scaleY(0.85); }
          60% { opacity: 0.4; transform: translateX(3%) scaleY(1.2); }
          80% { opacity: 0.1; transform: translateX(-5%) scaleY(1); }
        }
        @keyframes auroraPulse3 {
          0%, 100% { opacity: 0.08; transform: translateX(5%) scaleY(1.15); }
          35% { opacity: 0.25; transform: translateX(-12%) scaleY(0.9); }
          65% { opacity: 0.35; transform: translateX(8%) scaleY(1.1); }
          85% { opacity: 0.12; transform: translateX(-3%) scaleY(1); }
        }
        @keyframes auroraCurtain {
          0%, 100% { opacity: 0.06; transform: translateY(0) scaleX(1); }
          20% { opacity: 0.2; transform: translateY(-3%) scaleX(1.05); }
          40% { opacity: 0.1; transform: translateY(2%) scaleX(0.95); }
          60% { opacity: 0.25; transform: translateY(-2%) scaleX(1.1); }
          80% { opacity: 0.08; transform: translateY(1%) scaleX(1); }
        }
        @keyframes frostSlide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(50%); }
        }
      `}</style>
      {/* Aurora layer 1 — cold blue curtain */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'linear-gradient(180deg, transparent 0%, rgba(45,122,171,0.25) 15%, rgba(90,159,196,0.18) 35%, rgba(45,122,171,0.08) 55%, transparent 75%)',
        animation: 'auroraPulse1 12s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Aurora layer 2 — green shimmer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'linear-gradient(170deg, transparent 5%, rgba(80,200,140,0.2) 20%, rgba(109,184,154,0.15) 40%, rgba(60,180,120,0.06) 60%, transparent 80%)',
        animation: 'auroraPulse2 17s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Aurora layer 3 — deep violet-blue */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'linear-gradient(190deg, transparent 0%, rgba(80,100,200,0.15) 18%, rgba(58,141,186,0.12) 38%, rgba(100,180,220,0.06) 55%, transparent 70%)',
        animation: 'auroraPulse3 23s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Aurora layer 4 — sweeping curtain effect */}
      <div style={{
        position: 'fixed', top: 0, left: '-20%', right: '-20%', height: '60vh',
        background: 'linear-gradient(160deg, transparent 10%, rgba(60,200,150,0.12) 25%, rgba(90,180,220,0.18) 40%, rgba(80,160,200,0.1) 55%, transparent 70%)',
        animation: 'auroraCurtain 20s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
        filter: 'blur(30px)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
