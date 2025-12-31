'use client'

import { Div, Flex } from '@/components/green'
import React from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

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

export type { PageLayoutProps }

