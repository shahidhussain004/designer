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

/**
 * Loading skeleton shown while Green Core components are loading on client side.
 * This prevents flash of unstyled content and hydration mismatches.
 */
function _LoadingSkeleton() {
  return (
    <div>
      {/* Navbar skeleton */}
      <div>
        {/* Content skeleton */}
      </div>
      <div />
      {/* Footer skeleton */}
    </div>
  )
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
