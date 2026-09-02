import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Newsreader (all text) is registered with @font-face in globals.css and
// preloaded below; --font-serif and --font-display point at it there.

// Monospace for metadata, dates, verticals — not on the first cream screen
const jetbrains = localFont({
  src: '../public/fonts/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-mono',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: 'CityAge | Intelligence for The Urban Planet',
  description: 'The primary intelligence source for global urban leadership. 25,000 decision-makers across infrastructure, space, energy, defence, and food systems.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#F9F9F7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={jetbrains.variable}
      style={{ backgroundColor: '#F9F9F7' }}
    >
      <head>
        <link
          rel="preload"
          href="/fonts/newsreader-latin-opsz-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/newsreader-latin-opsz-italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style
          dangerouslySetInnerHTML={{
            __html:
              'html,body{background:#F9F9F7}.ca-photo{position:relative;overflow:hidden;display:block;width:100%}.ca-photo-banner{height:128px;max-width:1000px;width:calc(100% - 3rem);margin:0 auto}@media (min-width:768px){.ca-photo-banner{height:240px}}.ca-photo-lead{aspect-ratio:4/3}@media (min-width:1024px){.ca-photo-lead{aspect-ratio:3/4}}.ca-photo-well{aspect-ratio:4/3}.ca-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;max-width:none}',
          }}
        />
      </head>
      <body
        className="font-serif antialiased bg-[#F9F9F7] text-black selection:bg-[#1A365D] selection:text-white"
        style={{ backgroundColor: '#F9F9F7' }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
