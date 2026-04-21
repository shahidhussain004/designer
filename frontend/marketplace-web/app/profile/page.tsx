"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import { useUpdateUser, useUserProfile } from '@/hooks/useUsers'
import { authService } from '@/lib/auth'
import { CheckCircle, Edit2, ExternalLink, MapPin, Star, XCircle } from 'lucide-react'
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
  const [isMounted, setIsMounted] = useState(false)
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

  // Ensure hydration happens correctly - only render after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  if (!isMounted || isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  if (isError) {
    return (
      <PageLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <ErrorMessage 
            message={error?.message || 'Failed to load profile'} 
            retry={() => refetch()}
          />
        </div>
      </PageLayout>
    )
  }

  if (!profile) {
    return (
      <PageLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-error-600">Profile not found</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-secondary-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-secondary-300 mt-1">Manage your account information</p>
            </div>
            {!editing && (
              <button 
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-white text-secondary-900 px-4 py-2 rounded-lg font-medium hover:bg-secondary-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-secondary-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Notification */}
          {notification && (
            <div className={`mb-6 px-4 py-3 rounded-lg flex items-center gap-2 ${
              notification.type === 'success' 
                ? 'bg-success-50 text-success-700 border border-success-200' 
                : 'bg-error-50 text-error-700 border border-error-200'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              {notification.message}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-secondary-200">
              <div className="w-20 h-20 rounded-full bg-secondary-200 flex items-center justify-center text-3xl font-bold text-secondary-500">
                {profile.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">{profile.fullName}</h2>
                <p className="text-secondary-500">@{profile.username}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  profile.role === 'FREELANCER' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-primary-100 text-primary-700'
                }`}>
                  {profile.role}
                </span>
              </div>
            </div>

            {/* Form Fields */}
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                  <input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                  <input
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-500"
                  />
                  <p className="text-xs text-secondary-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself"
                    rows={4}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none"
                  />
                </div>

                {profile.role === 'FREELANCER' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Hourly Rate (USD)</label>
                      <input
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        placeholder="50"
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Portfolio URL</label>
                      <input
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://yourportfolio.com"
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setEditing(false)
                      setNotification(null)
                    }}
                    disabled={updateUserMutation.isPending}
                    className="px-4 py-2 border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateUserMutation.isPending}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-secondary-500">Email</p>
                  <p className="text-secondary-900">{profile.email}</p>
                </div>

                {profile.bio && (
                  <div>
                    <p className="text-sm text-secondary-500">Bio</p>
                    <p className="text-secondary-900">{profile.bio}</p>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary-400" />
                    <span className="text-secondary-900">{profile.location}</span>
                  </div>
                )}

                {profile.role === 'FREELANCER' && profile.hourlyRate && (
                  <div>
                    <p className="text-sm text-secondary-500">Hourly Rate</p>
                    <p className="text-secondary-900 font-semibold">${profile.hourlyRate}/hour</p>
                  </div>
                )}

                {profile.role === 'FREELANCER' && profile.portfolioUrl && (
                  <div>
                    <p className="text-sm text-secondary-500">Portfolio</p>
                    <a 
                      href={profile.portfolioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      {profile.portfolioUrl}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {profile.role === 'FREELANCER' && typeof profile.ratingAvg !== 'undefined' && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning-400 fill-current" />
                    <span className="font-semibold text-secondary-900">{profile.ratingAvg.toFixed(1)}</span>
                    <span className="text-secondary-500">({profile.ratingCount} reviews)</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
