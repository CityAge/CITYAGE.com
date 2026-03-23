import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const crimsonPro = localFont({
  src: [
    {
      path: '../public/fonts/crimson-pro-latin-wght-normal.woff2',
      style: 'normal',
    },
    {
      path: '../public/fonts/crimson-pro-latin-wght-italic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-serif',
  display: 'swap',
})

const inter = localFont({
  src: '../public/fonts/inter-latin-wght-normal.woff2',
  variable: '--font-ui',
  display: 'swap',
})

const jetbrains = localFont({
  src: '../public/fonts/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CityAge | Intelligence for the Urban Planet',
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
    <html lang="en" className={`${crimsonPro.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="font-serif antialiased bg-[#F9F9F7] text-black selection:bg-[#1A365D] selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
