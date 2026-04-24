"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { Breadcrumb, PageLayout } from '@/components/ui'
import { useUserProfile } from '@/hooks/useUsers'
import { apiClient } from '@/lib/api-client'
import { authService } from '@/lib/auth'
import { ArrowLeft, Calendar, Edit, ExternalLink, Github, Globe, Tag, Wrench } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PortfolioItem {
  id: number
  title: string
  description: string
  imageUrl?: string
  thumbnailUrl?: string
  images?: { url: string; caption?: string; order?: number }[]
  projectUrl?: string
  liveUrl?: string
  githubUrl?: string
  sourceUrl?: string
  projectCategory?: string
  technologies?: string[]
  toolsUsed?: string[]
  skillsDemonstrated?: string[]
  startDate?: string
  endDate?: string
  completionDate?: string
  displayOrder: number
  highlightOrder?: number
  isVisible: boolean
  createdAt: string
  updatedAt?: string
}

interface FreelancerProfile {
  id: number
  fullName: string
  username: string
  bio?: string
  hourlyRate?: number
  ratingAvg?: number
  ratingCount?: number
}

/**
 * Individual Project Detail Page
 * URL: /portfolio/[id]/project/[projectId]
 */
export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const portfolioUserId = params.id as string
  const projectId = params.projectId as string
  const currentUser = authService.getCurrentUser()
  const isOwner = currentUser?.id?.toString() === portfolioUserId

  const [item, setItem] = useState<PortfolioItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  const { data: freelancerData } = useUserProfile(portfolioUserId)
  const freelancer = freelancerData as FreelancerProfile | undefined

  useEffect(() => {
    async function fetchItem() {
      try {
        setLoading(true)
        const { data } = await apiClient.get<PortfolioItem>(`/portfolio-items/${projectId}`)
        setItem(data)
        setActiveImage(data.imageUrl || null)
      } catch (err: unknown) {
        const error = err as Record<string, unknown>;
        const response = error?.response as Record<string, unknown> | undefined;
        const data = response?.data as Record<string, unknown> | undefined;
        setError(data?.message as string | undefined || 'Failed to load project details')
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [projectId])

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : null
  const duration = (start?: string, end?: string) => {
    if (!start || !end) return null
    const months = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24 * 30))
    return months < 1 ? 'Less than a month' : `${months} month${months !== 1 ? 's' : ''}`
  }

  const completionDate = item?.completionDate || item?.endDate
  const allImages = [
    ...(item?.imageUrl ? [{ url: item.imageUrl, caption: item.title }] : []),
    ...(item?.images ?? []),
  ].filter((img, idx, arr) => arr.findIndex((x) => x.url === img.url) === idx)

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  if (error || !item) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <ErrorMessage message={error || 'Project not found'} />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-secondary-50">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="bg-secondary-900 text-white py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                { label: 'Talents', href: '/talents' },
                { label: freelancer?.fullName || `User ${portfolioUserId}`, href: `/portfolio/${portfolioUserId}` },
                { label: 'Portfolio', href: `/portfolio/${portfolioUserId}` },
                { label: item.title, href: '#' },
              ]}
            />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                {item.projectCategory && (
                  <span className="inline-block px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs font-medium mb-3">
                    {item.projectCategory}
                  </span>
                )}
                <h1 className="text-3xl font-bold">{item.title}</h1>
                {freelancer && (
                  <p className="text-secondary-400 mt-1">by <Link href={`/portfolio/${portfolioUserId}`} className="text-primary-400 hover:text-primary-300">{freelancer.fullName}</Link></p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                {item.liveUrl && (
                  <a href={item.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-medium">
                    <Globe className="w-4 h-4" />Live Site
                  </a>
                )}
                {item.githubUrl && (
                  <a href={item.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-medium">
                    <Github className="w-4 h-4" />Source Code
                  </a>
                )}
                {item.projectUrl && item.projectUrl !== item.liveUrl && (
                  <a href={item.projectUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-medium">
                    <ExternalLink className="w-4 h-4" />Case Study
                  </a>
                )}
                {isOwner && (
                  <Link href={`/portfolio/${portfolioUserId}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors text-sm font-medium">
                    <Edit className="w-4 h-4" />Edit
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">

            {/* ── Main content ──────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Image Gallery */}
              {allImages.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                  {/* Main image */}
                  <div className="relative aspect-video bg-secondary-100">
                    <Image
                      src={activeImage || allImages[0].url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      onError={() => {}}
                    />
                  </div>
                  {/* Thumbnail strip */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 p-3 overflow-x-auto">
                      {allImages.map((img, i) => (
                        <button key={i} onClick={() => setActiveImage(img.url)}
                          className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === img.url ? 'border-primary-500' : 'border-transparent hover:border-secondary-300'}`}>
                          <Image src={img.url} alt={img.caption || `Image ${i + 1}`} fill className="object-cover" onError={() => {}} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-3">About this project</h2>
                <p className="text-secondary-600 leading-relaxed whitespace-pre-line">{item.description}</p>
              </div>

              {/* Skills Demonstrated */}
              {item.skillsDemonstrated && item.skillsDemonstrated.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6">
                  <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary-500" />Skills Demonstrated
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {item.skillsDemonstrated.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar ───────────────────────────────────────────── */}
            <div className="mt-6 lg:mt-0 space-y-4">

              {/* Project details card */}
              <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-secondary-500 uppercase tracking-wider">Project Details</h3>

                {item.projectCategory && (
                  <div>
                    <p className="text-xs text-secondary-400 mb-1">Category</p>
                    <p className="text-secondary-900 font-medium">{item.projectCategory}</p>
                  </div>
                )}

                {(item.startDate || completionDate) && (
                  <div>
                    <p className="text-xs text-secondary-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" />Timeline</p>
                    <p className="text-secondary-900 text-sm">
                      {formatDate(item.startDate)}
                      {item.startDate && completionDate && ' → '}
                      {formatDate(completionDate)}
                    </p>
                    {duration(item.startDate, completionDate) && (
                      <p className="text-xs text-secondary-400 mt-0.5">{duration(item.startDate, completionDate)}</p>
                    )}
                  </div>
                )}

                {item.technologies && item.technologies.length > 0 && (
                  <div>
                    <p className="text-xs text-secondary-400 mb-2">Technologies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.technologies.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {item.toolsUsed && item.toolsUsed.length > 0 && (
                  <div>
                    <p className="text-xs text-secondary-400 mb-2 flex items-center gap-1"><Wrench className="w-3 h-3" />Tools Used</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.toolsUsed.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Designer card */}
              {freelancer && (
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-5">
                  <h3 className="text-sm font-semibold text-secondary-500 uppercase tracking-wider mb-4">About the Designer</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {freelancer.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900">{freelancer.fullName}</p>
                      <p className="text-xs text-secondary-500">@{freelancer.username}</p>
                    </div>
                  </div>
                  {freelancer.hourlyRate && (
                    <p className="text-sm text-secondary-600 mb-3">💰 ${freelancer.hourlyRate}/hr</p>
                  )}
                  <div className="space-y-2">
                    <Link href={`/portfolio/${portfolioUserId}`}
                      className="block w-full px-4 py-2.5 text-center border border-secondary-300 text-secondary-700 rounded-xl hover:bg-secondary-50 transition-colors text-sm font-medium">
                      View Full Portfolio
                    </Link>
                    {!isOwner && (
                      <Link href={`/freelancers/${freelancer.id}`}
                        className="block w-full px-4 py-2.5 text-center bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-semibold">
                        Hire {freelancer.fullName.split(' ')[0]}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-10 flex items-center gap-4">
            <button onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-700 text-sm">
              <ArrowLeft className="w-4 h-4" />Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
