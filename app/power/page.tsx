import type { Metadata } from 'next'
import { SectionPage } from '@/components/section-page'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Power — CityAge',
  description: 'Defence, energy infrastructure, trade and the politics of the urban planet. Analysis from CityAge.',
  alternates: { canonical: '/power' },
}

export default function PowerPage() {
  return <SectionPage name="Power" />
}
