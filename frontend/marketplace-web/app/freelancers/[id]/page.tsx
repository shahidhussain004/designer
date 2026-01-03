"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import { useUserProfile } from '@/hooks/useUsers'
import { ArrowLeft, Bookmark, Calendar, CheckCircle, ExternalLink, Mail, MapPin, MessageSquare, Phone, Star } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Review {
  id: number
  rating: number
  comment: string
  authorName: string
  createdAt: string
}

interface FreelancerProfile {
  id: number
  username: string
  fullName: string
  email: string
  bio?: string
  profileImageUrl?: string
  location?: string
  hourlyRate?: number
  skills?: string[]
  portfolioUrl?: string
  phone?: string
  ratingAvg?: number
  ratingCount?: number
  completionRate?: number
  createdAt?: string
  reviews?: Review[]
}

export default function FreelancerProfilePage() {
  const params = useParams()
  const freelancerId = params.id as string

  const { data, isLoading, isError, error, refetch } = useUserProfile(freelancerId)
  const profile = data as FreelancerProfile | undefined

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  if (isError || !profile) {
    return (
      <PageLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <ErrorMessage 
            message={error?.message || 'Failed to load profile'} 
            retry={() => refetch()}
          />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl bg-white/20 flex items-center justify-center text-4xl lg:text-5xl font-bold flex-shrink-0 border-2 border-white/30">
              {profile.fullName?.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold">{profile.fullName}</h1>
              <p className="text-gray-300 text-lg">@{profile.username}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                {profile.location && (
                  <span className="flex items-center gap-1 text-gray-300">
                    <MapPin className="w-4 h-4" /> {profile.location}
                  </span>
                )}
                {typeof profile.ratingAvg !== 'undefined' && (
                  <span className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{profile.ratingAvg.toFixed(1)}</span>
                    <span className="text-gray-400">({profile.ratingCount} reviews)</span>
                  </span>
                )}
              </div>

              <div className="flex gap-6 mt-4">
                {profile.hourlyRate && (
                  <div>
                    <p className="text-xs text-gray-400">Hourly Rate</p>
                    <p className="text-xl font-bold">${profile.hourlyRate}/hr</p>
                  </div>
                )}
                {typeof profile.completionRate !== 'undefined' && (
                  <div>
                    <p className="text-xs text-gray-400">Job Success</p>
                    <p className="text-xl font-bold">{profile.completionRate}%</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Contact Freelancer
              </button>
              <Link 
                href={`/portfolio/${profile.id}`}
                className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors text-center"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Section */}
              {profile.bio && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              )}

              {/* Skills Section */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {profile.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{profile.phone}</span>
                    </div>
                  )}
                  {profile.portfolioUrl && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                      <a 
                        href={profile.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {profile.portfolioUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              {profile.reviews && profile.reviews.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Reviews ({profile.reviews.length})
                  </h2>
                  <div className="divide-y divide-gray-200">
                    {profile.reviews.map(review => (
                      <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{review.authorName}</p>
                            <div className="flex items-center gap-1 text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-none stroke-current'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Member Since
                    </span>
                    <span className="font-semibold text-gray-900">
                      {profile.createdAt ? new Date(profile.createdAt).getFullYear() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Job Success
                    </span>
                    <span className="font-semibold text-gray-900">{profile.completionRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Star className="w-4 h-4" /> Rating
                    </span>
                    <span className="font-semibold text-gray-900">
                      {profile.ratingAvg ? profile.ratingAvg.toFixed(1) : 'No ratings'}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
                <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Send Message
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Bookmark className="w-4 h-4" /> Save Profile
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8">
            <Link 
              href="/talents"
              className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Talent List
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
