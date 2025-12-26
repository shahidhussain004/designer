'use client'

import React from 'react'
import { Flex, Div } from '@/components/green'
import Navbar from './Navbar'
import Footer from './Footer'

interface PageLayoutProps {
  children: React.ReactNode
  showNavbar?: boolean
  showFooter?: boolean
}

/**
 * Loading skeleton shown while Green Core components are loading on client side.
 * This prevents flash of unstyled content and hydration mismatches.
 */
function LoadingSkeleton() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Navbar skeleton */}
      <div style={{
        height: '64px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0'
      }} />
      {/* Content skeleton */}
      <div style={{ flex: 1 }} />
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
