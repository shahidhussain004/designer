"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { Breadcrumb, PageLayout } from '@/components/ui'
import { useCreatePortfolio, useDeletePortfolio, useUpdatePortfolio, useUserPortfolio, useUserProfile } from '@/hooks/useUsers'
import { authService } from '@/lib/auth'
import logger from '@/lib/logger'
import { ArrowLeft, Edit, ExternalLink, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

interface PortfolioItem {
  id: number
  title: string
  description: string
  imageUrl: string
  projectUrl?: string
  technologies: string[]
  displayOrder: number
  isVisible: boolean
  completionDate?: string
  createdAt: string
}

interface FreelancerProfile {
  id: number
  fullName: string
  username: string
  bio?: string
  profileImageUrl?: string
  hourlyRate?: number
  ratingAvg?: number
  ratingCount?: number
  email?: string
  location?: string
}

/**
 * Unified Portfolio Page
 * Handles both owner's portfolio (edit mode) and public portfolio viewing
 * URL: /portfolio/[id]
 * - If [id] matches current user's id: show "My Portfolio" with edit controls
 * - If [id] is different: show freelancer's portfolio in read-only mode
 */
export default function PortfolioPage() {
  const params = useParams()
  const router = useRouter()
  const portfolioUserId = params.id as string
  const currentUser = authService.getCurrentUser()
  const isOwnPortfolio = currentUser?.id?.toString() === portfolioUserId

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [undoItem, setUndoItem] = useState<PortfolioItem | null>(null)
  const undoTimerRef = useRef<number | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    technologies: '',
    isVisible: true,
    completionDate: '',
  })

  // Fetch data using hooks
  const { data: freelancerData, isLoading: profileLoading, isError: profileError, error: profileErrorMsg, refetch: refetchProfile } = useUserProfile(portfolioUserId)
  const { data: portfolioData = [], isLoading: portfolioLoading, isError: portfolioError, error: portfolioErrorMsg, refetch: refetchPortfolio } = useUserPortfolio(parseInt(portfolioUserId))
  
  const freelancer = freelancerData as FreelancerProfile | undefined
  
  // Mutations
  const createPortfolioMutation = useCreatePortfolio()
  const updatePortfolioMutation = useUpdatePortfolio()
  const deletePortfolioMutation = useDeletePortfolio()

  // Filter: show only visible items for non-owners
  const portfolio = isOwnPortfolio 
    ? portfolioData 
    : portfolioData.filter((p: any) => p.isVisible)

  const loading = profileLoading || portfolioLoading
  const error = profileError || portfolioError
  const errorMessage = profileErrorMsg?.message || portfolioErrorMsg?.message

  const loadData = () => {
    refetchProfile()
    refetchPortfolio()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        projectUrl: formData.projectUrl || undefined,
        technologies: formData.technologies.split(',').map((t) => t.trim()),
        isVisible: formData.isVisible,
        completionDate: formData.completionDate || undefined,
        displayOrder: editingItem ? editingItem.displayOrder : portfolio.length + 1,
      }

      if (editingItem) {
        await updatePortfolioMutation.mutateAsync({
          userId: parseInt(portfolioUserId),
          itemId: editingItem.id,
          input: payload
        })
      } else {
        await createPortfolioMutation.mutateAsync({
          userId: parseInt(portfolioUserId),
          input: payload
        })
      }

      resetForm()
    } catch (err) {
      logger.error(editingItem ? 'Failed to update portfolio item' : 'Failed to add portfolio item', err as Error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return

    try {
      await deletePortfolioMutation.mutateAsync({
        userId: parseInt(portfolioUserId),
        itemId: id
      })
    } catch (err) {
      logger.error('Failed to delete portfolio item', err as Error)
    }
  }

  const toggleVisibility = async (item: any) => {
    // Show undo banner if hiding
    if (item.isVisible) {
      setUndoItem({ ...item, isVisible: false })
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current)
      undoTimerRef.current = window.setTimeout(() => {
        setUndoItem(null)
        undoTimerRef.current = null
      }, 6000)
    }

    try {
      await updatePortfolioMutation.mutateAsync({
        userId: parseInt(portfolioUserId),
        itemId: item.id,
        input: {
          ...item,
          isVisible: !item.isVisible,
        }
      })
    } catch (err) {
      logger.error('Failed to toggle visibility', err as Error)
      setUndoItem(null)
      if (undoTimerRef.current) {
        window.clearTimeout(undoTimerRef.current)
        undoTimerRef.current = null
      }
    }
  }

  const restoreVisibility = async (item: any) => {
    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current)
      undoTimerRef.current = null
    }
    setUndoItem(null)
    
    try {
      await updatePortfolioMutation.mutateAsync({
        userId: parseInt(portfolioUserId),
        itemId: item.id,
        input: {
          ...item,
          isVisible: true,
        }
      })
    } catch (err) {
      logger.error('Failed to restore visibility', err as Error)
    }
  }

  const editItem = (item: any) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      projectUrl: item.projectUrl || '',
      technologies: item.technologies.join(', '),
      isVisible: item.isVisible,
      completionDate: item.completionDate || '',
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      projectUrl: '',
      technologies: '',
      isVisible: true,
      completionDate: '',
    })
  }

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
            retry={() => loadData()}
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
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
              {!isOwnPortfolio && (
                <Breadcrumb
                  items={[
                    { label: 'Talents', href: '/talents' },
                    { label: freelancer?.fullName || `@${freelancer?.username}`, href: `/freelancers/${freelancer?.id}` },
                    { label: 'Portfolio', href: `/portfolio/${portfolioUserId}` },
                  ]}
                />
              )}
              {isOwnPortfolio && (
                <Breadcrumb
                  items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Freelancer', href: '/dashboard/freelancer' },
                    { label: 'Portfolio', href: `/portfolio/${portfolioUserId}` },
                  ]}
                />
              )}
            </div>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex gap-4 items-start">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-4xl font-bold text-white flex-shrink-0">
                  {freelancer.fullName?.charAt(0).toUpperCase()}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">
                    {isOwnPortfolio ? 'My Portfolio' : `${freelancer.fullName}'s Portfolio`}
                  </h1>
                  <p className="text-gray-400">@{freelancer.username}</p>

                  {freelancer.bio && (
                    <p className="text-gray-300 mt-2">{freelancer.bio}</p>
                  )}

                  {(freelancer.hourlyRate || freelancer.ratingAvg) && (
                    <div className="flex gap-4 mt-3">
                      {freelancer.hourlyRate && (
                        <span className="text-white font-medium">💰 ${freelancer.hourlyRate}/hr</span>
                      )}
                      {typeof freelancer.ratingAvg !== 'undefined' && (
                        <span className="text-gray-300">⭐ {freelancer.ratingAvg.toFixed(1)} ({freelancer.ratingCount} reviews)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Actions */}
              {isOwnPortfolio && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Add/Edit Form (Owner Only) */}
          {isOwnPortfolio && showForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingItem ? 'Edit Project' : 'Add New Project'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
                  placeholder="E.g., E-commerce Website Redesign"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none"
                  placeholder="Describe the project, your role, and key achievements..."
                />
              </div>

              {/* URLs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
                    placeholder="https://example.com/project.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.projectUrl}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none"
                  placeholder="React, Node.js, PostgreSQL, AWS"
                />
              </div>

              {/* Completion Date & Visibility Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer py-3">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">Visible to public</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  {editingItem ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        )}

          {/* Undo Banner */}
          {undoItem && isOwnPortfolio && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-4">
              <span>Project hidden</span>
              <button
                onClick={() => restoreVisibility(undoItem)}
                className="text-primary-400 hover:text-primary-300 underline"
              >
                Undo
              </button>
            </div>
          )}

          {/* Portfolio Content */}
          {portfolio.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isOwnPortfolio ? 'No Projects Yet' : 'No Public Portfolio Items'}
              </h3>
              <p className="text-gray-500 mb-6">
                {isOwnPortfolio
                  ? 'Add your best work to showcase your skills'
                  : 'This freelancer hasnt added any public portfolio items yet'}
              </p>
              {isOwnPortfolio && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.map((item) => (
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

                    {/* Hidden Badge (Owner Only) */}
                    {isOwnPortfolio && !item.isVisible && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-amber-900 px-3 py-1 rounded text-xs font-semibold">
                        Hidden
                      </div>
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
                    {isOwnPortfolio ? (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleVisibility(item)}
                          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                          title={item.isVisible ? 'Hide from public' : 'Make visible'}
                        >
                          {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{item.isVisible ? 'Visible' : 'Hidden'}</span>
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => editItem(item)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section (Public View Only) */}
          {!isOwnPortfolio && portfolio.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
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

          {/* Navigation Footer */}
          <div className="flex justify-center mt-8">
            {isOwnPortfolio ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            ) : (
              <Link
                href="/talents"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse More Talent
              </Link>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
