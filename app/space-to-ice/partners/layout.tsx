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
          0%, 100% { opacity: 0.5; transform: translateX(-8%) scaleY(1); }
          25% { opacity: 0.9; transform: translateX(5%) scaleY(1.15); }
          50% { opacity: 0.6; transform: translateX(-3%) scaleY(0.92); }
          75% { opacity: 0.85; transform: translateX(6%) scaleY(1.08); }
        }
        @keyframes auroraPulse2 {
          0%, 100% { opacity: 0.4; transform: translateX(8%) scaleY(1.05); }
          30% { opacity: 0.85; transform: translateX(-6%) scaleY(0.88); }
          60% { opacity: 0.95; transform: translateX(3%) scaleY(1.18); }
          80% { opacity: 0.45; transform: translateX(-4%) scaleY(1); }
        }
        @keyframes auroraPulse3 {
          0%, 100% { opacity: 0.35; transform: translateX(4%) scaleY(1.1); }
          35% { opacity: 0.8; transform: translateX(-10%) scaleY(0.92); }
          65% { opacity: 0.9; transform: translateX(7%) scaleY(1.12); }
          85% { opacity: 0.4; transform: translateX(-2%) scaleY(1); }
        }
        @keyframes auroraCurtain {
          0%, 100% { opacity: 0.3; transform: translateY(0) scaleX(1); }
          20% { opacity: 0.7; transform: translateY(-4%) scaleX(1.08); }
          40% { opacity: 0.45; transform: translateY(2%) scaleX(0.95); }
          60% { opacity: 0.8; transform: translateY(-3%) scaleX(1.12); }
          80% { opacity: 0.35; transform: translateY(1%) scaleX(1.02); }
        }
        @keyframes auroraRibbon {
          0%, 100% { opacity: 0.2; transform: translateX(-15%) skewX(0deg); }
          25% { opacity: 0.6; transform: translateX(10%) skewX(-3deg); }
          50% { opacity: 0.35; transform: translateX(-5%) skewX(2deg); }
          75% { opacity: 0.7; transform: translateX(8%) skewX(-2deg); }
        }
        @keyframes frostSlide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(50%); }
        }
      `}</style>
      {/* Aurora layer 1 — bright cold blue band */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'linear-gradient(180deg, transparent 0%, rgba(40,130,190,0.55) 10%, rgba(70,160,210,0.4) 25%, rgba(50,140,200,0.2) 45%, transparent 65%)',
        animation: 'auroraPulse1 14s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Aurora layer 2 — vivid green */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'linear-gradient(165deg, transparent 0%, rgba(50,220,120,0.45) 12%, rgba(80,200,140,0.35) 30%, rgba(60,190,130,0.15) 50%, transparent 70%)',
        animation: 'auroraPulse2 19s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Aurora layer 3 — violet-blue */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'linear-gradient(195deg, transparent 0%, rgba(80,90,220,0.4) 12%, rgba(60,140,200,0.3) 30%, rgba(90,170,230,0.12) 50%, transparent 68%)',
        animation: 'auroraPulse3 24s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Aurora layer 4 — wide blurred curtain */}
      <div style={{
        position: 'fixed', top: 0, left: '-30%', right: '-30%', height: '70vh',
        background: 'linear-gradient(155deg, transparent 5%, rgba(40,210,140,0.35) 18%, rgba(60,170,220,0.45) 35%, rgba(80,140,210,0.3) 50%, rgba(50,200,150,0.15) 65%, transparent 80%)',
        animation: 'auroraCurtain 21s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
        filter: 'blur(40px)',
      }} />
      {/* Aurora layer 5 — thin ribbon streak */}
      <div style={{
        position: 'fixed', top: '5%', left: '-10%', right: '-10%', height: '25vh',
        background: 'linear-gradient(170deg, transparent 15%, rgba(50,230,150,0.3) 30%, rgba(70,200,230,0.4) 45%, rgba(90,160,210,0.25) 60%, transparent 75%)',
        animation: 'auroraRibbon 16s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
        filter: 'blur(20px)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
