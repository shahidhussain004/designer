import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { disputesApi } from '../lib/api'

interface Dispute {
  id: number
  paymentId: number
  reason: string
  description: string
  status: string
  amount: number
  clientName: string
  freelancerName: string
  jobTitle: string
  createdAt: string
  resolvedAt?: string
  resolution?: string
}

interface ResolutionModalProps {
  isOpen: boolean
  onClose: () => void
  dispute: Dispute | null
  onSubmit: (data: { id: number; resolution: string; refundAmount: number; favorClient: boolean }) => void
  isLoading: boolean
}

function ResolutionModal({ isOpen, onClose, dispute, onSubmit, isLoading }: ResolutionModalProps) {
  const [resolution, setResolution] = useState('')
  const [refundAmount, setRefundAmount] = useState(dispute?.amount || 0)

  if (!isOpen || !dispute) return null

  const handleSubmit = (favorClient: boolean) => {
    onSubmit({
      id: dispute.id,
      resolution,
      refundAmount: favorClient ? refundAmount : 0,
      favorClient,
    })
    setResolution('')
    setRefundAmount(0)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Resolve Dispute - {dispute.jobTitle}</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Dispute Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-medium text-gray-900">{dispute.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Freelancer</p>
              <p className="font-medium text-gray-900">{dispute.freelancerName}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Reason</p>
            <p className="text-gray-900 mt-1">{dispute.reason}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Description</p>
            <p className="text-gray-900 mt-1">{dispute.description}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Disputed Amount</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">${dispute.amount.toLocaleString()}</p>
          </div>

          {/* Resolution Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Notes</label>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount to Client</label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">$</span>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                min={0}
                max={dispute.amount}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Freelancer will receive: ${(dispute.amount - refundAmount).toLocaleString()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm disabled:opacity-50"
            >
              {isLoading ? 'Resolving...' : 'Favor Freelancer'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm disabled:opacity-50"
            >
              {isLoading ? 'Resolving...' : `Favor Client ($${refundAmount})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Disputes() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['disputes', page, statusFilter],
    queryFn: () => disputesApi.getAll({ page, size: 10, status: statusFilter || undefined }),
  })

  const resolveMutation = useMutation({
    mutationFn: ({
      id,
      resolution,
      refundAmount,
      favorClient,
    }: {
      id: number
      resolution: string
      refundAmount: number
      favorClient: boolean
    }) => disputesApi.resolve(id, resolution, refundAmount, favorClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] })
      toast.success('Dispute resolved successfully')
      setSelectedDispute(null)
    },
    onError: () => {
      toast.error('Failed to resolve dispute')
    },
  })

  const escalateMutation = useMutation({
    mutationFn: (id: number) => disputesApi.escalate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] })
      toast.success('Dispute escalated successfully')
    },
    onError: () => {
      toast.error('Failed to escalate dispute')
    },
  })

  const filteredDisputes = data?.content?.filter((dispute: Dispute) =>
    dispute.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
    dispute.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    dispute.freelancerName?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800'
      case 'RESOLVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="w-5 h-5" />
      case 'UNDER_REVIEW':
        return <ExclamationTriangleIcon className="w-5 h-5" />
      case 'RESOLVED':
        return <CheckCircleIcon className="w-5 h-5" />
      default:
        return null
    }
  }

  // Calculate stats
  const stats = {
    pending: filteredDisputes.filter(d => d.status === 'PENDING').length,
    underReview: filteredDisputes.filter(d => d.status === 'UNDER_REVIEW').length,
    resolved: filteredDisputes.filter(d => d.status === 'RESOLVED').length,
    totalAmount: filteredDisputes.reduce((sum, d) => sum + d.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Disputes Management</h1>
        <p className="text-gray-600 mt-1">Handle payment disputes and resolutions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <span className="text-xl font-bold text-indigo-600">$</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Disputed</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-60">
            <input
              type="text"
              placeholder="Search disputes by job title or parties..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(0)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            Loading disputes...
          </div>
        ) : filteredDisputes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            No disputes found
          </div>
        ) : (
          filteredDisputes.map((dispute: Dispute) => (
            <div key={dispute.id} className="bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-1 text-gray-400">
                    {getStatusIcon(dispute.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{dispute.jobTitle}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {dispute.clientName} <span className="text-gray-400">vs</span> {dispute.freelancerName}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{dispute.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">{dispute.description}</p>
                    <p className="text-xs text-gray-400 mt-2">Filed {new Date(dispute.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-xl font-bold text-indigo-600">${dispute.amount.toLocaleString()}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(dispute.status)} mt-2`}>
                    {dispute.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 flex-wrap">
                <button
                  onClick={() => setSelectedDispute(dispute)}
                  className="px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
                {dispute.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => escalateMutation.mutate(dispute.id)}
                      disabled={escalateMutation.isPending}
                      className="px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      Escalate
                    </button>
                    <button
                      onClick={() => setSelectedDispute(dispute)}
                      className="px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredDisputes.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">Page {page + 1}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={data?.last}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* Resolution Modal */}
      <ResolutionModal
        isOpen={selectedDispute !== null && selectedDispute.status === 'PENDING'}
        onClose={() => setSelectedDispute(null)}
        dispute={selectedDispute}
        onSubmit={(data) => {
          resolveMutation.mutate(data)
        }}
        isLoading={resolveMutation.isPending}
      />
    </div>
  )
}



