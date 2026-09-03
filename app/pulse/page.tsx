import type { Metadata } from 'next'
import { PulseHeader } from '@/components/pulse/pulse-header'
import { PulseLazy } from '@/components/pulse/pulse-lazy'

export const metadata: Metadata = {
  title: 'Northern Pulse — CityAge',
  description: 'The world from the two poles.',
  openGraph: { images: ['/pulse/poster.jpg'] },
}

export default async function PulsePage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { p } = await searchParams
  return (
    <div className="min-h-screen bg-[#F9F9F7] text-black">
      <PulseHeader />
      <main>
        <PulseLazy mode="page" initialSlug={p} />
      </main>
    </div>
  )
}
