import type { Metadata, Viewport } from 'next'
import './globals.css'
import PWARegister from './PWARegister'
import { SkipLink } from '@/components/ui/Accessibility'
import { ThemeProvider } from '@/lib/theme'
import { CookiesConsent } from '@/components/ui/CookiesConsent'

export const metadata: Metadata = {
  title: 'Designer Marketplace - Find Freelance Talent',
  description: 'Connect with top designers and developers for your projects',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#003824',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#003824" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/images/landing-poster.svg" as="image" type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body suppressHydrationWarning>
        {/* Skip Link for keyboard accessibility - WCAG 2.4.1 */}
        <SkipLink targetId="main-content" />
        
        <PWARegister />
        
        <ThemeProvider>
          {/* Main content wrapper with ARIA landmark */}
          <div id="main-content" role="main" tabIndex={-1}>
            {children}
          </div>
          
          {/* Cookies Consent Component */}
          <CookiesConsent />
        </ThemeProvider>
        
        {/* Live region for dynamic announcements */}
        <div
          id="live-announcements"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      </body>
    </html>
  )
}
