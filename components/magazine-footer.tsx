import { LOGO_WHITE } from '@/components/magazine-header-chrome'

export function MagazineFooter() {
  return (
    <footer className="bg-black text-white py-16 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10">

        {/* Brand */}
        <div className="md:col-span-4 space-y-5">
          <h2 className="m-0">
            {/* Drawn mark — same as the masthead, white, smaller. Not a web-font CITYAGE. */}
            <img
              src={LOGO_WHITE}
              alt="CITYAGE"
              width={517}
              height={119}
              className="block h-auto w-[min(64vw,18rem)]"
              decoding="async"
            />
          </h2>
          <p className="font-serif text-white text-[18px] md:text-[20px] leading-snug">
            Intelligence for The Urban Planet
          </p>
          <p className="font-serif text-white/80 text-[16px] md:text-[17px] leading-relaxed">
            Earth’s two per cent. Where everything happens.
          </p>
          <a
            href="/subscribe"
            className="inline-block bg-[#C5A059] text-black px-8 py-2.5 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-white transition-colors"
          >
            Subscribe
          </a>
          <p className="font-serif text-white/70 text-[14px] pt-2">
            © CityAge 2026
          </p>
        </div>

        {/* House */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-[13px] font-bold tracking-[0.18em] uppercase text-white">CityAge</h3>
          <ul className="text-[15px] space-y-3 text-white/70">
            <li><a href="/purpose" className="hover:text-white transition-colors">Purpose</a></li>
            <li><a href="/partners" className="hover:text-white transition-colors">Partners</a></li>
            <li><a href="/studio" className="hover:text-white transition-colors">Studio</a></li>
            <li><a href="/subscribe" className="hover:text-white transition-colors">Subscribe</a></li>
          </ul>
        </div>

        {/* Discover */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-[13px] font-bold tracking-[0.18em] uppercase text-white">Discover</h3>
          <ul className="text-[15px] space-y-3 text-white/70">
            <li><a href="/dispatches" className="hover:text-white transition-colors">Dispatches</a></li>
            <li><a href="/the-next-west" className="hover:text-white transition-colors">The Next West</a></li>
            <li><a href="/northern-century" className="hover:text-white transition-colors">Northern Century</a></li>
            <li><a href="/next-vancouver" className="hover:text-white transition-colors">Next Vancouver</a></li>
            <li><a href="/advisory" className="hover:text-white transition-colors">Advisory</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-[13px] font-bold tracking-[0.18em] uppercase text-white">
            <a href="mailto:info@cityage.com" className="hover:text-white transition-colors">
              Contact
            </a>
          </h3>
          <address className="text-[15px] not-italic text-white/70 leading-relaxed space-y-2">
            <div>CityAge Media</div>
            <div>
              <a href="mailto:info@cityage.com" className="hover:text-white transition-colors">
                info@cityage.com
              </a>
            </div>
            <div>
              <a
                href="https://www.linkedin.com/company/cityage/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </address>
        </div>

        {/* Legal */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-[13px] font-bold tracking-[0.18em] uppercase text-white">
            Legal
          </h3>
          <ul className="text-[15px] space-y-3 text-white/70">
            <li>
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
