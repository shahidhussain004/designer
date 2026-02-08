"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import { useCompanyProfile } from '@/hooks/useUsers'
import { ArrowLeft, Briefcase, Calendar, Mail, MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Review {
  id: number
  rating: number
  comment: string
  authorName: string
  createdAt: string
}

interface CompanyProfile {
  id: number
  username: string
  fullName: string
  email: string
  bio?: string
  profileImageUrl?: string
  location?: string
  phone?: string
  ratingAvg?: number
  ratingCount?: number
  completionRate?: number
  createdAt?: string
  reviews?: Review[]
  website?: string
}

export default function CompanyProfilePage() {
  const params = useParams()
  const companyId = params.id as string

  const { data, isLoading, isError, error, refetch } = useCompanyProfile(companyId)
  const profile = data as CompanyProfile | undefined

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
            message={error?.message || 'Failed to load company profile'} 
            retry={() => refetch()}
          />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-primary-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Company Logo/Avatar */}
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl bg-white/20 flex items-center justify-center text-4xl lg:text-5xl font-bold flex-shrink-0 border-2 border-white/30">
              {profile.fullName?.charAt(0).toUpperCase()}
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold">{(profile as any).companyName ?? profile.fullName}</h1>
              <p className="text-blue-200 text-lg">@{(profile as any).username ?? profile.username}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                {profile.location && (
                  <span className="flex items-center gap-1 text-blue-100">
                    <MapPin className="w-4 h-4" /> {profile.location}
                  </span>
                )}
                {typeof profile.ratingAvg !== 'undefined' && (
                  <span className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{profile.ratingAvg.toFixed(1)}</span>
                    <span className="text-blue-200">({profile.ratingCount} reviews)</span>
                  </span>
                )}
              </div>

              <div className="flex gap-6 mt-4">
                {typeof profile.completionRate !== 'undefined' && (
                  <div>
                    <p className="text-xs text-blue-200">Job Success Rate</p>
                    <p className="text-xl font-bold">{profile.completionRate}%</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-blue-200">Member Since</p>
                  <p className="text-xl font-bold">
                    {profile.createdAt ? new Date(profile.createdAt).getFullYear() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <button className="bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Contact Company
              </button>
              <Link 
                href={`/jobs?company=${profile.id}`}
                className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors text-center"
              >
                View Jobs
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
              {/* About Section */}
              {profile.bio && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h2>
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {profile.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <a href={`mailto:${profile.email}`} className="text-primary-600 hover:underline">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a href={`tel:${profile.phone}`} className="text-primary-600 hover:underline">
                          {profile.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-gray-900">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              {profile.reviews && profile.reviews.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h2>
                  <div className="space-y-4">
                    {profile.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{review.authorName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Company Stats Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span>Rating</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {profile.ratingAvg?.toFixed(1) || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {profile.ratingCount || 0} reviews
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-5 h-5 text-primary-600" />
                      <span>Success Rate</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {profile.completionRate || 0}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>Member Since</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {profile.createdAt ? new Date(profile.createdAt).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Looking to Hire?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Browse all open positions from this company or contact them directly.
                </p>
                <button className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                  <Briefcase className="w-4 h-4" /> View Open Positions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
