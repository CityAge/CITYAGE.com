import type { Metadata } from 'next'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact — CityAge',
  description: 'Tell us who you are and which room you belong in.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow bg-[#111111] text-[#F9F9F7]">
        <div className="max-w-[640px] mx-auto px-6 py-16 md:py-24">
          <span className="type-kicker block mb-5">Contact</span>
          <h1 className="type-lead-h text-white mb-4">CityAge.</h1>
          <p className="type-deck text-[#F9F9F7]/85 mb-3">Vancouver · Ottawa · Washington.</p>
          <p className="type-body text-[#F9F9F7] mb-12">Tell us who you are and which room you belong in.</p>

          <ContactForm />

          <p className="font-serif text-[15px] leading-[1.6] text-[#F9F9F7]/80 mt-12">
            <a href="mailto:info@cityage.com" className="story-link">
              info@cityage.com
            </a>
            <span className="mx-3 text-[#F9F9F7]/30">·</span>
            <a
              href="https://www.linkedin.com/company/cityage/"
              target="_blank"
              rel="noopener noreferrer"
              className="story-link"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </main>

      <MagazineFooter />
    </div>
  )
}
