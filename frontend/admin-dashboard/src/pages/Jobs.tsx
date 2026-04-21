import {
    EyeIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon
} from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { jobsApi } from '../lib/api'

interface AdminJobResponse {
  id: number
  title: string
  description: string
  categoryName: string
  budgetMin: number
  budgetMax: number
  status: string
  employerId: number
  employerName: string
  applicationsCount: number
  createdAt: string
  updatedAt: string
}

interface JobCategory {
  id: number
  name: string
  slug: string
}

// Job Detail Modal
function JobDetailModal({ isOpen, job, onClose }: { isOpen: boolean; job: AdminJobResponse | null; onClose: () => void }) {
  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="px-6 py-4 border-b border-secondary-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary-900">Job Details</h2>
          <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-secondary-700">Title</h3>
            <p className="text-secondary-900">{job.title}</p>
          </div>
          <div>
            <h3 className="font-semibold text-secondary-700">Description</h3>
            <p className="text-secondary-900 whitespace-pre-wrap">{job.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-secondary-700">Category</h3>
              <p className="text-secondary-900">{job.categoryName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-700">Budget</h3>
              <p className="text-secondary-900">${job.budgetMin?.toLocaleString()} - ${job.budgetMax?.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-secondary-700">Status</h3>
              <p className="text-secondary-900">{job.status}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-700">Employer</h3>
              <p className="text-secondary-900">{job.employerName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-700">Applications</h3>
              <p className="text-secondary-900">{job.applicationsCount}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-secondary-700">Posted</h3>
              <p className="text-secondary-900">{new Date(job.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-700">Updated</h3>
              <p className="text-secondary-900">{new Date(job.updatedAt).toLocaleString()}</p>
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

// Add/Edit Job Modal
function AddEditJobModal({ isOpen, onClose, onSubmit, isLoading, editingJob, categories }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading: boolean
  editingJob?: AdminJobResponse | null
  categories: JobCategory[]
}) {
  const [formData, setFormData] = useState({
    title: editingJob?.title || '',
    description: editingJob?.description || '',
    categoryName: editingJob?.categoryName || '',
    budgetMin: editingJob?.budgetMin || 0,
    budgetMax: editingJob?.budgetMax || 0,
    status: editingJob?.status || 'OPEN',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.categoryName) {
      toast.error('Please fill in all required fields')
      return
    }
    onSubmit(formData)
    setFormData({ title: '', description: '', categoryName: '', budgetMin: 0, budgetMax: 0, status: 'OPEN' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="px-6 py-4 border-b border-secondary-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary-900">{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
          <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Category *</label>
            <select
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Budget Min ($)</label>
              <input
                type="number"
                value={formData.budgetMin}
                onChange={(e) => setFormData({ ...formData, budgetMin: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Budget Max ($)</label>
              <input
                type="number"
                value={formData.budgetMax}
                onChange={(e) => setFormData({ ...formData, budgetMax: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
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
              {isLoading ? 'Saving...' : editingJob ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Jobs() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [editingJob, setEditingJob] = useState<AdminJobResponse | null>(null)
  const [selectedJobDetail, setSelectedJobDetail] = useState<AdminJobResponse | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', page, statusFilter],
    queryFn: () => jobsApi.getAll({ page, size: 10, status: statusFilter || undefined }),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['job-categories'],
    queryFn: () => jobsApi.getCategories(),
  })

  const createJobMutation = useMutation({
    mutationFn: (payload: any) => jobsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job created successfully')
      setShowAddModal(false)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create job')
    },
  })

  const updateJobMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => jobsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job updated successfully')
      setShowAddModal(false)
      setEditingJob(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update job')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: jobsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete job')
    },
  })

  const filteredJobs = data?.content?.filter((job: AdminJobResponse) =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.categoryName?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'OPEN':
        return 'bg-success-100 text-success-800'
      case 'IN_PROGRESS':
        return 'bg-primary-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-success-100 text-success-800'
      case 'CANCELLED':
        return 'bg-error-100 text-error-800'
      default:
        return 'bg-secondary-100 text-secondary-800'
    }
  }

  const handleAddJob = (formData: any) => {
    createJobMutation.mutate(formData)
  }

  const handleEditJob = (job: AdminJobResponse) => {
    setEditingJob(job)
    setShowAddModal(true)
  }

  const handleSaveEdit = (formData: any) => {
    if (editingJob) {
      updateJobMutation.mutate({ id: editingJob.id, payload: formData })
    }
  }

  const handleViewJob = (job: AdminJobResponse) => {
    setSelectedJobDetail(job)
    setShowDetailModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Jobs Management</h1>
          <p className="text-secondary-600 mt-1">Manage job listings and moderation queue</p>
        </div>
        <button
          onClick={() => {
            setEditingJob(null)
            setShowAddModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          Add Job
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-60">
            <input
              type="text"
              placeholder="Search jobs by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(0)
            }}
            className="px-4 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold">Job Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Budget</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Applications</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Posted</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-secondary-500">
                  Loading jobs...
                </td>
              </tr>
            ) : filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-secondary-500">
                  No jobs found
                </td>
              </tr>
            ) : (
              filteredJobs.map((job: AdminJobResponse) => (
                <tr key={job.id} className="border-t border-secondary-200 hover:bg-primary-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-secondary-900">{job.title}</div>
                    <div className="text-sm text-secondary-600">by {job.employerName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-600">{job.categoryName}</td>
                  <td className="px-6 py-4 font-medium text-secondary-900">
                    ${job.budgetMin?.toLocaleString()} - ${job.budgetMax?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-600">{job.applicationsCount}</td>
                  <td className="px-6 py-4 text-sm text-secondary-600">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewJob(job)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditJob(job)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this job?')) {
                            deleteMutation.mutate(job.id)
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
            Page {page + 1} of {data?.totalPages || 1}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={data?.last}
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
            Loading jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-secondary-500">
            No jobs found
          </div>
        ) : (
          filteredJobs.map((job: AdminJobResponse) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm p-4 space-y-3 border-l-4 border-primary-600">
              <div>
                <h3 className="font-semibold text-secondary-900">{job.title}</h3>
                <p className="text-sm text-secondary-600">by {job.employerName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-secondary-600">Category</p>
                  <p className="font-medium text-secondary-900">{job.categoryName}</p>
                </div>
                <div>
                  <p className="text-secondary-600">Budget</p>
                  <p className="font-medium text-secondary-900">
                    ${job.budgetMin?.toLocaleString()} - ${job.budgetMax?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-600">Status</p>
                  <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(job.status)}`}>
                    {job.status}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-600">Applications</p>
                  <p className="font-medium text-secondary-900">{job.applicationsCount}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-secondary-200">
                <button
                  onClick={() => handleViewJob(job)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                >
                  <EyeIcon className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditJob(job)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this job?')) {
                      deleteMutation.mutate(job.id)
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
            disabled={data?.last}
            className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Add/Edit Job Modal */}
      <AddEditJobModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingJob(null)
        }}
        onSubmit={editingJob ? handleSaveEdit : handleAddJob}
        isLoading={createJobMutation.isPending || updateJobMutation.isPending}
        editingJob={editingJob}
        categories={categories}
      />

      {/* Job Detail Modal */}
      <JobDetailModal
        isOpen={showDetailModal}
        job={selectedJobDetail}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedJobDetail(null)
        }}
      />
    </div>
  )
}
