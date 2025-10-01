import Footer from '@/components/footer'
import { Navigation } from '@/components/navigation'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://wordgamedb.com'),
  title: 'Word Game DB',
  description:
    'A REST API for building word games and puzzles. Word Game DB is designed for educational purposes, helping developers practice their coding skills by building word games that incorporate an API. Each word comes with a category, letter count, syllable count, and helpful hint.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Word Game DB',
    description:
      'A REST API for building word games and puzzles. Word Game DB is designed for educational purposes, helping developers practice their coding skills by building word games that incorporate an API. Each word comes with a category, letter count, syllable count, and helpful hint.',
    url: 'https://wordgamedb.com',
    siteName: 'Word Game DB',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Word Game DB - A REST API for building word games and puzzles',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word Game DB',
    description:
      'A REST API for building word games and puzzles. Word Game DB is designed for educational purposes, helping developers practice their coding skills by building word games that incorporate an API. Each word comes with a category, letter count, syllable count, and helpful hint.',
    images: ['/og-image.png'],
  },
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://lucassilbernagel.com" />

        {/* Preload critical resources */}
        <link rel="preload" href="/og-image.png" as="image" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <header>
          <Navigation />
        </header>
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

export default RootLayout
