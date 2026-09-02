import type { Metadata } from 'next'
import { SectionPage } from '@/components/section-page'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Cities — CityAge',
}

export default function CitiesPage() {
  return <SectionPage name="Cities" />
}
