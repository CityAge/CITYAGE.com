import type { Metadata, Viewport } from 'next'
import { Source_Serif_4, JetBrains_Mono, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const sourceSerif = Source_Serif_4({ 
  subsets: ["latin"],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700']
})

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-ui',
  weight: ['400', '500', '600', '700', '800', '900']
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
    <html lang="en" className={`${sourceSerif.variable} ${jetbrains.variable} ${inter.variable}`}>
      <body className="font-serif antialiased bg-[#F9F9F7] text-black selection:bg-[#1A365D] selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
