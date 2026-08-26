import { Metadata } from 'next'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export const metadata: Metadata = {
  title: 'Knowledge Partners — CityAge',
  description: 'CityAge Knowledge Partners. Institutions that took part as partners.',
}

// Existing names only. No logos. Do not add anyone who is not already on this list.
const partners = [
  'Google',
  'Microsoft',
  'Cisco',
  'IBM Watson',
  'Dell',
  'SAP',
  'Autodesk',
  'Bentley',
  'Genetec',
  'Deloitte',
  'PwC',
  'KPMG',
  'EY',
  'Mastercard',
  'CBRE',
  'Meridiam',
  'White & Case',
  'Sunlife Financial',
  'AECOM',
  'WSP',
  'Jacobs',
  'HDR',
  'Black & Veatch',
  'Burns McDonnell',
  'HNTB',
  'VHB',
  'SNC-Lavalin',
  'Reuters',
  'Verizon',
  'Rogers',
  'Shaw',
  'NTT',
  'City of Vancouver',
  'City of Toronto',
  'City of Seattle',
  'City of Los Angeles',
  'City of Kansas',
  'Greater London Authority',
  'Invest HK',
  'Province of BC',
  'City of Winnipeg',
  'KPF',
  'Gensler',
  'SOM',
  'Perkins & Will',
  'Grimshaw',
  'NBBJ',
  'Grosvenor',
  'Shell',
  'EDF',
  'Veolia',
  'UBC',
  'NYU',
  'UCLA',
  'McMaster',
  'University of Waterloo',
  'Arizona State',
  'SFU',
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow bg-[#F9F9F7]">
        <section className="max-w-[1400px] mx-auto w-full px-6 md:px-10 py-10 md:py-14">
          <div className="bg-black text-white px-6 md:px-12 py-12 md:py-16">
            <h1 className="font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-white mb-10 md:mb-14">
              CityAge Knowledge Partners
            </h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-3 md:gap-y-4">
              {partners.map((name) => (
                <li
                  key={name}
                  className="font-serif text-[18px] md:text-[21px] leading-snug text-white"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <MagazineFooter />
    </div>
  )
}
