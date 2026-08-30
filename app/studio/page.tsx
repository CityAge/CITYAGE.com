import { Metadata } from 'next'
import { MagazineFooter } from '@/components/magazine-footer'
import { StudioPlayer } from './studio-player'

export const metadata: Metadata = {
  title: 'Studio — CityAge',
  description: 'We make films and brands for people.',
}

export default function StudioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050403]">
      <StudioPlayer />
      <MagazineFooter />
    </div>
  )
}
