import type { Metadata } from 'next'
import { SectionPage } from '@/components/section-page'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Money — CityAge',
}

export default function MoneyPage() {
  return <SectionPage name="Money" />
}
