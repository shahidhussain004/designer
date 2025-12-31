"use client"

import { Button, Card, Divider, Flex, Grid, Spinner, Text } from '@/components/green'
import { PageLayout } from '@/components/ui'
import apiClient from '@/lib/api-client'
import { authService } from '@/lib/auth'
import logger from '@/lib/logger'
import { Edit, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

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

  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    loadData()
  }, [portfolioUserId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load freelancer profile
      const profileRes = await apiClient.get(`/users/${portfolioUserId}/profile`)
      if (profileRes.data) {
        setFreelancer(profileRes.data)
      }

      // Load portfolio items
      const portfolioRes = await apiClient.get(`/users/${portfolioUserId}/portfolio`)
      if (portfolioRes.data) {
        // Filter: show only visible items for non-owners
        const items = portfolioRes.data || []
        const filtered = isOwnPortfolio ? items : items.filter((p: PortfolioItem) => p.isVisible)
        setPortfolio(filtered)
      }
    } catch (err) {
      logger.error('Failed to load portfolio data', err as Error)
      setError(err instanceof Error ? err.message : 'Failed to load portfolio')
    } finally {
      setLoading(false)
    }
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

      const endpoint = editingItem
        ? `/portfolio/${editingItem.id}?userId=${portfolioUserId}`
        : `/portfolio?userId=${portfolioUserId}`

      if (editingItem) {
        await apiClient.put(endpoint, payload)
      } else {
        await apiClient.post(endpoint, payload)
      }

      await loadData()
      resetForm()
    } catch (err) {
      logger.error(editingItem ? 'Failed to update portfolio item' : 'Failed to add portfolio item', err as Error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return

    try {
      await apiClient.delete(`/portfolio/${id}?userId=${portfolioUserId}`)
      await loadData()
    } catch (err) {
      logger.error('Failed to delete portfolio item', err as Error)
    }
  }

  const toggleVisibility = async (item: PortfolioItem) => {
    // Optimistic update
    setPortfolio((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, isVisible: !p.isVisible } : p))
    )

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
      await apiClient.put(`/portfolio/${item.id}?userId=${portfolioUserId}`, {
        ...item,
        isVisible: !item.isVisible,
      })
    } catch (err) {
      logger.error('Failed to toggle visibility', err as Error)
      // Revert optimistic change
      setPortfolio((prev) => prev.map((p) => (p.id === item.id ? item : p)))
      setUndoItem(null)
      if (undoTimerRef.current) {
        window.clearTimeout(undoTimerRef.current)
        undoTimerRef.current = null
      }
    }
  }

  const restoreVisibility = async (item: PortfolioItem) => {
    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current)
      undoTimerRef.current = null
    }
    setUndoItem(null)
    setPortfolio((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, isVisible: true } : p))
    )
    try {
      await apiClient.put(`/portfolio/${item.id}?userId=${portfolioUserId}`, {
        ...item,
        isVisible: true,
      })
    } catch (err) {
      logger.error('Failed to restore visibility', err as Error)
    }
  }

  const editItem = (item: PortfolioItem) => {
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
        <Flex justify-content="center" align-items="center" style={{ minHeight: '400px' }}>
          <Spinner />
        </Flex>
      </PageLayout>
    )
  }

  if (error || !freelancer) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" style={{ minHeight: '400px' }}>
          <Card padding="xl">
            <Flex flex-direction="column" align-items="center" gap="m">
              <Text font-size="heading-s">Portfolio Not Found</Text>
              <Text font-size="body-l" color="neutral-02">
                {error || 'Unable to load portfolio'}
              </Text>
              <Flex gap="m">
                <Link href="/talents">
                  <Button>Browse Talent</Button>
                </Link>
                {isOwnPortfolio && (
                  <Link href="/dashboard">
                    <Button rank="secondary">Go to Dashboard</Button>
                  </Link>
                )}
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l">
        {/* Header & Navigation */}
        <div>
          {/* Breadcrumb Navigation */}
          {!isOwnPortfolio && (
            <Flex gap="m" align-items="center" style={{ marginBottom: '1.5rem' }}>
              <Link href="/talents">
                <Button rank="tertiary" size="small">
                  ← Back to Talent
                </Button>
              </Link>
              <Text font-size="body-s" color="neutral-02">/</Text>
              <Link href={`/freelancers/${freelancer.id}`}>
                <Button rank="tertiary" size="small">
                  View Profile
                </Button>
              </Link>
            </Flex>
          )}

          {/* Page Header */}
          <Flex justify-content="space-between" align-items="start" gap="l">
            <Flex gap="m" align-items="start" style={{ flex: 1 }}>
              {/* Avatar */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {freelancer.fullName?.charAt(0).toUpperCase()}
              </div>

              {/* Profile Info */}
              <Flex flex-direction="column" gap="s" style={{ flex: 1 }}>
                <div>
                  <Text font-size="heading-l">
                    {isOwnPortfolio ? 'My Portfolio' : `${freelancer.fullName}'s Portfolio`}
                  </Text>
                  <Text font-size="body-l" color="neutral-02">
                    @{freelancer.username}
                  </Text>
                </div>

                {freelancer.bio && (
                  <Text font-size="body-l" color="neutral-02">
                    {freelancer.bio}
                  </Text>
                )}

                {(freelancer.hourlyRate || freelancer.ratingAvg) && (
                  <Flex gap="l" align-items="center">
                    {freelancer.hourlyRate && (
                      <Text font-size="body-l" font-weight="bold">
                        💰 ${freelancer.hourlyRate}/hr
                      </Text>
                    )}
                    {typeof freelancer.ratingAvg !== 'undefined' && (
                      <Text font-size="body-l">
                        ⭐ {freelancer.ratingAvg.toFixed(1)} ({freelancer.ratingCount} reviews)
                      </Text>
                    )}
                  </Flex>
                )}
              </Flex>
            </Flex>

            {/* Owner Actions */}
            {isOwnPortfolio && (
              <Button onClick={() => setShowForm(!showForm)} style={{ whiteSpace: 'nowrap' }}>
                <Plus size={16} style={{ marginRight: '0.5rem' }} />
                Add Project
              </Button>
            )}
          </Flex>
        </div>

        <Divider />

        {/* Add/Edit Form (Owner Only) */}
        {isOwnPortfolio && showForm && (
          <Card padding="l" style={{ backgroundColor: '#f8f9fa' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              {editingItem ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                  }}
                  placeholder="E.g., E-commerce Website Redesign"
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Describe the project, your role, and key achievements..."
                />
              </div>

              {/* URLs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                    }}
                    placeholder="https://example.com/project.jpg"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Project URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.projectUrl}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                    }}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Technologies (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                  }}
                  placeholder="React, Node.js, PostgreSQL, AWS"
                />
              </div>

              {/* Completion Date & Visibility Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>Visible to public</span>
                </label>
              </div>

              {/* Action Buttons */}
              <Flex gap="m" justify-content="flex-end">
                <Button
                  rank="tertiary"
                  onClick={resetForm}
                  style={{ cursor: 'pointer' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  style={{ cursor: 'pointer' }}
                >
                  {editingItem ? 'Update Project' : 'Add Project'}
                </Button>
              </Flex>
            </form>
          </Card>
        )}

        {/* Undo Banner */}
        {undoItem && isOwnPortfolio && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#1a1a1a',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '6px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span>Project hidden</span>
            <button
              onClick={() => restoreVisibility(undoItem)}
              style={{
                background: 'none',
                border: 'none',
                color: '#60a5fa',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Undo
            </button>
          </div>
        )}

        {/* Portfolio Content */}
        {portfolio.length === 0 ? (
          <Card padding="xl">
            <Flex flex-direction="column" align-items="center" gap="m">
              <Text font-size="heading-s">
                {isOwnPortfolio ? 'No Projects Yet' : 'No Public Portfolio Items'}
              </Text>
              <Text font-size="body-l" color="neutral-02">
                {isOwnPortfolio
                  ? 'Add your best work to showcase your skills'
                  : 'This freelancer hasnt added any public portfolio items yet'}
              </Text>
              {isOwnPortfolio && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus size={16} style={{ marginRight: '0.5rem' }} />
                  Add Your First Project
                </Button>
              )}
            </Flex>
          </Card>
        ) : (
          <Grid columns="2" gap="l">
            {portfolio.map((item) => (
              <Card key={item.id} padding="0" style={{ overflow: 'hidden' }}>
                {/* Image Section */}
                <div
                  style={{
                    width: '100%',
                    height: '250px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    position: 'relative',
                  }}
                >
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
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(255, 193, 7, 0.9)',
                        color: '#333',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      Hidden
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Flex flex-direction="column" gap="m">
                    {/* Title */}
                    <Text font-size="heading-s">{item.title}</Text>

                    {/* Description */}
                    <Text font-size="body-l" color="neutral-02" style={{ lineHeight: '1.6' }}>
                      {item.description}
                    </Text>

                    {/* Technologies */}
                    {item.technologies && item.technologies.length > 0 && (
                      <Flex gap="s" style={{ flexWrap: 'wrap' }}>
                        {item.technologies.map((tech, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '0.35rem 0.75rem',
                              backgroundColor: '#667eea20',
                              borderRadius: '20px',
                              fontSize: '0.875rem',
                              color: '#667eea',
                              fontWeight: 500,
                            }}
                          >
                            {tech}
                          </div>
                        ))}
                      </Flex>
                    )}

                    {/* Metadata */}
                    {item.completionDate && (
                      <Text font-size="body-s" color="neutral-02">
                        📅 Completed: {new Date(item.completionDate).toLocaleDateString()}
                      </Text>
                    )}
                  </Flex>

                  <Divider />

                  {/* Actions */}
                  {isOwnPortfolio ? (
                    <Flex gap="m" justify-content="space-between" align-items="center">
                      <Flex gap="m">
                        <button
                          onClick={() => toggleVisibility(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#666',
                            fontSize: '0.875rem',
                          }}
                          title={item.isVisible ? 'Hide from public' : 'Make visible'}
                        >
                          {item.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                          <span>{item.isVisible ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </Flex>

                      <Flex gap="m">
                        <button
                          onClick={() => editItem(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#667eea',
                            padding: '0.5rem',
                          }}
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#e53e3e',
                            padding: '0.5rem',
                          }}
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </Flex>
                    </Flex>
                  ) : (
                    <>
                      {item.projectUrl && (
                        <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                          <Button rank="secondary" style={{ width: '100%' }}>
                            View Live Project →
                          </Button>
                        </a>
                      )}
                    </>
                  )}
                </div>
              </Card>
            ))}
          </Grid>
        )}

        {/* CTA Section (Public View Only) */}
        {!isOwnPortfolio && portfolio.length > 0 && (
          <Card
            padding="l"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Flex justify-content="space-between" align-items="center">
              <Flex flex-direction="column" gap="s">
                <Text font-size="heading-s" style={{ color: 'white' }}>
                  Impressed by this work?
                </Text>
                <Text font-size="body-l" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Hire {freelancer.fullName} for your next project
                </Text>
              </Flex>
              <Flex gap="m">
                <Link href={`/freelancers/${freelancer.id}`}>
                  <Button rank="secondary">View Profile</Button>
                </Link>
                <Button style={{ whiteSpace: 'nowrap' }}>Contact Freelancer</Button>
              </Flex>
            </Flex>
          </Card>
        )}

        {/* Navigation Footer */}
        <Flex gap="m" justify-content="center" padding="l">
          {isOwnPortfolio ? (
            <Link href="/dashboard">
              <Button rank="tertiary">← Back to Dashboard</Button>
            </Link>
          ) : (
            <Link href="/talents">
              <Button rank="tertiary">← Browse More Talent</Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </PageLayout>
  )
}
