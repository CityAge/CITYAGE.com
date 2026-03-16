import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { OttawaFeature } from '@/components/ottawa-feature'
import { VoiceSection } from '@/components/voice-section'
import { FoundationsGrid } from '@/components/foundations-grid'
import { CityAgeMagazine } from '@/components/cityage-magazine'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <Header />
      <Hero />
      <OttawaFeature />
      <VoiceSection />
      <FoundationsGrid />
      <CityAgeMagazine />
      <Footer />
    </main>
  )
}
