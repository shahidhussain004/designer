'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Flex, Text, Button, Div } from '@/components/green'
import { authService } from '@/lib/auth'

// Small helper to simulate :hover effect using inline styles and mouse events
const HoverableDiv: React.FC<React.ComponentProps<typeof Div> & { as?: any; href?: string }> = ({ children, style, onMouseEnter, onMouseLeave, ...rest }) => {
  const [hover, setHover] = useState(false)
  const mergedStyle = { ...(style || {}), ...(hover ? { backgroundColor: 'var(--color-neutral-03)' } : {}) }
  return (
    <Div
      {...(rest as any)}
      style={mergedStyle}
      onMouseEnter={(e: any) => { setHover(true); if (typeof onMouseEnter === 'function') onMouseEnter(e) }}
      onMouseLeave={(e: any) => { setHover(false); if (typeof onMouseLeave === 'function') onMouseLeave(e) }}
    >
      {children}
    </Div>
  )
}

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
  const router = useRouter()
  const [user, setUser] = useState<{ fullName: string; email: string; username: string } | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setShowDropdown(false)
    router.push('/')
  }

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
          <Link href="/">
            <Text font="heading-m" color="brand-01">
              Designer Marketplace
            </Text>
          </Link>
          <Flex gap="m" display="s{none} m{flex}">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}>
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

        {/* Auth section */}
        <Flex align-items="center" gap="s">
          {user ? (
            <Div ref={dropdownRef} style={{ position: 'relative' }}>
              <Button
                rank="tertiary"
                variant="neutral"
                size="small"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.fullName || user.username}
              </Button>
              
              {showDropdown && (
                <Div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 'xs',
                    background: 'neutral-02',
                    borderWidth: '4xs',
                    borderColor: 'subtle-01',
                    borderRadius: 's',
                    minWidth: '200px',
                    boxShadow: 'm',
                    zIndex: 50,
                  }}
                >
                  <Flex flex-direction="column" gap="4xs">
                    <HoverableDiv as={Link} href="/dashboard" padding="s m">
                      <Text font="body-regular-s">Dashboard</Text>
                    </HoverableDiv>
                    <HoverableDiv as={Link} href="/dashboard/profile" padding="s m">
                      <Text font="body-regular-s">Profile Settings</Text>
                    </HoverableDiv>
                    <HoverableDiv
                      padding="s m"
                      style={{ borderTop: 'var(--border-4xs) solid var(--color-subtle-01)' }}
                      onClick={handleLogout}
                    >
                      <Text font="body-regular-s" color="danger-01">Logout</Text>
                    </HoverableDiv>
                  </Flex>
                </Div>
              )}
            </Div>
          ) : (
            <>
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
            </>
          )}
        </Flex>
      </Flex>
    </Div>
  )
}
