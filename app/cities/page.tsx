import type { Metadata } from 'next'
import { SectionPage } from '@/components/section-page'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Cities — CityAge',
  description: "Architecture, infrastructure and mobility: how the world's cities are built and run.",
  alternates: { canonical: '/cities' },
}

export default function CitiesPage() {
  return <SectionPage name="Cities" />
}
