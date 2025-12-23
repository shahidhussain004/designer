'use client'

import React from 'react'
import { GdsFlex, GdsDiv } from '@sebgroup/green-core/react'
import Navbar from './Navbar'
import Footer from './Footer'

interface PageLayoutProps {
  children: React.ReactNode
  showNavbar?: boolean
  showFooter?: boolean
}

export default function PageLayout({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}: PageLayoutProps) {
  return (
    <GdsFlex 
      flex-direction="column" 
      min-height="100vh"
      background="neutral-01"
    >
      {showNavbar && <Navbar />}
      <GdsDiv flex="1" width="100%">
        {children}
      </GdsDiv>
      {showFooter && <Footer />}
    </GdsFlex>
  )
}
