"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { Breadcrumb, PageLayout } from '@/components/ui'
import { useUserPortfolio, useUserProfile } from '@/hooks/useUsers'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface PortfolioItem {
  id: number
  title: string
  description: string
  imageUrl: string
  projectUrl?: string
  technologies: string[]
  completionDate?: string
  isVisible: boolean
}

interface Freelancer {
  id: number
  fullName: string
  username: string
  bio?: string
  profileImageUrl?: string
  hourlyRate?: number
  ratingAvg?: number
  ratingCount?: number
}

export default function FreelancerPortfolioPage() {
  const params = useParams()
  const freelancerId = params.id as string

  const { data: freelancerData, isLoading: profileLoading, isError: profileError, error: profileErrorMsg, refetch: refetchProfile } = useUserProfile(freelancerId)
  const { data: portfolioData = [], isLoading: portfolioLoading, isError: portfolioError, error: portfolioErrorMsg, refetch: refetchPortfolio } = useUserPortfolio(parseInt(freelancerId))

  const freelancer = freelancerData as Freelancer | undefined
  const portfolio = portfolioData as PortfolioItem[]

  const loading = profileLoading || portfolioLoading
  const error = profileError || portfolioError
  const errorMessage = profileErrorMsg?.message || portfolioErrorMsg?.message

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  if (error || !freelancer) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <ErrorMessage 
            message={errorMessage || 'Failed to load portfolio'} 
            retry={() => {
              refetchProfile()
              refetchPortfolio()
            }}
          />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb
                items={[
                  { label: 'Talents', href: '/talents' },
                  { label: freelancer.fullName || `@${freelancer.username}`, href: `/freelancers/${freelancer.id}` },
                  { label: 'Portfolio', href: `/freelancers/${freelancer.id}/portfolio` },
                ]}
              />
            </div>

            {/* Page Title */}
            <div className="flex gap-4 items-start">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                {freelancer.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{freelancer.fullName}&rsquo;s Portfolio</h1>
                <p className="text-gray-400">@{freelancer.username}</p>
                {(freelancer.hourlyRate || freelancer.ratingAvg) && (
                  <div className="flex gap-4 mt-3">
                    {freelancer.hourlyRate && (
                      <span className="text-white">💰 ${freelancer.hourlyRate}/hr</span>
                    )}
                    {typeof freelancer.ratingAvg !== 'undefined' && (
                      <span className="text-gray-300">
                        ⭐ {freelancer.ratingAvg.toFixed(1)} ({freelancer.ratingCount} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Portfolio Content */}
          {portfolio.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Portfolio Items</h3>
              <p className="text-gray-500">
                This freelancer has not added any portfolio items yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {portfolio.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Image Section */}
                  <div className="relative h-64 bg-gradient-to-br from-primary-50 to-gray-100">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        onError={() => {}}
                      />
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                    {/* Technologies */}
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    {item.completionDate && (
                      <p className="text-sm text-gray-500 mb-4">
                        📅 Completed: {new Date(item.completionDate).toLocaleDateString()}
                      </p>
                    )}

                    <hr className="border-gray-200 my-4" />

                    {/* Actions */}
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live Project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          {portfolio.length > 0 && (
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Impressed by this work?</h3>
                  <p className="text-primary-100">Hire {freelancer.fullName} for your next project</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/freelancers/${freelancer.id}`}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
                  >
                    View Profile
                  </Link>
                  <button className="px-4 py-2 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-colors font-medium whitespace-nowrap">
                    Contact Freelancer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex justify-center">
            <Link
              href="/talents"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse More Talent
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
