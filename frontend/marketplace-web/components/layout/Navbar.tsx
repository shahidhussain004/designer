'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flex, Text, Button, Div } from '@/components/green'
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
    <Div background="neutral-02" border-width="0 0 4xs 0" border-color="subtle-01">
      <Flex 
        justify-content="space-between" 
        align-items="center"
        padding="m l"
        max-width="1280px"
        margin="0 auto"
        width="100%"
      >
        {/* Logo and navigation */}
        <Flex align-items="center" gap="xl">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Text font="heading-m" color="brand-01">
              Designer Marketplace
            </Text>
          </Link>
          <Flex gap="m" display="s{none} m{flex}">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  font="body-regular-m"
                  color={pathname === item.href ? 'brand-01' : 'neutral-01'}
                >
                  {item.label}
                </Text>
              </Link>
            ))}
          </Flex>
        </Flex>

        {/* Auth buttons */}
        <Flex align-items="center" gap="s">
          <Button
            rank="tertiary"
            variant="neutral"
            size="small"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
          <Link href="/auth/login">
            <Button rank="tertiary" variant="neutral" size="small">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button rank="primary" size="small">
              Sign Up
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Div>
  )
}
