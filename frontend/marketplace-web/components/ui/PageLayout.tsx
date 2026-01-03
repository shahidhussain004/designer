'use client'

import { Footer, Navbar } from '@/components/ui';
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode
  showNavbar?: boolean
  showFooter?: boolean
  title?: string
  /** Use white background instead of gray */
  whiteBg?: boolean
}

export default function PageLayout({ 
  children, 
  showNavbar = true, 
  showFooter = true,
  whiteBg = false,
}: PageLayoutProps) {
  return (
    <div className={`flex flex-col min-h-screen ${whiteBg ? 'bg-white' : 'bg-gray-50'}`}>
      {showNavbar && <Navbar />}
      <main className="flex-1 w-full">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

export type { PageLayoutProps };

