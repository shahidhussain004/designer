"use client"

import { PageLayout } from '@/components/ui'
import { authService } from '@/lib/auth'
import { Bell, CheckCircle, Key, LogOut, User, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [emailNotifications, setEmailNotifications] = useState({
    jobAlerts: true,
    proposalUpdates: true,
    messages: true,
    newsletter: false,
  })

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login')
      return
    }
    setLoading(false)
  }, [router])

  const handlePasswordChange = async () => {
    setNotification(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 8) {
      setNotification({ type: 'error', message: 'Password must be at least 8 characters' })
      return
    }

    try {
      // TODO: API call to change password
      await new Promise(resolve => setTimeout(resolve, 500))
      setNotification({ type: 'success', message: 'Password changed successfully!' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to change password' })
    }
  }

  const handleNotificationSave = async () => {
    setNotification(null)
    try {
      // TODO: API call to save notification preferences
      await new Promise(resolve => setTimeout(resolve, 500))
      setNotification({ type: 'success', message: 'Notification preferences saved!' })
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to save preferences' })
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-300 mt-1">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Notification */}
          {notification && (
            <div className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
              notification.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              {notification.message}
            </div>
          )}

          {/* Password Change Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <Key className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handlePasswordChange}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Email Notifications Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <Bell className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'jobAlerts', title: 'Job Alerts', desc: 'Receive notifications for new jobs matching your skills' },
                { key: 'proposalUpdates', title: 'Proposal Updates', desc: 'Get notified when your proposals are reviewed' },
                { key: 'messages', title: 'Messages', desc: 'Receive email notifications for new messages' },
                { key: 'newsletter', title: 'Newsletter', desc: 'Stay updated with tips, news, and platform updates' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications[item.key as keyof typeof emailNotifications]}
                      onChange={(e) => setEmailNotifications({ ...emailNotifications, [item.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleNotificationSave}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <User className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Account Actions</h2>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => router.push('/profile')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Profile
              </button>
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) {
                    authService.logout()
                    router.push('/')
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
