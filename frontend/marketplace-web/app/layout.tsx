import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PWARegister from './PWARegister'
import { SkipLink } from '@/components/ui/Accessibility'

const inter = Inter({ subsets: ['latin'] })

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
  themeColor: '#3B82F6',
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
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3B82F6" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        {/* Skip Link for keyboard accessibility - WCAG 2.4.1 */}
        <SkipLink targetId="main-content" />
        
        <PWARegister />
        
        {/* Main content wrapper with ARIA landmark */}
        <div id="main-content" role="main" tabIndex={-1}>
          {children}
        </div>
        
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