'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GdsFlex, GdsText, GdsButton, GdsDiv } from '@sebgroup/green-core/react'
import { useTheme } from '@/lib/theme'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Courses', href: '/courses' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <GdsDiv background="neutral-02" border-width="0 0 4xs 0" border-color="subtle-01">
      <GdsFlex 
        justify-content="space-between" 
        align-items="center"
        padding="m l"
        max-width="1280px"
        margin="0 auto"
        width="100%"
      >
        {/* Logo and navigation */}
        <GdsFlex align-items="center" gap="xl">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <GdsText font="heading-m" color="brand-01">
              Designer Marketplace
            </GdsText>
          </Link>
          <GdsFlex gap="m" display="s{none} m{flex}">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                style={{ textDecoration: 'none' }}
              >
                <GdsText 
                  font="body-regular-m"
                  color={pathname === item.href ? 'brand-01' : 'neutral-01'}
                >
                  {item.label}
                </GdsText>
              </Link>
            ))}
          </GdsFlex>
        </GdsFlex>

        {/* Auth buttons */}
        <GdsFlex align-items="center" gap="s">
          <GdsButton
            rank="tertiary"
            variant="neutral"
            size="small"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </GdsButton>
          <Link href="/auth/login">
            <GdsButton rank="tertiary" variant="neutral" size="small">
              Login
            </GdsButton>
          </Link>
          <Link href="/auth/register">
            <GdsButton rank="primary" size="small">
              Sign Up
            </GdsButton>
          </Link>
        </GdsFlex>
      </GdsFlex>
    </GdsDiv>
  )
}
