"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { Alert, Badge, Button, Card, Divider, Flex, Input, Text, Textarea } from '@/components/green'
import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import { useUpdateUser, useUserProfile } from '@/hooks/useUsers'
import { authService } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UserProfile {
  id: number
  email: string
  username: string
  fullName: string
  role: string
  bio?: string
  profileImageUrl?: string
  location?: string
  hourlyRate?: number
  skills?: string[]
  portfolioUrl?: string
  ratingAvg?: number
  ratingCount?: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    hourlyRate: '',
    portfolioUrl: '',
  })

  const currentUser = authService.getCurrentUser()
  const userId = currentUser?.id

  const { data, isLoading, isError, error, refetch } = useUserProfile(userId)
  const profile = data as UserProfile | undefined
  const updateUserMutation = useUpdateUser()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login')
      return
    }
  }, [router])

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        hourlyRate: profile.hourlyRate?.toString() || '',
        portfolioUrl: profile.portfolioUrl || '',
      })
    }
  }, [profile])

  const handleSave = async () => {
    setNotification(null)

    try {
      if (!userId) {
        throw new Error('Not authenticated')
      }

      const payload: any = {
        fullName: formData.fullName || undefined,
        bio: formData.bio || undefined,
        location: formData.location || undefined,
        portfolioUrl: formData.portfolioUrl || undefined,
      }
      if (formData.hourlyRate) {
        const parsed = Number(formData.hourlyRate)
        if (!isNaN(parsed)) payload.hourlyRate = parsed
      }

      await updateUserMutation.mutateAsync({
        userId,
        userData: payload
      })

      // Update localStorage user object so authService.getCurrentUser() reflects changes
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const merged = { ...parsed, ...payload }
          localStorage.setItem('user', JSON.stringify(merged))
        } catch {
          localStorage.setItem('user', JSON.stringify(payload))
        }
      } else {
        localStorage.setItem('user', JSON.stringify(payload))
      }

      setNotification({ type: 'success', message: 'Profile updated successfully!' })
      setEditing(false)
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update profile. Please try again.' })
    }
  }

  if (isLoading) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" min-height="50vh">
          <LoadingSpinner />
        </Flex>
      </PageLayout>
    )
  }

  if (isError) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" min-height="50vh">
          <ErrorMessage 
            message={error?.message || 'Failed to load profile'} 
            retry={() => refetch()}
          />
        </Flex>
      </PageLayout>
    )
  }

  if (!profile) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" min-height="50vh">
          <Text color="negative-01">Profile not found</Text>
        </Flex>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l" max-width="800px" margin="0 auto">
        {/* Header */}
        <Flex justify-content="space-between" align-items="center">
          <div>
            <Text font-size="heading-l">My Profile</Text>
            <Text font-size="body-s" color="neutral-02">
              Manage your account information
            </Text>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Flex>

        {/* Notification */}
        {notification && (
          <Alert variant={notification.type === 'success' ? 'positive' : 'negative'}>
            {notification.message}
          </Alert>
        )}

        {/* Profile Card */}
        <Card padding="l">
          <Flex flex-direction="column" gap="m">
            {/* Avatar and Basic Info */}
            <Flex gap="m" align-items="center">
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#666'
              }}>
                {profile.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <Flex flex-direction="column" gap="xs">
                <Text font-size="heading-s">{profile.fullName}</Text>
                <Text font-size="body-s" color="neutral-02">@{profile.username}</Text>
                <Badge variant="information">{profile.role}</Badge>
              </Flex>
            </Flex>

            <Divider />

            {/* Form Fields */}
            {editing ? (
              <Flex flex-direction="column" gap="m">
                <div>
                  <Text font-size="body-s" style={{ marginBottom: '0.5rem' }}>Full Name</Text>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Text font-size="body-s" style={{ marginBottom: '0.5rem' }}>Email</Text>
                  <Input
                    value={profile.email}
                    disabled
                    style={{ opacity: 0.6 }}
                  />
                  <Text font-size="detail-regular-s" color="neutral-02">Email cannot be changed</Text>
                </div>

                <div>
                  <Text font-size="body-s" style={{ marginBottom: '0.5rem' }}>Bio</Text>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>

                <div>
                  <Text font-size="body-s" style={{ marginBottom: '0.5rem' }}>Location</Text>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>

                {profile.role === 'FREELANCER' && (
                  <>
                    <div>
                      <Text font-size="body-s" style={{ marginBottom: '0.5rem' }}>Hourly Rate (USD)</Text>
                      <Input
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <Text font-size="body-s" style={{ marginBottom: '0.5rem' }}>Portfolio URL</Text>
                      <Input
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <Flex gap="m" justify-content="flex-end">
                  <Button
                      rank="tertiary"
                      onClick={() => {
                      setEditing(false)
                      setNotification(null)
                    }}
                    disabled={updateUserMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={updateUserMutation.isPending}
                  >
                    {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <Flex flex-direction="column" gap="m">
                <div>
                  <Text font-size="body-s" color="neutral-02">Email</Text>
                  <Text>{profile.email}</Text>
                </div>

                {profile.bio && (
                  <div>
                    <Text font-size="body-s" color="neutral-02">Bio</Text>
                    <Text>{profile.bio}</Text>
                  </div>
                )}

                {profile.location && (
                  <div>
                    <Text font-size="body-s" color="neutral-02">Location</Text>
                    <Text>{profile.location}</Text>
                  </div>
                )}

                {profile.role === 'FREELANCER' && profile.hourlyRate && (
                  <div>
                    <Text font-size="body-s" color="neutral-02">Hourly Rate</Text>
                    <Text>${profile.hourlyRate}/hour</Text>
                  </div>
                )}

                {profile.role === 'FREELANCER' && profile.portfolioUrl && (
                  <div>
                    <Text font-size="body-s" color="neutral-02">Portfolio</Text>
                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1a73e8' }}>
                      {profile.portfolioUrl}
                    </a>
                  </div>
                )}

                {profile.role === 'FREELANCER' && typeof profile.ratingAvg !== 'undefined' && (
                  <div>
                    <Text font-size="body-s" color="neutral-02">Rating</Text>
                    <Text>⭐ {profile.ratingAvg.toFixed(1)} ({profile.ratingCount} reviews)</Text>
                  </div>
                )}
              </Flex>
            )}
          </Flex>
        </Card>
      </Flex>
    </PageLayout>
  )
}
