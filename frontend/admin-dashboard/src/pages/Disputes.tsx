import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { disputesApi } from '../lib/api'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

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

export default function Disputes() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('PENDING')
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [resolution, setResolution] = useState('')
  const [refundAmount, setRefundAmount] = useState<number>(0)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['disputes', page, statusFilter],
    queryFn: () => disputesApi.getAll({ page, size: 10, status: statusFilter }),
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
      toast.success('Dispute resolved')
      setSelectedDispute(null)
      setResolution('')
      setRefundAmount(0)
    },
    onError: () => {
      toast.error('Failed to resolve dispute')
    },
  })

  const escalateMutation = useMutation({
    mutationFn: (id: number) => disputesApi.escalate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] })
      toast.success('Dispute escalated')
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'UNDER_REVIEW':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
      case 'RESOLVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'REJECTED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'UNDER_REVIEW':
        return 'bg-orange-100 text-orange-800'
      case 'RESOLVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disputes</h1>
          <p className="text-gray-500">Handle payment disputes and resolutions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-semibold text-gray-900">
                {data?.stats?.pending || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Under Review</p>
              <p className="text-xl font-semibold text-gray-900">
                {data?.stats?.underReview || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-xl font-semibold text-gray-900">
                {data?.stats?.resolved || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 flex items-center justify-center bg-primary-100 rounded-full">
              <span className="text-primary-600 font-bold">$</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total Disputed</p>
              <p className="text-xl font-semibold text-gray-900">
                ${(data?.stats?.totalAmount || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search disputes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Disputes List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDisputes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No disputes found
              </div>
            ) : (
              filteredDisputes.map((dispute: Dispute) => (
                <div key={dispute.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getStatusIcon(dispute.status)}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {dispute.jobTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {dispute.clientName} vs {dispute.freelancerName}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Reason: {dispute.reason}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {dispute.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${dispute.amount.toLocaleString()}
                      </p>
                      <span
                        className={clsx(
                          'mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(dispute.status)
                        )}
                      >
                        {dispute.status.replace('_', ' ')}
                      </span>
                      <p className="mt-2 text-xs text-gray-500">
                        Filed {new Date(dispute.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedDispute(dispute)
                        setRefundAmount(dispute.amount)
                      }}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      View Details
                    </button>
                    {dispute.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => escalateMutation.mutate(dispute.id)}
                          className="text-sm text-orange-600 hover:text-orange-800"
                        >
                          Escalate
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDispute(dispute)
                            setRefundAmount(dispute.amount)
                          }}
                          className="text-sm text-green-600 hover:text-green-800"
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
        )}

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!data?.hasNext}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Resolution Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Resolve Dispute - {selectedDispute.jobTitle}
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Client
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedDispute.clientName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Freelancer
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedDispute.freelancerName}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Dispute Reason
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedDispute.reason}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedDispute.description}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Disputed Amount
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  ${selectedDispute.amount.toLocaleString()}
                </p>
              </div>

              <hr />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution Notes
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Enter resolution details..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Amount (to client)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    min={0}
                    max={selectedDispute.amount}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Remaining ${(selectedDispute.amount - refundAmount).toLocaleString()} goes to freelancer
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedDispute(null)
                  setResolution('')
                  setRefundAmount(0)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  resolveMutation.mutate({
                    id: selectedDispute.id,
                    resolution,
                    refundAmount: 0,
                    favorClient: false,
                  })
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                Favor Freelancer
              </button>
              <button
                onClick={() =>
                  resolveMutation.mutate({
                    id: selectedDispute.id,
                    resolution,
                    refundAmount,
                    favorClient: true,
                  })
                }
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Favor Client (Refund ${refundAmount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
