"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import { useUsers } from '@/hooks/useUsers'
import Link from 'next/link'
import { useState } from 'react'

interface Freelancer {
  id: number
  username: string
  fullName: string
  bio?: string
  profileImageUrl?: string
  location?: string
  hourlyRate?: number
  skills?: string[]
  ratingAvg?: number
  ratingCount?: number
  completionRate?: number
  portfolioItems?: {
    id: number
    title: string
    imageUrl?: string
  }[]
}

export default function TalentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')

  const { data: freelancersData = [], isLoading, isError, error, refetch } = useUsers({ role: 'FREELANCER' })

  // Normalize the data
  const freelancers: Freelancer[] = (freelancersData as any[]).map((u: any) => ({
    id: u.id,
    username: u.username,
    fullName: u.full_name || u.fullName || u.fullName,
    bio: u.bio,
    profileImageUrl: u.profile_image_url || u.profileImageUrl,
    location: u.location,
    hourlyRate: u.hourly_rate || u.hourlyRate,
    skills: u.skills || [],
    ratingAvg: u.rating_avg || u.ratingAvg,
    ratingCount: u.rating_count || u.ratingCount,
    completionRate: u.completion_rate || u.completionRate,
    portfolioItems: u.portfolio_items ? u.portfolio_items.map((p: any) => ({ id: p.id, title: p.title, imageUrl: p.image_url || p.imageUrl })) : [],
  }))

  const filteredFreelancers = freelancers.filter((freelancer: any) => {
    if (searchQuery && !freelancer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !freelancer.bio?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    if (skillFilter && !freelancer.skills?.some((skill: any) => 
      skill.toLowerCase().includes(skillFilter.toLowerCase())
    )) {
      return false
    }

    if (minRate && freelancer.hourlyRate && freelancer.hourlyRate < parseInt(minRate)) {
      return false
    }

    if (maxRate && freelancer.hourlyRate && freelancer.hourlyRate > parseInt(maxRate)) {
      return false
    }

    return true
  })

  const clearFilters = () => {
    setSearchQuery('')
    setSkillFilter('')
    setMinRate('')
    setMaxRate('')
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Page Header */}
      <section className="bg-gray-900 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Find Top Creative Talent
            </h1>
            <p className="text-xl text-gray-300">
              Browse {freelancers.length} experienced designers, developers, and creative professionals
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            
            {/* Skill Filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by skill (e.g., React)"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            
            {/* Rate Range */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min $/hr"
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max $/hr"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            
            {/* Clear Filters */}
            {(searchQuery || skillFilter || minRate || maxRate) && (
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-gray-50 py-8 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredFreelancers.length}</span> talent
              {filteredFreelancers.length !== 1 && 's'}
            </p>
          </div>

          {/* Error handling */}
          {isError && (
            <ErrorMessage 
              message={error?.message || 'Failed to load freelancers'} 
              retry={() => refetch()}
            />
          )}

          {/* Results */}
          {!isError && filteredFreelancers.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No freelancers found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFreelancers.map(freelancer => (
                <Link key={freelancer.id} href={`/freelancers/${freelancer.id}`} className="block group">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all h-full flex flex-col">
                    {/* Header with Avatar */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {freelancer.fullName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                          {freelancer.fullName}
                        </h3>
                        <p className="text-sm text-gray-500">@{freelancer.username}</p>
                        {freelancer.location && (
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {freelancer.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rate & Rating */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      {freelancer.hourlyRate ? (
                        <div>
                          <span className="text-xl font-bold text-gray-900">${freelancer.hourlyRate}</span>
                          <span className="text-gray-500">/hr</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Rate not set</span>
                      )}
                      {typeof freelancer.ratingAvg !== 'undefined' && (
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium text-gray-900">{freelancer.ratingAvg.toFixed(1)}</span>
                          <span className="text-gray-400 ml-1">({freelancer.ratingCount})</span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {freelancer.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {freelancer.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {freelancer.skills && freelancer.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {freelancer.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {freelancer.skills.length > 4 && (
                          <span className="px-2 py-0.5 text-gray-400 text-xs">
                            +{freelancer.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      {typeof freelancer.completionRate !== 'undefined' && (
                        <span className="text-sm text-gray-500">
                          <span className="font-medium text-green-600">{freelancer.completionRate}%</span> Job Success
                        </span>
                      )}
                      <span className="text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center ml-auto">
                        View Profile
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
