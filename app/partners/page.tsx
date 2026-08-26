import { Metadata } from 'next'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export const metadata: Metadata = {
  title: 'Knowledge Partners — CityAge',
  description: 'The organisations that have partnered with CityAge to build The Urban Planet. 100+ knowledge partners across technology, finance, infrastructure, government and design.',
}

const partners = [
  // Technology
  { name: 'Google', src: 'https://cityage.com/wp-content/uploads/google.jpg', sector: 'Technology' },
  { name: 'Microsoft', src: 'https://cityage.com/wp-content/uploads/microsoft.jpg', sector: 'Technology' },
  { name: 'Cisco', src: 'https://cityage.com/wp-content/uploads/cisco.jpg', sector: 'Technology' },
  { name: 'IBM Watson', src: 'https://cityage.com/wp-content/uploads/ibmmwatson.jpg', sector: 'Technology' },
  { name: 'Dell', src: 'https://cityage.com/wp-content/uploads/dell.png', sector: 'Technology' },
  { name: 'SAP', src: 'https://cityage.com/wp-content/uploads/sap.jpg', sector: 'Technology' },
  { name: 'Autodesk', src: 'https://cityage.com/wp-content/uploads/autodesk.jpg', sector: 'Technology' },
  { name: 'Bentley', src: 'https://cityage.com/wp-content/uploads/bentley.png', sector: 'Technology' },
  { name: 'Genetec', src: 'https://cityage.com/wp-content/uploads/genetec.png', sector: 'Technology' },
  // Finance & Professional Services
  { name: 'Deloitte', src: 'https://cityage.com/wp-content/uploads/deloitte.jpg', sector: 'Finance & Professional Services' },
  { name: 'PwC', src: 'https://cityage.com/wp-content/uploads/pwc.jpg', sector: 'Finance & Professional Services' },
  { name: 'KPMG', src: 'https://cityage.com/wp-content/uploads/kpgm.jpg', sector: 'Finance & Professional Services' },
  { name: 'EY', src: 'https://cityage.com/wp-content/uploads/ey.jpg', sector: 'Finance & Professional Services' },
  { name: 'Mastercard', src: 'https://cityage.com/wp-content/uploads/mastercard.jpg', sector: 'Finance & Professional Services' },
  { name: 'CBRE', src: 'https://cityage.com/wp-content/uploads/cbre.jpg', sector: 'Finance & Professional Services' },
  { name: 'Meridiam', src: 'https://cityage.com/wp-content/uploads/meridiam.jpg', sector: 'Finance & Professional Services' },
  { name: 'White & Case', src: 'https://cityage.com/wp-content/uploads/whitecase.jpg', sector: 'Finance & Professional Services' },
  { name: 'Sunlife Financial', src: 'https://cityage.com/wp-content/uploads/sunife-financial.jpg', sector: 'Finance & Professional Services' },
  // Infrastructure & Engineering
  { name: 'AECOM', src: 'https://cityage.com/wp-content/uploads/aecom.jpg', sector: 'Infrastructure & Engineering' },
  { name: 'WSP', src: 'https://cityage.com/wp-content/uploads/wsp.jpg', sector: 'Infrastructure & Engineering' },
  { name: 'Jacobs', src: 'https://cityage.com/wp-content/uploads/jacobs.jpg', sector: 'Infrastructure & Engineering' },
  { name: 'HDR', src: 'https://cityage.com/wp-content/uploads/hdr.jpg', sector: 'Infrastructure & Engineering' },
  { name: 'Black & Veatch', src: 'https://cityage.com/wp-content/uploads/blackveatch.jpeg', sector: 'Infrastructure & Engineering' },
  { name: 'Burns McDonnell', src: 'https://cityage.com/wp-content/uploads/burns-mcdonell.jpg', sector: 'Infrastructure & Engineering' },
  { name: 'HNTB', src: 'https://cityage.com/wp-content/uploads/hntb.jpg', sector: 'Infrastructure & Engineering' },
  { name: 'VHB', src: 'https://cityage.com/wp-content/uploads/vhb.jpg', sector: 'Infrastructure & Engineering' },
  { name: 'SNC-Lavalin', src: 'https://cityage.com/wp-content/uploads/lavalin.jpg', sector: 'Infrastructure & Engineering' },
  // Media & Communications
  { name: 'Reuters', src: 'https://cityage.com/wp-content/uploads/reuters.png', sector: 'Media & Communications' },
  { name: 'Verizon', src: 'https://cityage.com/wp-content/uploads/verizon.jpg', sector: 'Media & Communications' },
  { name: 'Rogers', src: 'https://cityage.com/wp-content/uploads/rogers.png', sector: 'Media & Communications' },
  { name: 'Shaw', src: 'https://cityage.com/wp-content/uploads/shaw.jpg', sector: 'Media & Communications' },
  { name: 'NTT', src: 'https://cityage.com/wp-content/uploads/ntt.jpg', sector: 'Media & Communications' },
  // Government & Cities
  { name: 'City of Vancouver', src: 'https://cityage.com/wp-content/uploads/vancouver.png', sector: 'Government & Cities' },
  { name: 'City of Toronto', src: 'https://cityage.com/wp-content/uploads/toronto.jpg', sector: 'Government & Cities' },
  { name: 'City of Seattle', src: 'https://cityage.com/wp-content/uploads/seattle.jpg', sector: 'Government & Cities' },
  { name: 'City of Los Angeles', src: 'https://cityage.com/wp-content/uploads/cityofla.jpg', sector: 'Government & Cities' },
  { name: 'City of Kansas', src: 'https://cityage.com/wp-content/uploads/kansas-city-mo.jpg', sector: 'Government & Cities' },
  { name: 'Greater London Authority', src: 'https://cityage.com/wp-content/uploads/greater-london-authoirty.jpg', sector: 'Government & Cities' },
  { name: 'Invest HK', src: 'https://cityage.com/wp-content/uploads/investhk.jpg', sector: 'Government & Cities' },
  { name: 'Province of BC', src: 'https://cityage.com/wp-content/uploads/britishcolumbia.jpg', sector: 'Government & Cities' },
  { name: 'City of Winnipeg', src: 'https://cityage.com/wp-content/uploads/winnipeg.png', sector: 'Government & Cities' },
  // Design & Architecture  
  { name: 'KPF', src: 'https://cityage.com/wp-content/uploads/kpf.jpg', sector: 'Design & Architecture' },
  { name: 'Gensler', src: 'https://cityage.com/wp-content/uploads/ideo.jpg', sector: 'Design & Architecture' },
  { name: 'SOM', src: 'https://cityage.com/wp-content/uploads/som.jpg', sector: 'Design & Architecture' },
  { name: 'Perkins & Will', src: 'https://cityage.com/wp-content/uploads/perkins-wins.jpg', sector: 'Design & Architecture' },
  { name: 'Grimshaw', src: 'https://cityage.com/wp-content/uploads/grimshaw.jpg', sector: 'Design & Architecture' },
  { name: 'NBBJ', src: 'https://cityage.com/wp-content/uploads/nbbj.jpg', sector: 'Design & Architecture' },
  { name: 'Grosvenor', src: 'https://cityage.com/wp-content/uploads/grosvenor.jpg', sector: 'Design & Architecture' },
  // Energy & Environment
  { name: 'Shell', src: 'https://cityage.com/wp-content/uploads/shell.png', sector: 'Energy & Environment' },
  { name: 'EDF', src: 'https://cityage.com/wp-content/uploads/edf.jpg', sector: 'Energy & Environment' },
  { name: 'Veolia', src: 'https://cityage.com/wp-content/uploads/veolia.jpg', sector: 'Energy & Environment' },
  // Education
  { name: 'UBC', src: 'https://cityage.com/wp-content/uploads/ubc.jpg', sector: 'Education' },
  { name: 'NYU', src: 'https://cityage.com/wp-content/uploads/nyu.jpg', sector: 'Education' },
  { name: 'UCLA', src: 'https://cityage.com/wp-content/uploads/ucla.jpg', sector: 'Education' },
  { name: 'McMaster', src: 'https://cityage.com/wp-content/uploads/mcmaster.png', sector: 'Education' },
  { name: 'University of Waterloo', src: 'https://cityage.com/wp-content/uploads/university-waterloo.jpg', sector: 'Education' },
  { name: 'Arizona State', src: 'https://cityage.com/wp-content/uploads/asu.jpg', sector: 'Education' },
  { name: 'SFU', src: 'https://cityage.com/wp-content/uploads/ssfu.jpg', sector: 'Education' },
]

const sectors = [...new Set(partners.map(p => p.sector))]

export default function PartnersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className="border-b border-black bg-black text-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28">
            <div className="max-w-[700px]">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C5A059] block mb-8">
                Knowledge Partners
              </span>
              <h1 className="font-serif font-black text-[2.2rem] md:text-[3.5rem] leading-[1.08] tracking-tight mb-6">
                Organisations we work with.<br />Not for.
              </h1>
              <p className="font-serif text-white/50 text-[16px] md:text-[18px] leading-[1.72] max-w-[560px]">
                Since 2012, CityAge has partnered with more than 100 organisations — from global technology companies to city governments, from sovereign wealth funds to architecture firms — united by a shared commitment to building The Urban Planet.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mt-12 pt-10 border-t border-white/10">
              {[
                { num: '100+', label: 'Knowledge Partners' },
                { num: '15', label: 'Years' },
                { num: '50+', label: 'Cities' },
                { num: '7', label: 'Sectors' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-serif font-black text-[1.8rem] text-white leading-none mb-1">{s.num}</div>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOGO GRID BY SECTOR ── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
          {sectors.map(sector => {
            const sectorPartners = partners.filter(p => p.sector === sector)
            return (
              <div key={sector} className="mb-20">

                {/* Sector header */}
                <div className="flex items-baseline justify-between mb-10 pb-4 border-b-2 border-black">
                  <h2 className="font-serif font-black text-[1.3rem] md:text-[1.6rem] tracking-tight text-black">
                    {sector}
                  </h2>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/25">
                    {sectorPartners.length} partner{sectorPartners.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Logo grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-px bg-black/5">
                  {sectorPartners.map(partner => (
                    <div
                      key={partner.name}
                      className="bg-white flex items-center justify-center p-6 aspect-[3/2] group"
                    >
                      <img
                        src={partner.src}
                        alt={partner.name}
                        className="max-w-full max-h-[36px] w-auto object-contain grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* More partners note */}
          <div className="border-t border-black/10 pt-12 text-center">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/30 mb-2">
              And many more across North America, Europe and Asia
            </p>
            <a
              href="https://cityage.com/knowledge-partners/"
              target="_blank"
              rel="noopener"
              className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40 hover:text-[#C5A059] transition-colors"
            >
              Full partner archive →
            </a>
          </div>
        </section>

        {/* ── BECOME A PARTNER ── */}
        <section className="border-t border-black bg-black text-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C5A059] mb-3">
                Work with us
              </div>
              <p className="font-serif text-white/60 text-[15px] leading-[1.65] max-w-[500px]">
                Knowledge Partnerships are campaigns that create influence, open doors and make a measurable difference. If your organisation is building something that matters in the urban world, we would like to hear from you.
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <a href="/purpose" className="inline-block border border-white/20 text-white font-mono text-[9px] font-bold tracking-[0.2em] uppercase px-6 py-3 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors">
                Our Purpose
              </a>
              <a href="mailto:miro@cityage.com" className="inline-block bg-[#C5A059] text-black font-mono text-[9px] font-bold tracking-[0.2em] uppercase px-6 py-3 hover:bg-white transition-colors">
                Get in Touch →
              </a>
            </div>
          </div>
        </section>

      </main>

      <MagazineFooter />
    </div>
  )
}
