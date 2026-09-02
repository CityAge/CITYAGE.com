import type { Metadata } from 'next'
import { SectionPage } from '@/components/section-page'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Power — CityAge',
}

export default function PowerPage() {
  return <SectionPage name="Power" />
}
