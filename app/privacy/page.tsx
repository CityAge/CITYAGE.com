import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">
        <article className="max-w-[720px] mx-auto w-full px-6 md:px-12 pt-16 md:pt-24 pb-24 md:pb-36">
          <div className="mb-10 pb-8 border-b border-black/10">
          <span className="type-kicker block mb-4">Legal</span>
          <h1 className="type-title tracking-tight text-black">
            Privacy Policy
          </h1>
        </div>

        <div className="space-y-6 type-body text-black/75">
          <p>
            <strong>Effective September 25, 2026</strong>
          </p>

          <p>
            Your privacy matters. Here is our policy in plain language.
          </p>

          <h2 className="font-serif font-bold text-2xl text-black mt-12 mb-4">What we collect</h2>

          <p>
            If you subscribe to our newsletter, we collect your email address. If you write to us, we collect your name, email address, and your message. Like most websites, we also receive basic technical information — your browser type and which pages you visit.
          </p>

          <h2 className="font-serif font-bold text-2xl text-black mt-12 mb-4">What we do with it</h2>

          <p>
            We use your email to send you what you signed up for. We use your messages to reply to you. We use technical information to keep the site running and secure. That is all.
          </p>

          <h2 className="font-serif font-bold text-2xl text-black mt-12 mb-4">What we never do</h2>

          <p>
            We do not sell your personal information to anyone, for any reason. We do not share it with third parties, except the services we need to operate this website (such as hosting and email delivery) — and they may only use it to do their job.
          </p>

          <h2 className="font-serif font-bold text-2xl text-black mt-12 mb-4">Your rights, everywhere</h2>

          <p>
            Whether you are in Europe, California, Canada, or anywhere else: you can ask us what information we hold about you, correct it, or have it deleted. Email <a href="mailto:info@cityage.com" className="underline">info@cityage.com</a> and we will take care of it.
          </p>

          <h2 className="font-serif font-bold text-2xl text-black mt-12 mb-4">Questions?</h2>

          <p>
            Write to <a href="mailto:info@cityage.com" className="underline">info@cityage.com</a> — CityAge Media, Vancouver, BC.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-black/10">
          <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">
            CityAge Media · Vancouver, BC · <a href="mailto:info@cityage.com" className="hover:text-[#C5A059] transition-colors">info@cityage.com</a>
          </p>
        </div>
        </article>
      </main>

      <MagazineFooter />
    </div>
  )
}
