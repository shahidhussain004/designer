import { BellIcon, CogIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button, Flex, Text } from './green'

export default function AdminHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-header bg-gradient-to-r from-blue-800 to-blue-900 shadow-lg">
      <Flex
        justify-content="space-between"
        align-items="center"
        padding="m"
        className="max-w-7xl mx-auto"
      >
        {/* Left: Logo/Title */}
        <Flex align-items="center" gap="m">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Text className="text-primary-600 font-bold text-lg">A</Text>
          </div>
          <div>
            <Text className="text-white font-bold text-lg">Admin Dashboard</Text>
            <Text className="text-blue-200 text-sm">Marketplace Management</Text>
          </div>
        </Flex>

        {/* Right: User Menu */}
        <Flex align-items="center" gap="m">
          <a href="http://localhost:3002/" target="_blank" rel="noreferrer" className="text-white hover:text-blue-200 px-3 py-2 rounded">
            Marketplace
          </a>
          <Button rank="tertiary" size="small" className="text-white hover:text-blue-200" onClick={() => navigate('/notifications')}>
            <BellIcon width={20} height={20} />
          </Button>
          <Button rank="tertiary" size="small" className="text-white hover:text-blue-200" onClick={() => navigate('/settings')}>
            <CogIcon width={20} height={20} />
          </Button>
          <div className="h-8 w-0.5 bg-blue-600"></div>
          <Flex align-items="center" gap="s" className="cursor-pointer group" onClick={() => navigate('/profile')}>
            <UserCircleIcon width={32} height={32} className="text-white" />
            <div>
              <Text className="text-white text-sm font-medium">{user?.username || 'Admin'}</Text>
              <Text className="text-blue-200 text-xs">{user?.role || 'Administrator'}</Text>
            </div>
          </Flex>
          <Button
            rank="secondary"
            size="small"
            onClick={handleLogout}
            className="bg-white text-blue-800 hover:bg-blue-50"
          >
            Logout
          </Button>
        </Flex>
      </Flex>
    </div>
  )
}
