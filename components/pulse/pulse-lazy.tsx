'use client'

import dynamic from 'next/dynamic'

const load = () => import('./pulse-globe')
// Start fetching the globe chunk as soon as this module evaluates, ahead of hydration.
if (typeof window !== 'undefined') void load()

/** MapLibre needs the window; load the globe on the client only. */
export const PulseLazy = dynamic(() => load().then((m) => m.PulseGlobe), {
  ssr: false,
  loading: () => <div className="pulse pulse-embed-loading" style={{ background: '#000', width: '100%', height: '100%' }} aria-hidden="true" />,
})
