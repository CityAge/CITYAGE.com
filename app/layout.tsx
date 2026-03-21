import type { Metadata } from 'next'
import { Source_Serif_4, Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'The Human Touch — AI Through a Human Lens',
  description: 'A weekly journal on what artificial intelligence means for cities, institutions, and the way we live. By Miro Cernetig.',
  openGraph: {
    title: 'The Human Touch',
    description: 'AI Through a Human Lens',
    siteName: 'thehumantouch.ai',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-serif)' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
