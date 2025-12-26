import { useState, useContext } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ThemeContext } from './ThemeProvider'
import {
  Flex,
  Text,
  Button,
  Divider,
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
    <Flex style={{ minHeight: '100vh' } as any}>
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
        <Flex
          flex-direction="column"
          style={{
            height: '100%',
            width: '256px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e5e7eb',
          } as any}
        >
          <Flex justify-content="space-between" align-items="center" padding="m">
            <Text font-size="heading-s" font-weight="book">
              Admin Panel
            </Text>
            <Button rank="tertiary" onClick={() => setSidebarOpen(false)}>
              <XMarkIcon style={{ width: '24px', height: '24px' }} />
            </Button>
          </Flex>
          <Flex flex-direction="column" gap="xs" padding="s" flex="1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <Flex
                  align-items="center"
                  gap="s"
                  padding="s"
                  style={{
                    borderRadius: '8px',
                    backgroundColor: isActive(item.href)
                      ? '#dcfce7'
                      : 'transparent',
                    color: isActive(item.href)
                      ? '#16a34a'
                      : '#6b7280',
                  } as any}
                >
                  <item.icon style={{ width: '20px', height: '20px' }} />
                  <Text font-size="body-s">{item.name}</Text>
                </Flex>
              </Link>
            ))}
          </Flex>
        </Flex>
      </div>

      {/* Desktop sidebar */}
      <Flex
        flex-direction="column"
        style={{
          display: 'none',
          width: '256px',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
        } as any}
        className="desktop-sidebar"
      >
        <Flex padding="m" align-items="center">
          <Text font-size="heading-s" font-weight="book">
            Designer Marketplace
          </Text>
        </Flex>

        <Flex flex-direction="column" gap="xs" padding="s" flex="1">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} style={{ textDecoration: 'none' }}>
              <Flex
                align-items="center"
                gap="s"
                padding="s"
                style={{
                  borderRadius: '8px',
                  backgroundColor: isActive(item.href)
                    ? '#dcfce7'
                    : 'transparent',
                  transition: 'background-color 0.2s',
                } as any}
              >
                <item.icon
                  style={{
                    width: '20px',
                    height: '20px',
                    color: isActive(item.href)
                      ? '#16a34a'
                      : '#6b7280',
                  }}
                />
                <Text
                  font-size="body-s"
                  color={isActive(item.href) ? 'positive' : 'secondary'}
                >
                  {item.name}
                </Text>
              </Flex>
            </Link>
          ))}
        </Flex>

        <Divider />

        {/* User section */}
        <Flex flex-direction="column" gap="m" padding="m">
          <Flex align-items="center" gap="s">
            <Flex
              justify-content="center"
              align-items="center"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
              } as any}
            >
              <Text font-weight="book" color="positive">
                {user?.fullName?.charAt(0) || 'A'}
              </Text>
            </Flex>
            <Flex flex-direction="column" gap="2xs">
              <Text font-size="body-s" font-weight="book">
                {user?.fullName || 'Admin'}
              </Text>
              <Text font-size="body-s" color="secondary">
                {user?.email}
              </Text>
            </Flex>
          </Flex>

          <Flex gap="s">
            <Button rank="tertiary" onClick={toggleTheme}>
              {theme === 'light' ? (
                <MoonIcon style={{ width: '20px', height: '20px' }} />
              ) : (
                <SunIcon style={{ width: '20px', height: '20px' }} />
              )}
            </Button>
            <Button rank="secondary" onClick={handleLogout}>
              <Flex align-items="center" gap="xs">
                <ArrowRightOnRectangleIcon style={{ width: '20px', height: '20px' }} />
                <span>Logout</span>
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/* Main content */}
      <Flex flex-direction="column" flex="1" className="main-content">
        {/* Mobile top bar */}
        <Flex
          justify-content="space-between"
          align-items="center"
          padding="m"
          className="mobile-topbar"
          style={{
            display: 'none',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
          } as any}
        >
          <Button rank="tertiary" onClick={() => setSidebarOpen(true)}>
            <Bars3Icon style={{ width: '24px', height: '24px' }} />
          </Button>
          <Text font-size="heading-s">Admin Panel</Text>
          <Button rank="tertiary" onClick={toggleTheme}>
            {theme === 'light' ? (
              <MoonIcon style={{ width: '20px', height: '20px' }} />
            ) : (
              <SunIcon style={{ width: '20px', height: '20px' }} />
            )}
          </Button>
        </Flex>

        {/* Page content */}
        <Flex flex="1" padding="l">
          <Outlet />
        </Flex>
      </Flex>

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
    </Flex>
  )
}
