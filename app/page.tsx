import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { OttawaFeature } from '@/components/ottawa-feature'
import { FoundationsGrid } from '@/components/foundations-grid'
import { VoiceSection } from '@/components/voice-section'
import { CityAgeMagazine } from '@/components/cityage-magazine'
import { Footer } from '@/components/footer'

export const revalidate = 60

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <Header />
      <Hero />
      <OttawaFeature />
      <FoundationsGrid />
      <VoiceSection />
      <CityAgeMagazine />
      <Footer />
    </main>
  )
}
