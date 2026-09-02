import { Metadata } from 'next'
import Link from 'next/link'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { SubscribeForm } from './subscribe-form'

export const metadata: Metadata = {
  title: 'Subscribe — CityAge',
  description: 'The letter. Intelligence for the Urban Planet.',
}

export default function SubscribePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">
        <article className="pt-16 md:pt-24 pb-24 md:pb-36">
          <div className="max-w-[720px] mx-auto px-6 md:px-12">
            <h1 className="type-title tracking-tight text-black mb-6">
              The letter.
            </h1>
            <p className="type-body text-black mb-12">
              Intelligence for the Urban Planet.
            </p>

            <SubscribeForm />

            <p className="mt-10">
              <Link
                href="/privacy"
                className="font-serif text-[16px] text-black/55 underline underline-offset-4 decoration-black/20 hover:text-[#C5A059] hover:decoration-[#C5A059] transition-colors"
              >
                Privacy
              </Link>
            </p>
          </div>
        </article>
      </main>

      <MagazineFooter />
    </div>
  )
}
