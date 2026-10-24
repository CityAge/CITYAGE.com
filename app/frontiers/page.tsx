import type { Metadata } from 'next'
import { SectionPage } from '@/components/section-page'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Frontiers — CityAge',
  description: 'Space, AI, oceans, energy and health: the frontiers reshaping the urban planet.',
  alternates: { canonical: '/frontiers' },
}

export default function FrontiersPage() {
  return <SectionPage name="Frontiers" />
}
