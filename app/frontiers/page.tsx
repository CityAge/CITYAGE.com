import type { Metadata } from 'next'
import { SectionPage } from '@/components/section-page'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Frontiers — CityAge',
}

export default function FrontiersPage() {
  return <SectionPage name="Frontiers" />
}
