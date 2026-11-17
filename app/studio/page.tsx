import { Metadata } from 'next'
import { MagazineFooter } from '@/components/magazine-footer'
import { StudioPlayer } from './studio-player'

export const metadata: Metadata = {
  title: 'Studio — CityAge',
  description: 'CityAge Studio is the strategy and creative arm of CityAge: films, brands and campaigns by Miro Cernetig and Jeremy Lutter.',
  alternates: { canonical: '/studio' },
}

export default function StudioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050403]">
      <StudioPlayer />
      <MagazineFooter />
    </div>
  )
}
