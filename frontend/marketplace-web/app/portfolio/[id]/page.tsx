"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { Breadcrumb, PageLayout } from '@/components/ui'
import { useCreatePortfolio, useDeletePortfolio, useUpdatePortfolio, useUserPortfolio, useUserProfile } from '@/hooks/useUsers'
import { authService } from '@/lib/auth'
import logger from '@/lib/logger'
import { ArrowLeft, Edit, ExternalLink, Eye, EyeOff, Github, Globe, Plus, Star, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

interface PortfolioItem {
  id: number
  title: string
  description: string
  imageUrl?: string
  thumbnailUrl?: string
  projectUrl?: string
  liveUrl?: string
  githubUrl?: string
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

const PROJECT_CATEGORIES = [
  'Web Design', 'UI/UX Design', 'Mobile App', 'Branding & Identity',
  'Graphic Design', 'Motion Graphics', 'Illustration', 'Photography',
  'Video Production', 'Copywriting', 'SEO & Marketing', 'Other',
]

const initialForm = {
  title: '',
  description: '',
  imageUrl: '',
  projectUrl: '',
  liveUrl: '',
  githubUrl: '',
  projectCategory: '',
  technologies: '',
  toolsUsed: '',
  skillsDemonstrated: '',
  isVisible: true,
  startDate: '',
  completionDate: '',
  highlightOrder: '',
}

/**
 * Unified Portfolio Page
 * - Owner view: full CRUD with rich form
 * - Public view: read-only, featured project hero + grid
 * URL: /portfolio/[id]  (id = user account ID)
 */
export default function PortfolioPage() {
  const params = useParams()
  const _router = useRouter()
  const portfolioUserId = params.id as string
  const currentUser = authService.getCurrentUser()
  const isOwnPortfolio = currentUser?.id?.toString() === portfolioUserId

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [undoItem, setUndoItem] = useState<PortfolioItem | null>(null)
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | 'PUBLIC' | 'HIDDEN'>('ALL')
  const [_showHiddenSection, _setShowHiddenSection] = useState(false);
  const undoTimerRef = useRef<number | null>(null)
  const [formData, setFormData] = useState(initialForm)

  // Fetch data
  const { data: freelancerData, isLoading: profileLoading, isError: profileError, error: profileErrorMsg, refetch: refetchProfile } = useUserProfile(portfolioUserId)
  const { data: portfolioData = [], isLoading: portfolioLoading, isError: portfolioError, error: portfolioErrorMsg, refetch: refetchPortfolio } = useUserPortfolio(parseInt(portfolioUserId), isOwnPortfolio)

  const freelancer = freelancerData as FreelancerProfile | undefined

  const createPortfolioMutation = useCreatePortfolio()
  const updatePortfolioMutation = useUpdatePortfolio()
  const deletePortfolioMutation = useDeletePortfolio()

  // Filter based on ownership and visibility
  const visiblePortfolio: PortfolioItem[] = isOwnPortfolio
    ? portfolioData.filter((p) => p.isVisible)
    : portfolioData.filter((p) => p.isVisible)

  const hiddenPortfolio: PortfolioItem[] = isOwnPortfolio
    ? portfolioData.filter((p) => !p.isVisible)
    : []

  // Apply filter state to determine what to show
  let portfolio: PortfolioItem[]
  if (isOwnPortfolio) {
    if (visibilityFilter === 'PUBLIC') {
      portfolio = visiblePortfolio
    } else if (visibilityFilter === 'HIDDEN') {
      portfolio = hiddenPortfolio
    } else {
      portfolio = portfolioData
    }
  } else {
    portfolio = visiblePortfolio
  }

  // Featured = item with lowest highlightOrder; fallback to first by displayOrder
  const featured: PortfolioItem | null =
    portfolio.find((p) => p.highlightOrder === 1) ??
    (portfolio.length > 0 ? portfolio[0] : null)
  const rest = portfolio.filter((p) => p.id !== featured?.id)

  const loading = profileLoading || portfolioLoading
  const error = profileError || portfolioError
  const errorMessage = profileErrorMsg?.message || portfolioErrorMsg?.message

  // ── helpers ──────────────────────────────────────────────────────────────

  const splitCsv = (val: string) =>
    val.split(',').map((s) => s.trim()).filter(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl || undefined,
        projectUrl: formData.projectUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        projectCategory: formData.projectCategory || undefined,
        technologies: formData.technologies ? splitCsv(formData.technologies) : [],
        toolsUsed: formData.toolsUsed ? splitCsv(formData.toolsUsed) : [],
        skillsDemonstrated: formData.skillsDemonstrated ? splitCsv(formData.skillsDemonstrated) : [],
        isVisible: formData.isVisible,
        startDate: formData.startDate || undefined,
        completionDate: formData.completionDate || undefined,
        highlightOrder: formData.highlightOrder ? parseInt(formData.highlightOrder) : undefined,
        displayOrder: editingItem ? editingItem.displayOrder : portfolio.length + 1,
      }

      if (editingItem) {
        await updatePortfolioMutation.mutateAsync({ userId: parseInt(portfolioUserId), itemId: editingItem.id, input: payload })
      } else {
        await createPortfolioMutation.mutateAsync({ userId: parseInt(portfolioUserId), input: payload })
      }
      resetForm()
    } catch (err) {
      logger.error(editingItem ? 'Failed to update portfolio item' : 'Failed to add portfolio item', err as Error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project from your portfolio?')) return
    try {
      await deletePortfolioMutation.mutateAsync({ userId: parseInt(portfolioUserId), itemId: id })
    } catch (err) {
      logger.error('Failed to delete portfolio item', err as Error)
    }
  }

  const toggleVisibility = async (item: PortfolioItem) => {
    if (item.isVisible) {
      setUndoItem({ ...item, isVisible: false })
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current)
      undoTimerRef.current = window.setTimeout(() => { setUndoItem(null) }, 6000)
    }
    try {
      await updatePortfolioMutation.mutateAsync({ userId: parseInt(portfolioUserId), itemId: item.id, input: { isVisible: !item.isVisible } })
    } catch (err) {
      logger.error('Failed to toggle visibility', err as Error)
      setUndoItem(null)
    }
  }

  const restoreVisibility = async (item: PortfolioItem) => {
    if (undoTimerRef.current) { window.clearTimeout(undoTimerRef.current); undoTimerRef.current = null }
    setUndoItem(null)
    try {
      await updatePortfolioMutation.mutateAsync({ userId: parseInt(portfolioUserId), itemId: item.id, input: { isVisible: true } })
    } catch (err) {
      logger.error('Failed to restore visibility', err as Error)
    }
  }

  const editItem = (item: PortfolioItem) => {
    setEditingItem(item)
    const toArr = (v: unknown) => (Array.isArray(v) ? v.join(', ') : '')
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || '',
      projectUrl: item.projectUrl || '',
      liveUrl: item.liveUrl || '',
      githubUrl: item.githubUrl || '',
      projectCategory: item.projectCategory || '',
      technologies: toArr(item.technologies),
      toolsUsed: toArr(item.toolsUsed),
      skillsDemonstrated: toArr(item.skillsDemonstrated),
      isVisible: item.isVisible,
      startDate: item.startDate || '',
      completionDate: item.completionDate || item.endDate || '',
      highlightOrder: item.highlightOrder?.toString() || '',
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData(initialForm)
  }

  // ── rendering ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  if (error || !freelancer) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <ErrorMessage message={errorMessage || 'Failed to load portfolio'} retry={() => { refetchProfile(); refetchPortfolio() }} />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-secondary-50">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="bg-secondary-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              {!isOwnPortfolio ? (
                <Breadcrumb items={[{ label: 'Talents', href: '/talents' }, { label: freelancer.fullName, href: `/freelancers/${freelancer.id}` }, { label: 'Portfolio', href: `/portfolio/${portfolioUserId}` }]} />
              ) : (
                <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Portfolio', href: `/portfolio/${portfolioUserId}` }]} />
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 shadow-lg">
                  {freelancer.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    {isOwnPortfolio ? 'My Portfolio' : `${freelancer.fullName}'s Portfolio`}
                  </h1>
                  <p className="text-secondary-400 text-sm">@{freelancer.username}</p>
                  {freelancer.bio && <p className="text-secondary-300 mt-2 max-w-xl">{freelancer.bio}</p>}
                  <div className="flex gap-4 mt-3 flex-wrap">
                    {freelancer.hourlyRate && <span className="text-white font-medium text-sm">💰 ${freelancer.hourlyRate}/hr</span>}
                    {typeof freelancer.ratingAvg !== 'undefined' && (
                      <span className="flex items-center gap-1 text-secondary-300 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {freelancer.ratingAvg.toFixed(1)} ({freelancer.ratingCount} reviews)
                      </span>
                    )}
                    <span className="text-secondary-400 text-sm">{portfolio.length} project{portfolio.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {isOwnPortfolio && (
                <button
                  onClick={() => { resetForm(); setShowForm(true) }}
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center gap-2 whitespace-nowrap shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Visibility Filter Tabs (Owner Only) ─────────────────────── */}
          {isOwnPortfolio && portfolioData.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="inline-flex rounded-xl bg-secondary-100 p-1 gap-1">
                {[
                  { filter: 'ALL', label: 'All Projects', count: portfolioData.length },
                  { filter: 'PUBLIC', label: 'Public', count: visiblePortfolio.length },
                  { filter: 'HIDDEN', label: 'Hidden', count: hiddenPortfolio.length },
                ].map((tab) => (
                  <button
                    key={tab.filter}
                    onClick={() => setVisibilityFilter(tab.filter as 'ALL' | 'PUBLIC' | 'HIDDEN')}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      visibilityFilter === tab.filter
                        ? 'bg-white text-secondary-900 shadow-sm'
                        : 'text-secondary-600 hover:text-secondary-900'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-md ${
                        visibilityFilter === tab.filter
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-secondary-200 text-secondary-700'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {hiddenPortfolio.length > 0 && visibilityFilter !== 'HIDDEN' && (
                <div className="text-xs text-warning-700 bg-warning-50 px-3 py-2 rounded-lg font-medium flex items-center gap-1.5">
                  <span>⚠️ {hiddenPortfolio.length} hidden project{hiddenPortfolio.length !== 1 ? 's' : ''} not shown to clients</span>
                </div>
              )}
            </div>
          )}

          {/* ── Add/Edit Form ─────────────────────────────────────────────── */}
          {isOwnPortfolio && showForm && (
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6 lg:p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">
                  {editingItem ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button onClick={resetForm} className="p-2 text-secondary-400 hover:text-secondary-700 rounded-lg hover:bg-secondary-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title + Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Project Title *</label>
                    <input type="text" required value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                      placeholder="E.g., E-commerce Website Redesign" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
                    <select value={formData.projectCategory}
                      onChange={(e) => setFormData({ ...formData, projectCategory: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all bg-white">
                      <option value="">Select category</option>
                      {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Description *</label>
                  <textarea required value={formData.description} rows={4}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                    placeholder="Describe the project, your role, challenges solved, and key achievements..." />
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Cover Image URL</label>
                    <input type="url" value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                      placeholder="https://example.com/cover.jpg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Live URL</label>
                    <input type="url" value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                      placeholder="https://yourproject.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">GitHub Repository</label>
                    <input type="url" value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                      placeholder="https://github.com/user/repo" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Case Study / Project URL</label>
                    <input type="url" value={formData.projectUrl}
                      onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                      placeholder="https://behance.net/yourproject" />
                  </div>
                </div>

                {/* Skills & Tools */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Technologies</label>
                    <input type="text" value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                      placeholder="React, Node.js, PostgreSQL" />
                    <p className="text-xs text-secondary-400 mt-1">Comma separated</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Tools Used</label>
                    <input type="text" value={formData.toolsUsed}
                      onChange={(e) => setFormData({ ...formData, toolsUsed: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                      placeholder="Figma, Photoshop, VS Code" />
                    <p className="text-xs text-secondary-400 mt-1">Comma separated</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Skills Demonstrated</label>
                    <input type="text" value={formData.skillsDemonstrated}
                      onChange={(e) => setFormData({ ...formData, skillsDemonstrated: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                      placeholder="UI Design, Branding, Research" />
                    <p className="text-xs text-secondary-400 mt-1">Comma separated</p>
                  </div>
                </div>

                {/* Dates + Display Options */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Start Date</label>
                    <input type="date" value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Completion Date</label>
                    <input type="date" value={formData.completionDate}
                      onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Feature Order
                      <span className="ml-1 text-xs text-secondary-400">(1 = top)</span>
                    </label>
                    <input type="number" min="1" value={formData.highlightOrder}
                      onChange={(e) => setFormData({ ...formData, highlightOrder: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                      placeholder="e.g. 1" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer py-3">
                    <input type="checkbox" checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                      className="w-5 h-5 rounded border-secondary-300 text-primary-600 accent-primary-600" />
                    <span className="text-sm text-secondary-700 font-medium">Publicly visible</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={resetForm}
                    className="px-5 py-2.5 border border-secondary-300 rounded-xl text-secondary-700 hover:bg-secondary-50 transition-colors font-medium">
                    Cancel
                  </button>
                  <button type="submit"
                    disabled={createPortfolioMutation.isPending || updatePortfolioMutation.isPending}
                    className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50">
                    {createPortfolioMutation.isPending || updatePortfolioMutation.isPending
                      ? 'Saving…'
                      : editingItem ? 'Update Project' : 'Add Project'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Undo Banner ───────────────────────────────────────────────── */}
          {undoItem && isOwnPortfolio && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-secondary-900 text-white px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-4">
              <span className="text-sm">Project hidden from public</span>
              <button onClick={() => restoreVisibility(undoItem)} className="text-primary-400 hover:text-primary-300 text-sm font-semibold underline">Undo</button>
            </div>
          )}

          {/* ── Empty State ───────────────────────────────────────────────── */}
          {portfolio.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-16 text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {visibilityFilter === 'HIDDEN' 
                  ? 'No Hidden Projects' 
                  : visibilityFilter === 'PUBLIC' 
                  ? 'No Public Portfolio Items'
                  : isOwnPortfolio ? 'No Projects Yet' : 'No Public Portfolio Items'}
              </h3>
              <p className="text-secondary-500 mb-6 max-w-sm mx-auto">
                {visibilityFilter === 'HIDDEN'
                  ? 'All your projects are currently visible on your profile. Hide projects here to keep them private.'
                  : isOwnPortfolio ? 'Add your best work to showcase your skills and attract clients.' : 'This freelancer hasn\'t added any public portfolio items yet.'}
              </p>
              {isOwnPortfolio && (
                <button onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />Add Your First Project
                </button>
              )}
            </div>
          )}

          {/* ── Featured Project Hero ─────────────────────────────────────── */}
          {featured && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-secondary-500 uppercase tracking-wider">Featured Project</span>
                {isOwnPortfolio && !featured.isVisible && (
                  <span className="ml-2 px-2 py-0.5 bg-warning-100 text-warning-700 rounded text-xs font-medium">Hidden</span>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden lg:grid lg:grid-cols-5">
                {/* Image - 3/5 */}
                <div className="relative h-64 lg:col-span-3 lg:h-auto min-h-[280px] bg-gradient-to-br from-primary-50 via-secondary-50 to-secondary-100">
                  {featured.imageUrl && (
                    <Image src={featured.imageUrl} alt={featured.title} fill className="object-cover" onError={() => {}} />
                  )}
                  {featured.projectCategory && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-secondary-700 rounded-full text-xs font-semibold shadow-sm">
                      {featured.projectCategory}
                    </span>
                  )}
                </div>

                {/* Details - 2/5 */}
                <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-3">{featured.title}</h2>
                    <p className="text-secondary-600 mb-4 line-clamp-4">{featured.description}</p>

                    {featured.technologies && featured.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featured.technologies.slice(0, 6).map((t, i) => (
                          <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">{t}</span>
                        ))}
                      </div>
                    )}

                    {(featured.startDate || featured.completionDate || featured.endDate) && (
                      <p className="text-sm text-secondary-400 mb-4">
                        {featured.startDate && <span>{new Date(featured.startDate).getFullYear()} – </span>}
                        {(featured.completionDate || featured.endDate) && new Date(featured.completionDate || featured.endDate!).getFullYear()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link href={`/portfolio/${portfolioUserId}/project/${featured.id}`}
                      className="w-full px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium text-center text-sm">
                      View Full Case Study →
                    </Link>
                    <div className="flex gap-2">
                      {featured.liveUrl && (
                        <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-secondary-300 text-secondary-700 rounded-xl hover:bg-secondary-50 transition-colors text-sm font-medium">
                          <Globe className="w-3.5 h-3.5" />Live
                        </a>
                      )}
                      {featured.githubUrl && (
                        <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-secondary-300 text-secondary-700 rounded-xl hover:bg-secondary-50 transition-colors text-sm font-medium">
                          <Github className="w-3.5 h-3.5" />Code
                        </a>
                      )}
                    </div>
                    {isOwnPortfolio && (
                      <div className="flex gap-2 pt-1 border-t border-secondary-100">
                        <button onClick={() => editItem(featured)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors text-sm font-medium"
                          title="Edit project"
                        >
                          <Edit className="w-3.5 h-3.5" />Edit
                        </button>
                        <button onClick={() => toggleVisibility(featured)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-colors text-sm"
                          title={featured.isVisible ? 'Hide from profile' : 'Show on profile'}
                        >
                          {featured.isVisible ? (
                            <><EyeOff className="w-3.5 h-3.5" />Hide</>
                          ) : (
                            <><Eye className="w-3.5 h-3.5 text-warning-600" />Show</>
                          )}
                        </button>
                        <button onClick={() => handleDelete(featured.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-error-600 hover:bg-error-50 rounded-xl transition-colors text-sm">
                          <Trash2 className="w-3.5 h-3.5" />Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Rest of Portfolio Grid ────────────────────────────────────── */}
          {rest.length > 0 && (
            <>
              {featured && (
                <h3 className="text-sm font-semibold text-secondary-500 uppercase tracking-wider mb-4">
                  More Projects ({rest.length})
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {rest.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden group flex flex-col">
                    {/* Cover image */}
                    <div className="relative h-52 bg-gradient-to-br from-primary-50 to-secondary-100">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" onError={() => {}} />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      {item.projectCategory && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-secondary-600 rounded-full text-xs font-medium shadow-sm">
                          {item.projectCategory}
                        </span>
                      )}
                      {isOwnPortfolio && !item.isVisible && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-warning-500 text-warning-900 rounded-full text-xs font-semibold">Hidden</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-semibold text-secondary-900 mb-1.5">{item.title}</h3>
                      <p className="text-secondary-500 text-sm mb-3 line-clamp-2 flex-1">{item.description}</p>

                      {item.technologies && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {item.technologies.slice(0, 4).map((t, i) => (
                            <span key={i} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">{t}</span>
                          ))}
                          {item.technologies.length > 4 && (
                            <span className="px-2 py-0.5 bg-secondary-100 text-secondary-500 rounded-full text-xs">+{item.technologies.length - 4}</span>
                          )}
                        </div>
                      )}

                      <div className="border-t border-secondary-100 pt-3 mt-auto">
                        {isOwnPortfolio ? (
                          <div className="flex items-center justify-between">
                            <Link href={`/portfolio/${portfolioUserId}/project/${item.id}`}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                              View details →
                            </Link>
                            <div className="flex gap-1">
                              <button onClick={() => editItem(item)} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit project">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => toggleVisibility(item)} 
                                className={`p-1.5 rounded-lg transition-colors ${
                                  item.isVisible
                                    ? 'text-secondary-500 hover:bg-secondary-50'
                                    : 'text-warning-600 hover:bg-warning-50'
                                }`}
                                title={item.isVisible ? 'Hide from profile' : 'Show on profile'}
                              >
                                {item.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-error-500 hover:bg-error-50 rounded-lg transition-colors" title="Delete project">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <Link href={`/portfolio/${portfolioUserId}/project/${item.id}`}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                              View case study →
                            </Link>
                            <div className="flex gap-2">
                              {item.liveUrl && (
                                <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-secondary-500 hover:text-secondary-700" title="Live site">
                                  <Globe className="w-4 h-4" />
                                </a>
                              )}
                              {item.githubUrl && (
                                <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-secondary-500 hover:text-secondary-700" title="GitHub">
                                  <Github className="w-4 h-4" />
                                </a>
                              )}
                              {item.projectUrl && (
                                <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-secondary-500 hover:text-secondary-700" title="Project">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Hidden Projects Info Banner (Owner Only) ─────────────────── */}
          {isOwnPortfolio && visibilityFilter === 'HIDDEN' && hiddenPortfolio.length > 0 && (
            <div className="mb-6 bg-warning-50 border border-warning-200 rounded-2xl p-6 flex gap-4">
              <div className="flex-shrink-0 w-5 h-5 text-warning-700 mt-0.5">
                ⚠️
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-warning-900 mb-1">Hidden Projects</h4>
                <p className="text-sm text-warning-800 mb-4">
                  These {hiddenPortfolio.length} project{hiddenPortfolio.length !== 1 ? 's' : ''} are kept private and won&apos;t appear on your public profile or in client searches. Click the eye icon on any project to restore it to your public portfolio.
                </p>
                <button
                  onClick={() => setVisibilityFilter('ALL')}
                  className="text-sm font-medium text-warning-700 hover:text-warning-900 flex items-center gap-1"
                >
                  View all projects →
                </button>
              </div>
            </div>
          )}

          {/* ── CTA for public view ───────────────────────────────────────── */}
          {!isOwnPortfolio && portfolio.length > 0 && (
            <div className="mt-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Impressed by {freelancer.fullName}&apos;s work?</h3>
                  <p className="text-primary-100">Hire them for your next project</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <Link href={`/freelancers/${freelancer.id}`}
                    className="px-4 py-2.5 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors font-medium text-sm">
                    View Profile
                  </Link>
                  <Link href={`/freelancers/${freelancer.id}`}
                    className="px-4 py-2.5 bg-white text-primary-700 rounded-xl hover:bg-primary-50 transition-colors font-semibold text-sm">
                    Contact Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── Footer Nav ────────────────────────────────────────────────── */}
          <div className="flex justify-center mt-10">
            {isOwnPortfolio ? (
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-700 text-sm">
                <ArrowLeft className="w-4 h-4" />Back to Dashboard
              </Link>
            ) : (
              <Link href="/talents" className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-700 text-sm">
                <ArrowLeft className="w-4 h-4" />Browse More Talent
              </Link>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
