'use client'

import { Div, Flex } from '@/components/green';
import { Footer, Navbar } from '@/components/ui';
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode
  showNavbar?: boolean
  showFooter?: boolean
  title?: string
}

export default function PageLayout({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}: PageLayoutProps) {
  return (
      <Flex 
        flex-direction="column" 
        min-height="100vh"
        background="neutral-01"
      >
        {showNavbar && <Navbar />}
        <Div flex="1" width="100%">
          {children}
        </Div>
        {showFooter && <Footer />}
      </Flex>
  )
}

export type { PageLayoutProps };

