import {
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { resourcesApi, type Resource } from '../lib/resourcesApi'

interface ResourceCategory {
  id: string
  name: string
}

// Resource Detail Modal
function ResourceDetailModal({ isOpen, resource, onClose }: { isOpen: boolean; resource: Resource | null; onClose: () => void }) {
  if (!isOpen || !resource) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="px-6 py-4 border-b border-secondary-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary-900">Resource Details</h2>
          <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-secondary-700">Title</h3>
            <p className="text-secondary-900">{resource.title}</p>
          </div>
          <div>
            <h3 className="font-semibold text-secondary-700">Excerpt</h3>
            <p className="text-secondary-900">{resource.excerpt}</p>
          </div>
          <div>
            <h3 className="font-semibold text-secondary-700">Content</h3>
            <p className="text-secondary-900 whitespace-pre-wrap line-clamp-3">{resource.content}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-secondary-700">Type</h3>
              <p className="text-secondary-900">{resource.content_type}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-700">Status</h3>
              <p className="text-secondary-900">{resource.status === 'published' ? 'Published' : 'Draft'}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-secondary-700">Views</h3>
              <p className="text-secondary-900">{resource.view_count || 0}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-700">Likes</h3>
              <p className="text-secondary-900">{resource.like_count || 0}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-700">Featured</h3>
              <p className="text-secondary-900">{resource.is_featured ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-secondary-700">Created</h3>
              <p className="text-secondary-900">{new Date(resource.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-700">Updated</h3>
              <p className="text-secondary-900">{new Date(resource.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-secondary-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200 font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Add/Edit Resource Modal
function AddEditResourceModal({ isOpen, onClose, onSubmit, isLoading, editingResource, categories }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading: boolean
  editingResource?: Resource | null
  categories: ResourceCategory[]
}) {
  const [formData, setFormData] = useState({
    title: editingResource?.title || '',
    excerpt: editingResource?.excerpt || '',
    content: editingResource?.content || '',
    content_type: editingResource?.content_type || 'blog',
    status: editingResource?.status || 'draft',
    category_id: editingResource?.category_id || '',
    is_featured: editingResource?.is_featured || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error('Please fill in all required fields')
      return
    }
    onSubmit(formData)
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      content_type: 'blog',
      status: 'draft',
      category_id: '',
      is_featured: false,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-secondary-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-secondary-900">{editingResource ? 'Edit Resource' : 'Add New Resource'}</h2>
          <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Excerpt *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Type</label>
              <select
                value={formData.content_type}
                onChange={(e) => setFormData({ ...formData, content_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="blog">Blog</option>
                <option value="article">Article</option>
                <option value="news">News</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded border-secondary-300"
            />
            <label htmlFor="featured" className="text-sm font-medium text-secondary-700">Featured</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : editingResource ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'' | 'blog' | 'article' | 'news'>('')
  const [statusFilter, setStatusFilter] = useState<'' | 'draft' | 'published'>('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [selectedResourceDetail, setSelectedResourceDetail] = useState<Resource | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-resources', page, searchQuery, typeFilter, statusFilter],
    queryFn: () =>
      resourcesApi.getAll({
        page: page + 1,
        limit: 10,
        search: searchQuery || undefined,
        content_type: typeFilter || undefined,
        status: statusFilter || undefined,
      }),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['resource-categories'],
    queryFn: () => resourcesApi.getCategories(),
  })

  const createResourceMutation = useMutation({
    mutationFn: (payload: any) => resourcesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] })
      toast.success('Resource created successfully')
      setShowAddModal(false)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create resource')
    },
  })

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => resourcesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] })
      toast.success('Resource updated successfully')
      setShowAddModal(false)
      setEditingResource(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update resource')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => resourcesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] })
      toast.success('Resource deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete resource')
    },
  })

  const getTypeBadgeColor = (type: string): string => {
    switch (type) {
      case 'blog':
        return 'bg-primary-100 text-blue-800'
      case 'article':
        return 'bg-success-100 text-success-800'
      case 'news':
        return 'bg-warning-100 text-warning-800'
      default:
        return 'bg-secondary-100 text-secondary-800'
    }
  }

  const getStatusBadgeColor = (status: string): string => {
    return status === 'published'
      ? 'bg-success-100 text-success-800'
      : 'bg-warning-100 text-warning-800'
  }

  const resources = (data || []) as Resource[]

  const handleAddResource = (formData: any) => {
    createResourceMutation.mutate(formData)
  }

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource)
    setShowAddModal(true)
  }

  const handleSaveEdit = (formData: any) => {
    if (editingResource) {
      updateResourceMutation.mutate({ id: editingResource.id, payload: formData })
    }
  }

  const handleViewResource = (resource: Resource) => {
    setSelectedResourceDetail(resource)
    setShowDetailModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Resources Management</h1>
          <p className="text-secondary-600 mt-1">Manage blog posts, articles, and news</p>
        </div>
        <button
          onClick={() => {
            setEditingResource(null)
            setShowAddModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          Add Resource
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-60">
            <input
              type="text"
              placeholder="Search resources by title or content..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(0)
              }}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as '' | 'blog' | 'article' | 'news')
              setPage(0)
            }}
            className="px-4 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Types</option>
            <option value="blog">Blog</option>
            <option value="article">Article</option>
            <option value="news">News</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as '' | 'draft' | 'published')
              setPage(0)
            }}
            className="px-4 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Views</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Created</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-secondary-500">
                  Loading resources...
                </td>
              </tr>
            ) : resources.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-secondary-500">
                  No resources found
                </td>
              </tr>
            ) : (
              resources.map((resource) => (
                <tr key={resource.id} className="border-t border-secondary-200 hover:bg-primary-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-secondary-900 max-w-xs truncate">{resource.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(resource.content_type)}`}>
                      {resource.content_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(resource.status)}`}>
                      {resource.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-600">{resource.view_count || 0}</td>
                  <td className="px-6 py-4 text-sm text-secondary-600">
                    {new Date(resource.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewResource(resource)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditResource(resource)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this resource?')) {
                            deleteMutation.mutate(resource.id)
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1 text-error-600 hover:bg-error-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-secondary-200 flex items-center justify-between bg-secondary-50">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-secondary-300 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="text-sm text-secondary-700">
            Page {page + 1}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={resources.length === 0 || resources.length < 10}
            className="px-4 py-2 border border-secondary-300 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-secondary-500">
            Loading resources...
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-secondary-500">
            No resources found
          </div>
        ) : (
          resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-sm p-4 space-y-3 border-l-4 border-primary-600">
              <div>
                <h3 className="font-semibold text-secondary-900 truncate">{resource.title}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-secondary-600">Type</p>
                  <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(resource.content_type)}`}>
                    {resource.content_type}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-600">Status</p>
                  <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(resource.status)}`}>
                    {resource.status === 'published' ? 'Published' : 'Draft'}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-600">Views</p>
                  <p className="font-medium text-secondary-900">{resource.view_count || 0}</p>
                </div>
                <div>
                  <p className="text-secondary-600">Created</p>
                  <p className="font-medium text-secondary-900">{new Date(resource.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-secondary-200">
                <button
                  onClick={() => handleViewResource(resource)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                >
                  <EyeIcon className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditResource(resource)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this resource?')) {
                      deleteMutation.mutate(resource.id)
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-error-600 bg-error-50 rounded-lg hover:bg-error-100 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* Mobile Pagination */}
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={resources.length === 0 || resources.length < 10}
            className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Add/Edit Resource Modal */}
      <AddEditResourceModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingResource(null)
        }}
        onSubmit={editingResource ? handleSaveEdit : handleAddResource}
        isLoading={createResourceMutation.isPending || updateResourceMutation.isPending}
        editingResource={editingResource}
        categories={categories}
      />

      {/* Resource Detail Modal */}
      <ResourceDetailModal
        isOpen={showDetailModal}
        resource={selectedResourceDetail}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedResourceDetail(null)
        }}
      />
    </div>
  )
}
