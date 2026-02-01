"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { useUsersPaginated } from '@/hooks/useUsers'
import { Grid, List } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

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

interface PaginationData {
  content: any[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

const DEFAULT_ITEMS_PER_PAGE = 10

export default function TalentsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPageLocal] = useState<number>(DEFAULT_ITEMS_PER_PAGE)
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('grid')
  
  // Initialize itemsPerPage from URL params on mount
  useEffect(() => {
    const limitParam = searchParams.get('limit')
    if (limitParam) {
      const limit = parseInt(limitParam, 10)
      if ([10, 20, 30, 50, 100].includes(limit)) {
        setItemsPerPageLocal(limit)
      }
    }
  }, [searchParams])
  
  // Wrapper to update URL when itemsPerPage changes
  const setItemsPerPage = (value: number) => {
    setItemsPerPageLocal(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('limit', value.toString())
    router.push(`?${params.toString()}`, { scroll: false } as any)
  }

  const { data: freelancersData = { content: [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize: DEFAULT_ITEMS_PER_PAGE } as PaginationData, isLoading, isError, error, refetch } = useUsersPaginated({ 
    role: 'FREELANCER',
    page: currentPage,
    limit: itemsPerPage
  })

  // Normalize the data
  const freelancers: Freelancer[] = (freelancersData?.content || freelancersData as any[]).map((u: any) => ({
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

  const clearFilters = () => {
    setSearchQuery('')
    setSkillFilter('')
    setMinRate('')
    setMaxRate('')
    setCurrentPage(0)
  }

  // Client-side filtering on current page results
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

  // Calculate pagination info
  const totalElements = freelancersData?.totalElements || 0
  const totalPages = freelancersData?.totalPages || 0
  const startIndex = totalElements === 0 ? 0 : currentPage * itemsPerPage + 1
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, totalElements)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <section className="bg-gray-900 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Find Top Creative Talent
            </h1>
            <p className="text-xl text-gray-300">
              Browse <span className="font-semibold text-white">{totalElements}</span> experienced designers, developers, and creative professionals
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
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

            {/* Layout Toggle */}
            <div className="flex gap-2 border border-gray-300 rounded-lg p-1 w-fit h-fit">
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-2 rounded transition-colors ${
                  layoutMode === 'list'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-2 rounded transition-colors ${
                  layoutMode === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>
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
              {filteredFreelancers.length > 0 && totalElements > 0 && (
                <span> (Page {currentPage + 1} of {totalPages})</span>
              )}
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
            <>
              {/* List View */}
              {layoutMode === 'list' && (
                <div className="space-y-4">
                  {filteredFreelancers.map(freelancer => (
                    <Link key={freelancer.id} href={`/freelancers/${freelancer.id}`} className="block group">
                      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all">
                        <div className="flex items-start gap-6">
                          {/* Avatar */}
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {freelancer.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                  {freelancer.fullName}
                                </h3>
                                <p className="text-sm text-gray-500">@{freelancer.username}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                {freelancer.hourlyRate ? (
                                  <div>
                                    <span className="text-lg font-bold text-gray-900">${freelancer.hourlyRate}</span>
                                    <span className="text-gray-500">/hr</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">Rate not set</span>
                                )}
                              </div>
                            </div>

                            {/* Location and Rating */}
                            <div className="flex items-center gap-4 mb-3">
                              {freelancer.location && (
                                <p className="text-sm text-gray-500 flex items-center">
                                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  </svg>
                                  {freelancer.location}
                                </p>
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
                              <p className="text-gray-600 text-sm mb-3">
                                {freelancer.bio}
                              </p>
                            )}

                            {/* Skills and Stats */}
                            <div className="flex items-center justify-between">
                              {freelancer.skills && freelancer.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {freelancer.skills.slice(0, 5).map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {freelancer.skills.length > 5 && (
                                    <span className="px-2 py-0.5 text-gray-400 text-xs">
                                      +{freelancer.skills.length - 5} more
                                    </span>
                                  )}
                                </div>
                              )}
                              {typeof freelancer.completionRate !== 'undefined' && (
                                <span className="text-sm text-gray-500">
                                  <span className="font-medium text-green-600">{freelancer.completionRate}%</span> Job Success
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="flex-shrink-0 pt-1">
                            <span className="text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Grid View */}
              {layoutMode === 'grid' && (
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
            </>
          )}

          {/* Pagination Controls */}
          {!isError && filteredFreelancers.length > 0 && totalElements > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600">
                  Showing {startIndex} to {endIndex} of {totalElements} talents
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  {/* First Button */}
                  <button
                    onClick={() => setCurrentPage(0)}
                    disabled={currentPage === 0 || isLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
                    </svg>
                    First
                  </button>
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0 || isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const showPage = 
                        idx === 0 || 
                        idx === totalPages - 1 || 
                        idx === currentPage || 
                        (idx === currentPage - 1 && currentPage > 0) || 
                        (idx === currentPage + 1 && currentPage < totalPages - 1)
                      
                      const isEllipsis = 
                        (idx === 1 && currentPage > 2) || 
                        (idx === totalPages - 2 && currentPage < totalPages - 3)

                      if (isEllipsis) {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-600">
                            ...
                          </span>
                        )
                      }

                      if (!showPage) return null

                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(idx)}
                          disabled={isLoading}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            idx === currentPage
                              ? 'bg-primary-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      )
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1 || isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Last Button */}
                  <button
                    onClick={() => setCurrentPage(Math.max(0, totalPages - 1))}
                    disabled={currentPage === totalPages - 1 || isLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Last
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M6 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Items Per Page Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500">Show</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(0); }}
                    className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    {[10,20,30,50,100].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500">per page</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
