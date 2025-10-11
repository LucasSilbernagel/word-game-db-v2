import Footer from '@/components/Footer/Footer'
import { Navigation } from '@/components/Navigation/Navigation'
import { APP_METADATA } from '@/lib/constants'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ReactNode } from 'react'
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
  metadataBase: new URL(APP_METADATA.BASE_URL),
  title: APP_METADATA.TITLE,
  description: APP_METADATA.DESCRIPTION,
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: APP_METADATA.TITLE,
    description: APP_METADATA.DESCRIPTION,
    url: APP_METADATA.BASE_URL,
    siteName: APP_METADATA.TITLE,
    images: [
      {
        url: APP_METADATA.OG_IMAGE,
        width: APP_METADATA.OG_IMAGE_WIDTH,
        height: APP_METADATA.OG_IMAGE_HEIGHT,
        alt: APP_METADATA.OG_IMAGE_ALT,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_METADATA.TITLE,
    description: APP_METADATA.DESCRIPTION,
    images: [APP_METADATA.OG_IMAGE],
  },
}

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
