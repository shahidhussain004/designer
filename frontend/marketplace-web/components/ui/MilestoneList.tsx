'use client'

import {
  Milestone,
  approveMilestone,
  formatCurrency,
  getMilestoneStatusColor,
  requestMilestoneRevision,
  startMilestone,
  submitMilestone
} from '@/lib/payments'
import { useState } from 'react'

interface MilestoneListProps {
  milestones: Milestone[]
  jobId: number
  isCompany: boolean
  isFreelancer: boolean
  onMilestoneUpdated: () => void
}

export default function MilestoneList({ 
  milestones, 
  jobId, 
  isCompany, 
  isFreelancer,
  onMilestoneUpdated 
}: MilestoneListProps) {
  const [loading, setLoading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [revisionModal, setRevisionModal] = useState<{ milestoneId: number; isOpen: boolean }>({ milestoneId: 0, isOpen: false })
  const [revisionReason, setRevisionReason] = useState('')
  const [deliverables, setDeliverables] = useState('')
  const [submitModal, setSubmitModal] = useState<{ milestoneId: number; isOpen: boolean }>({ milestoneId: 0, isOpen: false })

  const handleFundMilestone = async (milestoneId: number) => {
    try {
      setLoading(milestoneId)
      setError(null)
      const milestone = milestones.find(m => m.id === milestoneId)
      if (milestone) {
        window.location.href = `/checkout?type=milestone&id=${milestoneId}&amount=${milestone.amount}&title=${encodeURIComponent(milestone.title)}&returnUrl=${encodeURIComponent(`/jobs/${jobId}/milestones`)}`
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fund milestone')
    } finally {
      setLoading(null)
    }
  }

  const handleStartMilestone = async (milestoneId: number) => {
    try {
      setLoading(milestoneId)
      setError(null)
      await startMilestone(milestoneId)
      onMilestoneUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start milestone')
    } finally {
      setLoading(null)
    }
  }

  const handleSubmitMilestone = async (milestoneId: number) => {
    try {
      setLoading(milestoneId)
      setError(null)
      await submitMilestone(milestoneId, deliverables)
      setSubmitModal({ milestoneId: 0, isOpen: false })
      setDeliverables('')
      onMilestoneUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit milestone')
    } finally {
      setLoading(null)
    }
  }

  const handleApproveMilestone = async (milestoneId: number) => {
    try {
      setLoading(milestoneId)
      setError(null)
      await approveMilestone(milestoneId)
      onMilestoneUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve milestone')
    } finally {
      setLoading(null)
    }
  }

  const handleRequestRevision = async (milestoneId: number) => {
    try {
      setLoading(milestoneId)
      setError(null)
      await requestMilestoneRevision(milestoneId, revisionReason)
      setRevisionModal({ milestoneId: 0, isOpen: false })
      setRevisionReason('')
      onMilestoneUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request revision')
    } finally {
      setLoading(null)
    }
  }

  const getActionButton = (milestone: Milestone) => {
    const isLoading = loading === milestone.id

    switch (milestone.status) {
      case 'PENDING':
        if (isCompany) {
          return (
            <button
              onClick={() => handleFundMilestone(milestone.id)}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Fund Milestone'}
            </button>
          )
        }
        return <span className="text-sm text-secondary-500">Waiting for funding</span>

      case 'FUNDED':
        if (isFreelancer) {
          return (
            <button
              onClick={() => handleStartMilestone(milestone.id)}
              disabled={isLoading}
              className="px-4 py-2 bg-success-600 text-white rounded-lg text-sm font-medium hover:bg-success-700 disabled:opacity-50"
            >
              {isLoading ? 'Starting...' : 'Start Work'}
            </button>
          )
        }
        return <span className="text-sm text-secondary-500">Waiting for freelancer</span>

      case 'IN_PROGRESS':
        if (isFreelancer) {
          return (
            <button
              onClick={() => setSubmitModal({ milestoneId: milestone.id, isOpen: true })}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
            >
              Submit for Review
            </button>
          )
        }
        return <span className="text-sm text-secondary-500">Work in progress</span>

      case 'SUBMITTED':
        if (isCompany) {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleApproveMilestone(milestone.id)}
                disabled={isLoading}
                className="px-4 py-2 bg-success-600 text-white rounded-lg text-sm font-medium hover:bg-success-700 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Approve & Release'}
              </button>
              <button
                onClick={() => setRevisionModal({ milestoneId: milestone.id, isOpen: true })}
                disabled={isLoading}
                className="px-4 py-2 border border-warning-600 text-warning-600 rounded-lg text-sm font-medium hover:bg-warning-50 disabled:opacity-50"
              >
                Request Revision
              </button>
            </div>
          )
        }
        return <span className="text-sm text-secondary-500">Under review</span>

      case 'APPROVED':
        return (
          <span className="flex items-center text-success-600 text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Completed & Paid
          </span>
        )

      case 'REJECTED':
        return <span className="text-sm text-error-600 font-medium">Revision Requested</span>

      case 'CANCELLED':
        return <span className="text-sm text-secondary-500">Cancelled</span>

      default:
        return null
    }
  }

  const getProgressIcon = (milestone: Milestone) => {
    switch (milestone.status) {
      case 'PENDING':
        return (
          <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
            <span className="text-secondary-400">○</span>
          </div>
        )
      case 'FUNDED':
        return (
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600">💰</span>
          </div>
        )
      case 'IN_PROGRESS':
        return (
          <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
            <span className="text-warning-600">⚡</span>
          </div>
        )
      case 'SUBMITTED':
        return (
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700">📝</span>
          </div>
        )
      case 'APPROVED':
        return (
          <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
            <span className="text-success-600">✓</span>
          </div>
        )
      case 'REJECTED':
        return (
          <div className="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center">
            <span className="text-error-600">↻</span>
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
            <span className="text-secondary-400">○</span>
          </div>
        )
    }
  }

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0)
  const completedAmount = milestones
    .filter(m => m.status === 'APPROVED')
    .reduce((sum, m) => sum + m.amount, 0)
  const fundedAmount = milestones
    .filter(m => ['FUNDED', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED'].includes(m.status))
    .reduce((sum, m) => sum + m.amount, 0)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Progress</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-secondary-500">Total Budget</p>
            <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-secondary-500">In Escrow</p>
            <p className="text-xl font-bold text-primary-600">{formatCurrency(fundedAmount - completedAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-secondary-500">Released</p>
            <p className="text-xl font-bold text-success-600">{formatCurrency(completedAmount)}</p>
          </div>
        </div>

        <div className="w-full bg-secondary-200 rounded-full h-3">
          <div
            className="bg-success-500 h-3 rounded-full transition-all duration-500"
          />
        </div>
        <p className="text-sm text-secondary-500 mt-2">
          {milestones.filter(m => m.status === 'APPROVED').length} of {milestones.length} milestones completed
        </p>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Milestones</h3>
        </div>
        
        <div className="divide-y">
          {milestones.sort((a, b) => a.orderIndex - b.orderIndex).map((milestone) => (
            <div key={milestone.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getProgressIcon(milestone)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-secondary-900">{milestone.title}</h4>
                      <p className="text-sm text-secondary-600 mt-1">{milestone.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMilestoneStatusColor(milestone.status)}`}>
                          {milestone.status.replace('_', ' ')}
                        </span>
                        <span className="text-secondary-500">
                          {formatCurrency(milestone.amount)}
                        </span>
                        {milestone.dueDate && (
                          <span className="text-secondary-500">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {getActionButton(milestone)}
                    </div>
                  </div>

                  {milestone.submittedAt && (
                    <p className="text-xs text-secondary-400 mt-2">
                      Submitted: {new Date(milestone.submittedAt).toLocaleString()}
                    </p>
                  )}
                  {milestone.approvedAt && (
                    <p className="text-xs text-secondary-400 mt-1">
                      Approved: {new Date(milestone.approvedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {submitModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Submit Milestone for Review</h3>
            <p className="text-secondary-600 mb-4">
              Describe the work you&apos;ve completed and any deliverables for the company to review.
            </p>
            <textarea
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              className="w-full p-3 border rounded-lg min-h-32"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setSubmitModal({ milestoneId: 0, isOpen: false })
                  setDeliverables('')
                }}
                className="px-4 py-2 border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitMilestone(submitModal.milestoneId)}
                disabled={loading === submitModal.milestoneId}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading === submitModal.milestoneId ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {revisionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Request Revision</h3>
            <p className="text-secondary-600 mb-4">
              Please explain what changes are needed before you can approve this milestone.
            </p>
            <textarea
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              className="w-full p-3 border rounded-lg min-h-32"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setRevisionModal({ milestoneId: 0, isOpen: false })}
                className="px-4 py-2 border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestRevision(revisionModal.milestoneId)}
                disabled={loading === revisionModal.milestoneId}
                className="px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 disabled:opacity-50"
              >
                {loading === revisionModal.milestoneId ? 'Processing...' : 'Request Revision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export type { MilestoneListProps }

