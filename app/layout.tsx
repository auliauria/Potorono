import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dusun Potorono — Banguntapan, Bantul',
  description: 'Website resmi Dusun Potorono.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // ✅ data-scroll-behavior="smooth" untuk Next.js 16
    // ✅ suppressHydrationWarning untuk browser extension
    <html
      lang="id"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}