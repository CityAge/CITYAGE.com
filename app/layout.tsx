import type { Metadata, Viewport } from 'next'
import { EB_Garamond, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700', '800']
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900']
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'The Human Touch — AI Through a Human Lens',
  description: 'A weekly journal on artificial intelligence and its impact on how we live, build, and govern. By Miro Cernetig.',
}

export const viewport: Viewport = {
  themeColor: '#FFFFF8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${garamond.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-serif antialiased bg-[#FFFFF8] text-[#1a1a1a]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
