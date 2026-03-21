'use client'

export function SponsorshipBanner() {
  return (
    <div className="bg-[#1A365D] py-2 px-6 md:px-12">
      <div className="max-w-[1800px] mx-auto text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] text-[#C5A059] uppercase">
          Global Sponsor: Orbit — Building the Future Space Economy &nbsp;|&nbsp; 
          <a href="https://orbit.cityage.com" className="underline underline-offset-2 hover:text-white transition-colors">
            Learn More
          </a>
        </p>
      </div>
    </div>
  )
}
