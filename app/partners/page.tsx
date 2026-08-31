import { Metadata } from 'next'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export const metadata: Metadata = {
  title: 'Knowledge Partners — CityAge',
}

const NAMES = [
  'ACEC',
  'AECOM',
  'AirSage',
  'Andersen Construction',
  'Arizona State University',
  'Autodesk',
  'Bank of China',
  'BC Business Council',
  'Bentley',
  'Bioenterprise',
  'Black & Veatch',
  'BridgeTower',
  'Burns & McDonnell',
  'Business Council of Canada',
  'California Water District',
  'Canada-Estonia Business Council',
  'CBRE',
  'CGI',
  'Cisco',
  'City of Abbotsford',
  'City of Kitchener',
  'City of Los Angeles',
  'City of Seattle',
  'City of Toronto',
  'City of Vancouver',
  'City of Waterloo',
  'City of Winnipeg',
  'City Possible',
  'Communitech',
  'CubicFarms',
  'Dell',
  'Deloitte',
  'DJC Oregon',
  'EDF',
  'Embassy of Estonia',
  'Emily Carr University',
  'Ewing Marion Kauffman Foundation',
  'EY',
  'Fairfax Economic Development Authority',
  'Farm Credit',
  'Fortis BC',
  'Fraser Valley',
  'Genetec',
  'Genome BC',
  'Google',
  'Government of Canada',
  'Greater London Authority',
  'Grimshaw',
  'Grosvenor Americas',
  'HDR',
  'Hitachi',
  'HNTB',
  'Houston Partners',
  'IBI Group',
  'IBM Watson',
  'IDEO',
  'Intel',
  'Intellectual Property Ontario',
  'Invest Ottawa',
  'Invest WindsorEssex',
  'InvestHK',
  'Jacobs',
  'Kansas City',
  'KPF',
  'KPMG',
  'Lixar',
  'MaRS',
  'Mastercard',
  'McMaster University',
  'Meridiam',
  'Metro Vancouver',
  'Microsoft',
  'Miller Hull',
  'NBBJ',
  'New York City',
  'NTT',
  'NYC Economic Development Corporation',
  'NYU',
  'Patriot One',
  'Perkins&Will',
  'PHEMI',
  'Populous',
  'Province of British Columbia',
  'PwC',
  'Reuters',
  'Rogers',
  'RXR',
  'Santa Monica',
  'SAP',
  'Shaw',
  'Shell Energy',
  'Siemens',
  'Simon Fraser University',
  'SNC-Lavalin',
  'SOM',
  'Space Camp',
  'Space Port Association',
  'St. Clair',
  'Stantec',
  'Sun Life Financial',
  'The Vancouver Sun',
  'ThoughtWire',
  'UCLA',
  'University of British Columbia',
  'University of Victoria',
  'University of Waterloo',
  'University of Windsor',
  'Veolia',
  'Verizon',
  'VHB',
  'Wesgroup',
  'White & Case',
  'World Economic Forum',
  'WSP',
] as const

export default function PartnersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-24 md:pb-36">
          <div className="max-w-[820px]">
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] block mb-10">
              Knowledge Partners
            </span>
            <p className="font-serif text-[18px] md:text-[21px] leading-[1.85] text-black">
              {NAMES.join(' · ')}
            </p>
          </div>
        </div>
      </main>

      <MagazineFooter />
    </div>
  )
}
