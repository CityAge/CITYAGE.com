import { Metadata } from 'next'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { fetchPeopleWallFaces, shuffle } from '@/lib/speakers'
import { PeopleWall } from './people-wall'

export const metadata: Metadata = {
  title: 'People — CityAge',
  description: 'The CityAge Contributors.',
}

export const revalidate = 3600

export default async function PeoplePage() {
  const speakers = shuffle(await fetchPeopleWallFaces())

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />
      <PeopleWall speakers={speakers} />
      <MagazineFooter />
    </div>
  )
}
