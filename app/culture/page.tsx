import type { Metadata } from 'next'
import { SectionPage } from '@/components/section-page'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Culture — CityAge',
  description: 'Food and urban life: the culture of the urban planet.',
  alternates: { canonical: '/culture' },
}

export default function CulturePage() {
  return <SectionPage name="Culture" />
}
