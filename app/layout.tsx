import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ThemeProvider from '@/components/providers/ThemeProvider'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'NewsDigest — Daily Current Affairs for Competitive Exams',
    template: '%s | NewsDigest',
  },
  description: 'Read the most important current affairs in 15 minutes. Designed for UPSC, PCS, SSC, Banking & Defence aspirants. AI-curated news with exam relevance scores, MCQs, and revision notes.',
  keywords: ['current affairs', 'UPSC', 'competitive exams', 'daily news', 'SSC', 'banking exam', 'IAS preparation'],
  authors: [{ name: 'NewsDigest' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://newsdigest.in',
    siteName: 'NewsDigest',
    title: 'NewsDigest — Daily Current Affairs for Competitive Exams',
    description: 'Read the most important current affairs in 15 minutes. For UPSC, PCS, SSC & Banking aspirants.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewsDigest — Daily Current Affairs',
    description: 'Read the most important current affairs in 15 minutes.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main id="main-content" style={{ minHeight: 'calc(100vh - 64px)' }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
