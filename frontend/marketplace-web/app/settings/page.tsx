"use client"

import { Alert, Button, Card, Divider, Flex, Input, Spinner, Text } from '@/components/green'
import { PageLayout } from '@/components/layout'
import { authService } from '@/lib/auth'
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
        <Flex justify-content="center" align-items="center" min-height="50vh">
          <Spinner />
        </Flex>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l" max-width="800px" margin="0 auto">
        {/* Header */}
        <div>
          <Text font-size="heading-l">Settings</Text>
          <Text font-size="body-s" color="neutral-02">
            Manage your account settings and preferences
          </Text>
        </div>

        {/* Notification */}
        {notification && (
          <Alert variant={notification.type === 'success' ? 'positive' : 'negative'}>
            {notification.message}
          </Alert>
        )}

        {/* Password Change Card */}
        <Card padding="l">
          <Flex flex-direction="column" gap="m">
            <Text font-size="heading-s">Change Password</Text>
            <Divider />

            <div>
              <Text font-size="body-s" style={{ marginBottom: '0.5rem' }}>Current Password</Text>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <Text font-size="body-s" style={{ marginBottom: '0.5rem' }}>New Password</Text>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <Text font-size="body-s" style={{ marginBottom: '0.5rem' }}>Confirm New Password</Text>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>

            <Flex justify-content="flex-end">
              <Button onClick={handlePasswordChange}>
                Update Password
              </Button>
            </Flex>
          </Flex>
        </Card>

        {/* Email Notifications Card */}
        <Card padding="l">
          <Flex flex-direction="column" gap="m">
            <Text font-size="heading-s">Email Notifications</Text>
            <Divider />

            <Flex justify-content="space-between" align-items="center">
              <div>
                <Text font-size="body-regular-m">Job Alerts</Text>
                <Text font-size="body-s" color="neutral-02">Receive notifications for new jobs matching your skills</Text>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications.jobAlerts}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, jobAlerts: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </Flex>

            <Flex justify-content="space-between" align-items="center">
              <div>
                <Text font-size="body-regular-m">Proposal Updates</Text>
                <Text font-size="body-s" color="neutral-02">Get notified when your proposals are reviewed</Text>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications.proposalUpdates}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, proposalUpdates: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </Flex>

            <Flex justify-content="space-between" align-items="center">
              <div>
                <Text font-size="body-regular-m">Messages</Text>
                <Text font-size="body-s" color="neutral-02">Receive email notifications for new messages</Text>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications.messages}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, messages: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </Flex>

            <Flex justify-content="space-between" align-items="center">
              <div>
                <Text font-size="body-regular-m">Newsletter</Text>
                <Text font-size="body-s" color="neutral-02">Stay updated with tips, news, and platform updates</Text>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications.newsletter}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, newsletter: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </Flex>

            <Flex justify-content="flex-end">
              <Button onClick={handleNotificationSave}>
                Save Preferences
              </Button>
            </Flex>
          </Flex>
        </Card>

        {/* Account Actions */}
        <Card padding="l">
          <Flex flex-direction="column" gap="m">
            <Text font-size="heading-s">Account Actions</Text>
            <Divider />

            <Flex gap="m">
              <Button variant="neutral" onClick={() => router.push('/profile')}>
                View Profile
              </Button>
              <Button variant="negative" onClick={() => {
                if (confirm('Are you sure you want to log out?')) {
                  authService.logout()
                  router.push('/')
                }
              }}>
                Log Out
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </PageLayout>
  )
}
