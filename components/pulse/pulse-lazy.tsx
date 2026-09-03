'use client'

import dynamic from 'next/dynamic'

/** MapLibre needs the window; load the globe on the client only. */
export const PulseLazy = dynamic(() => import('./pulse-globe').then((m) => m.PulseGlobe), {
  ssr: false,
  loading: () => <div className="pulse pulse-embed-loading" style={{ background: '#000', width: '100%', height: '100%' }} aria-hidden="true" />,
})
