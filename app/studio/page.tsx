import { Metadata } from 'next'
import { StudioHouse } from './studio-house'

export const metadata: Metadata = {
  title: 'Studio — CityAge',
  description: 'CityAge Studio: end-to-end storytelling. Facing Saddam, Solar Earth, Giltrude’s Dwelling.',
}

export default function StudioPage() {
  return <StudioHouse />
}
