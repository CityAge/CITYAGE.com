import { Metadata } from 'next'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { PeopleWall } from './people-wall'

export const metadata: Metadata = {
  title: 'People — CityAge',
  description: 'The CityAge Contributors.',
}

export default function PeoplePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />
      <PeopleWall />
      <MagazineFooter />
    </div>
  )
}
