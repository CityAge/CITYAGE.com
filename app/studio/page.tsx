import { Metadata } from 'next'
import { MagazineFooter } from '@/components/magazine-footer'
import { StudioPlayer } from './studio-player'

export const metadata: Metadata = {
  title: 'Studio — CityAge',
  description: 'We put ideas in motion.',
}

export default function StudioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050403]">
      <StudioPlayer />
      <MagazineFooter />
    </div>
  )
}
