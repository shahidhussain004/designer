"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import { useUpdateUser, useUserPortfolio, useUserProfile } from '@/hooks/useUsers'
import { authService } from '@/lib/auth'
import { Briefcase, CheckCircle, Edit2, ExternalLink, Eye, Github, Globe, MapPin, Plus, Star, XCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
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

      const payload: Record<string, unknown> = {
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
    } catch {
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

        {/* Portfolio Preview — Freelancers only */}
        {profile.role === 'FREELANCER' && userId && (
          <PortfolioPreview userId={userId} />
        )}
      </div>
    </PageLayout>
  )
}

// ─── Portfolio Preview Component ─────────────────────────────────────────────

interface PortfolioPreviewProps { userId: number }

function PortfolioPreview({ userId }: PortfolioPreviewProps) {
  const { data: portfolioData = [], isLoading } = useUserPortfolio(userId)

  const featured = portfolioData.find((p) => p.highlightOrder === 1) ?? (portfolioData[0] || null)
  const rest = portfolioData.filter((p) => p.id !== featured?.id).slice(0, 3)

  if (isLoading) {
    return (
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="animate-pulse h-6 bg-secondary-200 rounded w-40 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="animate-pulse h-40 bg-secondary-100 rounded-lg" />
          <div className="animate-pulse h-40 bg-secondary-100 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900">My Portfolio</h3>
          {portfolioData.length > 0 && (
            <span className="px-2 py-0.5 bg-secondary-100 text-secondary-600 rounded-full text-xs">
              {portfolioData.length} project{portfolioData.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/portfolio/${userId}`}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors text-sm font-medium">
            <Eye className="w-4 h-4" />Manage
          </Link>
          <Link href={`/portfolio/${userId}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            onClick={(e) => { e.preventDefault(); window.location.href = `/portfolio/${userId}?add=1` }}>
            <Plus className="w-4 h-4" />Add Project
          </Link>
        </div>
      </div>

      {portfolioData.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-primary-500" />
          </div>
          <p className="text-secondary-600 mb-1">No projects yet</p>
          <p className="text-secondary-400 text-sm mb-4">Add work to your portfolio to attract clients</p>
          <Link href={`/portfolio/${userId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />Add First Project
          </Link>
        </div>
      ) : (
        <>
          {/* Featured project */}
          {featured && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Featured
              </p>
              <Link href={`/portfolio/${userId}/project/${featured.id}`}
                className="group flex gap-4 p-3 border border-secondary-200 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-all">
                <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                  {featured.imageUrl && (
                    <Image src={featured.imageUrl} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform" onError={() => {}} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-secondary-900 truncate">{featured.title}</p>
                  {featured.projectCategory && <p className="text-xs text-primary-600 font-medium mt-0.5">{featured.projectCategory}</p>}
                  <p className="text-sm text-secondary-500 line-clamp-1 mt-1">{featured.description}</p>
                  {Array.isArray(featured.technologies) && featured.technologies.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {featured.technologies.slice(0, 3).map((t: string, i: number) => (
                        <span key={i} className="px-1.5 py-0.5 bg-secondary-100 text-secondary-600 rounded text-xs">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5 self-start flex-shrink-0">
                  {featured.liveUrl && <Globe className="w-4 h-4 text-secondary-400" />}
                  {featured.githubUrl && <Github className="w-4 h-4 text-secondary-400" />}
                </div>
              </Link>
            </div>
          )}

          {/* Rest of projects */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rest.map((item) => (
                <Link key={item.id} href={`/portfolio/${userId}/project/${item.id}`}
                  className="group block border border-secondary-200 rounded-xl overflow-hidden hover:border-primary-200 hover:shadow-md transition-all">
                  <div className="relative h-28 bg-secondary-100">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" onError={() => {}} />
                    )}
                    {!item.isVisible && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-warning-500 text-warning-900 rounded text-xs font-semibold">Hidden</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-secondary-900 truncate">{item.title}</p>
                    {item.projectCategory && <p className="text-xs text-secondary-500 mt-0.5">{item.projectCategory}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Link to see all */}
          {portfolioData.length > 4 && (
            <div className="mt-4 text-center">
              <Link href={`/portfolio/${userId}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all {portfolioData.length} projects →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
