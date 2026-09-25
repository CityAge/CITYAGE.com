import type { Metadata } from 'next'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { NoteForm } from '@/components/note-form'

export const metadata: Metadata = {
  title: 'Contact — CityAge',
  description: 'Every note is read by Miro Cernetig.',
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string | string[] }>
}) {
  const { subject } = await searchParams
  const selectedSubject = subject === 'contribute'
    ? 'contributing a story or idea'
    : subject === 'studio' ? 'the Studio' : undefined
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow bg-[#111111] text-[#F9F9F7]">
        <div className="relative max-w-[640px] mx-auto px-6 py-16 md:py-24">
          <span className="type-kicker block mb-5">Contact</span>
          <h1 className="type-lead-h text-white mb-4">Write to us.</h1>
          <p className="type-deck text-[#F9F9F7]/85 mb-3">Vancouver · Ottawa · Washington.</p>
          <p className="type-body text-[#F9F9F7] mb-12">
            Every note is read by Miro Cernetig.
          </p>

          <NoteForm source="contact" subject={selectedSubject} tone="dark" />
        </div>
      </main>

      <MagazineFooter />
    </div>
  )
}
