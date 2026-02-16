import {
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  MoonIcon,
  NewspaperIcon,
  SunIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useContext, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import AdminFooter from './AdminFooter'
import AdminHeader from './AdminHeader'
import {
  Button,
  Text
} from './green'
import { ThemeContext } from './ThemeProvider'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Resources', href: '/resources', icon: NewspaperIcon },
  { name: 'Disputes', href: '/disputes', icon: ExclamationTriangleIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
]

export default function Layout() {
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { theme, toggleTheme } = useContext(ThemeContext)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader />

      <div className="flex flex-1">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="mobile-overlay md:hidden fixed inset-0 bg-black/40 z-40"
          />
        )}

        {/* Sidebar */}
        <aside className={`sidebar bg-white border-r border-gray-200 transition-all ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-64 h-screen md:h-auto z-50 md:z-0`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
              <Text className="font-bold text-lg">Menu</Text>
              <Button rank="tertiary" onClick={() => setSidebarOpen(false)}>
                <XMarkIcon width={24} height={24} />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive(item.href)
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon width={20} height={20} />
                    <Text className="font-medium">{item.name}</Text>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="border-t border-gray-200 p-4 space-y-3">
              <Button
                rank="tertiary"
                onClick={toggleTheme}
                className="w-full flex items-center gap-2 justify-center"
              >
                {theme === 'light' ? (
                  <>
                    <MoonIcon width={18} height={18} />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <SunIcon width={18} height={18} />
                    <span>Light Mode</span>
                  </>
                )}
              </Button>
              <Button
                rank="secondary"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 justify-center bg-red-50 text-red-600 hover:bg-red-100"
              >
                <ArrowRightOnRectangleIcon width={18} height={18} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <AdminFooter />
    </div>
  )
}
