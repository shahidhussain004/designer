import { useState, useContext } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ThemeContext } from './ThemeProvider'
import {
  GdsFlex,
  GdsText,
  GdsButton,
  GdsDivider,
} from './green'
import {
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Disputes', href: '/disputes', icon: ExclamationTriangleIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useContext(ThemeContext)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (href: string) => location.pathname === href

  return (
    <GdsFlex style={{ minHeight: '100vh' } as any}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: sidebarOpen ? 'block' : 'none',
          width: '256px',
        }}
      >
        <GdsFlex
          flex-direction="column"
          style={{
            height: '100%',
            width: '256px',
            backgroundColor: 'var(--gds-color-l3-background-primary)',
            borderRight: '1px solid var(--gds-color-l3-border-primary)',
          } as any}
        >
          <GdsFlex justify-content="space-between" align-items="center" padding="m">
            <GdsText font-size="heading-s" font-weight="book">
              Admin Panel
            </GdsText>
            <GdsButton rank="tertiary" onClick={() => setSidebarOpen(false)}>
              <XMarkIcon style={{ width: '24px', height: '24px' }} />
            </GdsButton>
          </GdsFlex>
          <GdsFlex flex-direction="column" gap="xs" padding="s" flex="1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <GdsFlex
                  align-items="center"
                  gap="s"
                  padding="s"
                  style={{
                    borderRadius: '8px',
                    backgroundColor: isActive(item.href)
                      ? 'var(--gds-color-l3-background-positive)'
                      : 'transparent',
                    color: isActive(item.href)
                      ? 'var(--gds-color-l3-content-positive)'
                      : 'var(--gds-color-l3-content-secondary)',
                  } as any}
                >
                  <item.icon style={{ width: '20px', height: '20px' }} />
                  <GdsText font-size="body-s">{item.name}</GdsText>
                </GdsFlex>
              </Link>
            ))}
          </GdsFlex>
        </GdsFlex>
      </div>

      {/* Desktop sidebar */}
      <GdsFlex
        flex-direction="column"
        style={{
          display: 'none',
          width: '256px',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          borderRight: '1px solid var(--gds-color-l3-border-primary)',
          backgroundColor: 'var(--gds-color-l3-background-primary)',
        } as any}
        className="desktop-sidebar"
      >
        <GdsFlex padding="m" align-items="center">
          <GdsText font-size="heading-s" font-weight="book">
            Designer Marketplace
          </GdsText>
        </GdsFlex>

        <GdsFlex flex-direction="column" gap="xs" padding="s" flex="1">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} style={{ textDecoration: 'none' }}>
              <GdsFlex
                align-items="center"
                gap="s"
                padding="s"
                style={{
                  borderRadius: '8px',
                  backgroundColor: isActive(item.href)
                    ? 'var(--gds-color-l3-background-positive)'
                    : 'transparent',
                  transition: 'background-color 0.2s',
                } as any}
              >
                <item.icon
                  style={{
                    width: '20px',
                    height: '20px',
                    color: isActive(item.href)
                      ? 'var(--gds-color-l3-content-positive)'
                      : 'var(--gds-color-l3-content-secondary)',
                  }}
                />
                <GdsText
                  font-size="body-s"
                  color={isActive(item.href) ? 'positive' : 'secondary'}
                >
                  {item.name}
                </GdsText>
              </GdsFlex>
            </Link>
          ))}
        </GdsFlex>

        <GdsDivider />

        {/* User section */}
        <GdsFlex flex-direction="column" gap="m" padding="m">
          <GdsFlex align-items="center" gap="s">
            <GdsFlex
              justify-content="center"
              align-items="center"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--gds-color-l3-background-positive)',
              } as any}
            >
              <GdsText font-weight="book" color="positive">
                {user?.fullName?.charAt(0) || 'A'}
              </GdsText>
            </GdsFlex>
            <GdsFlex flex-direction="column" gap="2xs">
              <GdsText font-size="body-s" font-weight="book">
                {user?.fullName || 'Admin'}
              </GdsText>
              <GdsText font-size="body-s" color="secondary">
                {user?.email}
              </GdsText>
            </GdsFlex>
          </GdsFlex>

          <GdsFlex gap="s">
            <GdsButton rank="tertiary" onClick={toggleTheme}>
              {theme === 'light' ? (
                <MoonIcon style={{ width: '20px', height: '20px' }} />
              ) : (
                <SunIcon style={{ width: '20px', height: '20px' }} />
              )}
            </GdsButton>
            <GdsButton rank="secondary" onClick={handleLogout}>
              <GdsFlex align-items="center" gap="xs">
                <ArrowRightOnRectangleIcon style={{ width: '20px', height: '20px' }} />
                <span>Logout</span>
              </GdsFlex>
            </GdsButton>
          </GdsFlex>
        </GdsFlex>
      </GdsFlex>

      {/* Main content */}
      <GdsFlex flex-direction="column" flex="1" className="main-content">
        {/* Mobile top bar */}
        <GdsFlex
          justify-content="space-between"
          align-items="center"
          padding="m"
          className="mobile-topbar"
          style={{
            display: 'none',
            borderBottom: '1px solid var(--gds-color-l3-border-primary)',
            backgroundColor: 'var(--gds-color-l3-background-primary)',
          } as any}
        >
          <GdsButton rank="tertiary" onClick={() => setSidebarOpen(true)}>
            <Bars3Icon style={{ width: '24px', height: '24px' }} />
          </GdsButton>
          <GdsText font-size="heading-s">Admin Panel</GdsText>
          <GdsButton rank="tertiary" onClick={toggleTheme}>
            {theme === 'light' ? (
              <MoonIcon style={{ width: '20px', height: '20px' }} />
            ) : (
              <SunIcon style={{ width: '20px', height: '20px' }} />
            )}
          </GdsButton>
        </GdsFlex>

        {/* Page content */}
        <GdsFlex flex="1" padding="l">
          <Outlet />
        </GdsFlex>
      </GdsFlex>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-sidebar {
            display: flex !important;
          }
          .main-content {
            margin-left: 256px;
          }
          .mobile-topbar {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-topbar {
            display: flex !important;
          }
        }
      `}</style>
    </GdsFlex>
  )
}
