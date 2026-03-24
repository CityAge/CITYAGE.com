import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Editorial display serif — wordmark + headlines (variable weight, local)
const playfair = localFont({
  src: [
    { path: '../public/fonts/playfair-display-latin-wght-normal.woff2', style: 'normal' },
    { path: '../public/fonts/playfair-display-latin-wght-italic.woff2', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
})

// Warm body serif — article text, taglines, excerpts (local)
const baskerville = localFont({
  src: [
    { path: '../public/fonts/libre-baskerville-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/libre-baskerville-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/libre-baskerville-latin-400-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
})

// UI sans-serif (kept for utility text)
const inter = localFont({
  src: '../public/fonts/inter-latin-wght-normal.woff2',
  variable: '--font-ui',
  display: 'swap',
})

// Monospace for metadata, dates, verticals
const jetbrains = localFont({
  src: '../public/fonts/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CityAge | Intelligence for The Urban Planet',
  description: 'The primary intelligence source for global urban leadership. 25,000+ decision-makers across infrastructure, space, energy, defence, and food systems.',
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
    <html lang="en" className={`${playfair.variable} ${baskerville.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="font-serif antialiased bg-[#F9F9F7] text-black selection:bg-[#1A365D] selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
