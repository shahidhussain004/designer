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
  const siteTitle = 'Admin Panel'
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
    <Flex>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="mobile-overlay md:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <Flex
          flex-direction="column">
          <Flex justify-content="space-between" align-items="center" padding="m">
            <Text font-size="heading-s" font-weight="book">
                {siteTitle}
              </Text>
            <Button rank="tertiary" onClick={() => setSidebarOpen(false)}>
              <XMarkIcon width={24} height={24} />
            </Button>
          </Flex>
          <Flex flex-direction="column" gap="xs" padding="s" flex="1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}>
                <Flex
                  align-items="center"
                  gap="s"
                  padding="s">
                  <item.icon width={20} height={20} />
                  <Text font-size="body-s">{item.name}</Text>
                </Flex>
              </Link>
            ))}
          </Flex>
        </Flex>
      </div>

      {/* Desktop sidebar */}
      <Flex
        flex-direction="column" className="desktop-sidebar hidden md:flex"
      >
        <Flex padding="m" align-items="center">
          <Text font-size="heading-s" font-weight="book">
            {siteTitle}
          </Text>
        </Flex>

        <Flex flex-direction="column" gap="xs" padding="s" flex="1">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href}>
              <Flex
                align-items="center"
                gap="s"
                padding="s">
                <item.icon width={20} height={20} />
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
              align-items="center" >
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
                <MoonIcon width={20} height={20} />
              ) : (
                <SunIcon width={20} height={20} />
              )}
            </Button>
            <Button rank="secondary" onClick={handleLogout}>
              <Flex align-items="center" gap="xs">
                <ArrowRightOnRectangleIcon />
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
          className="mobile-topbar md:hidden" >
          <Button rank="tertiary" onClick={() => setSidebarOpen(true)}>
            <Bars3Icon width={24} height={24} />
          </Button>
          <Text font-size="heading-s">{siteTitle}</Text>
          <Button rank="tertiary" onClick={toggleTheme}>
            {theme === 'light' ? (
              <MoonIcon width={20} height={20} />
            ) : (
              <SunIcon width={20} height={20} />
            )}
          </Button>
        </Flex>

        {/* Page content */}
        <Flex flex="1" padding="l">
          <Outlet />
        </Flex>
      </Flex>
    </Flex>
  )
}
