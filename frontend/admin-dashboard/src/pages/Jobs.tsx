import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '../lib/api'
import toast from 'react-hot-toast'
import {
  GdsCard,
  GdsFlex,
  GdsGrid,
  GdsText,
  GdsButton,
  GdsInput,
  GdsDiv,
  GdsDivider,
  GdsBadge,
  GdsSpinner,
} from '../components/green'

interface Job {
  id: number
  title: string
  description: string
  category: string
  budget: number
  budgetType: string
  status: string
  clientName: string
  proposalCount: number
  createdAt: string
}

export default function Jobs() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('OPEN')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', page, statusFilter],
    queryFn: () => jobsApi.getAll({ page, size: 10, status: statusFilter }),
  })

  const { data: pendingJobs } = useQuery({
    queryKey: ['pending-jobs'],
    queryFn: jobsApi.getPending,
  })

  const approveMutation = useMutation({
    mutationFn: jobsApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['pending-jobs'] })
      toast.success('Job approved')
      setSelectedJob(null)
    },
    onError: () => {
      toast.error('Failed to approve job')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      jobsApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['pending-jobs'] })
      toast.success('Job rejected')
      setSelectedJob(null)
      setRejectReason('')
    },
    onError: () => {
      toast.error('Failed to reject job')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: jobsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deleted')
    },
    onError: () => {
      toast.error('Failed to delete job')
    },
  })

  const filteredJobs = data?.content?.filter((job: Job) =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.category?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const getStatusBadgeVariant = (status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'OPEN':
        return 'success'
      case 'IN_PROGRESS':
        return 'primary'
      case 'COMPLETED':
        return 'success'
      case 'CANCELLED':
        return 'danger'
      case 'DRAFT':
        return 'warning'
      default:
        return 'primary'
    }
  }

  return (
    <GdsFlex flex-direction="column" gap="l">
      {/* Header */}
      <GdsFlex justify-content="space-between" align-items="center" flex-wrap="wrap" gap="m">
        <GdsDiv>
          <GdsText tag="h1" style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>
            Jobs
          </GdsText>
          <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
            Manage job listings and moderation queue
          </GdsText>
        </GdsDiv>
        {pendingJobs?.length > 0 && (
          <GdsBadge variant="warning">{pendingJobs.length} pending review</GdsBadge>
        )}
      </GdsFlex>

      {/* Pending Jobs Queue */}
      {pendingJobs?.length > 0 && (
        <GdsCard style={{ background: 'var(--gds-color-l3-background-notice-dim)', border: '1px solid var(--gds-color-l3-border-notice)' } as any}>
          <GdsFlex flex-direction="column" gap="m" padding="m">
            <GdsText style={{ fontWeight: 600, color: 'var(--gds-color-l3-content-notice)' } as any}>
              Moderation Queue
            </GdsText>
            {pendingJobs.slice(0, 3).map((job: Job) => (
              <GdsCard key={job.id}>
                <GdsFlex justify-content="space-between" align-items="center" padding="m">
                  <GdsDiv>
                    <GdsText style={{ fontWeight: 500 } as any}>{job.title}</GdsText>
                    <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                      by {job.clientName} • ${job.budget} {job.budgetType}
                    </GdsText>
                  </GdsDiv>
                  <GdsFlex gap="s">
                    <GdsButton size="small" rank="tertiary" onClick={() => setSelectedJob(job)}>
                      👁️ View
                    </GdsButton>
                    <GdsButton size="small" rank="secondary" onClick={() => approveMutation.mutate(job.id)} style={{ color: 'var(--gds-color-l3-content-positive)' } as any}>
                      ✓ Approve
                    </GdsButton>
                    <GdsButton size="small" rank="secondary" onClick={() => setSelectedJob(job)} style={{ color: 'var(--gds-color-l3-content-negative)' } as any}>
                      ✗ Reject
                    </GdsButton>
                  </GdsFlex>
                </GdsFlex>
              </GdsCard>
            ))}
          </GdsFlex>
        </GdsCard>
      )}

      {/* Filters */}
      <GdsFlex gap="m" flex-wrap="wrap">
        <GdsDiv style={{ flex: 1, minWidth: '200px' } as any}>
          <GdsInput
            label=""
            value={search}
            onInput={(e: React.FormEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
          />
        </GdsDiv>
        <GdsDiv>
          <select
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--gds-color-l3-border-primary)',
              borderRadius: '4px',
              background: 'var(--gds-color-l3-background-secondary)',
              color: 'var(--gds-color-l3-content-primary)',
              minHeight: '42px',
            } as any}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="DRAFT">Draft</option>
          </select>
        </GdsDiv>
      </GdsFlex>

      {/* Jobs Table */}
      <GdsCard>
        {isLoading ? (
          <GdsFlex justify-content="center" align-items="center" padding="3xl">
            <GdsSpinner />
          </GdsFlex>
        ) : (
          <>
            {/* Table Header */}
            <GdsGrid columns="2fr 1fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" style={{ background: 'var(--gds-color-l3-background-secondary)', borderRadius: '8px 8px 0 0' } as any}>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Job</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Category</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Budget</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Status</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Proposals</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Posted</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)', textAlign: 'right' } as any}>Actions</GdsText>
            </GdsGrid>

            {/* Table Body */}
            {filteredJobs.map((job: Job) => (
              <GdsDiv key={job.id}>
                <GdsDivider />
                <GdsGrid columns="2fr 1fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center">
                  {/* Job Info */}
                  <GdsDiv>
                    <GdsText style={{ fontWeight: 500 } as any}>{job.title}</GdsText>
                    <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                      by {job.clientName}
                    </GdsText>
                  </GdsDiv>

                  {/* Category */}
                  <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)', fontSize: '0.875rem' } as any}>
                    {job.category}
                  </GdsText>

                  {/* Budget */}
                  <GdsText style={{ fontWeight: 500 } as any}>
                    ${job.budget?.toLocaleString()} {job.budgetType}
                  </GdsText>

                  {/* Status */}
                  <GdsDiv>
                    <GdsBadge variant={getStatusBadgeVariant(job.status)}>{job.status}</GdsBadge>
                  </GdsDiv>

                  {/* Proposals */}
                  <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                    {job.proposalCount}
                  </GdsText>

                  {/* Posted */}
                  <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)', fontSize: '0.875rem' } as any}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </GdsText>

                  {/* Actions */}
                  <GdsFlex gap="s" justify-content="flex-end">
                    <GdsButton size="small" rank="tertiary" onClick={() => setSelectedJob(job)}>
                      View
                    </GdsButton>
                    <GdsButton
                      size="small"
                      rank="secondary"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this job?')) {
                          deleteMutation.mutate(job.id)
                        }
                      }}
                      style={{ color: 'var(--gds-color-l3-content-negative)' } as any}
                    >
                      Delete
                    </GdsButton>
                  </GdsFlex>
                </GdsGrid>
              </GdsDiv>
            ))}

            {/* Pagination */}
            <GdsDivider />
            <GdsFlex justify-content="space-between" align-items="center" padding="m">
              <GdsButton
                rank="secondary"
                size="small"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </GdsButton>
              <GdsButton
                rank="secondary"
                size="small"
                onClick={() => setPage(page + 1)}
                disabled={!data?.hasNext}
              >
                Next
              </GdsButton>
            </GdsFlex>
          </>
        )}
      </GdsCard>

      {/* Job Detail Modal */}
      {selectedJob && (
        <GdsDiv
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
          } as any}
        >
          <GdsCard style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh', overflow: 'auto' } as any}>
            <GdsFlex flex-direction="column" gap="l" padding="l">
              {/* Modal Header */}
              <GdsDiv>
                <GdsText tag="h2" style={{ fontSize: '1.25rem', fontWeight: 600 } as any}>
                  {selectedJob.title}
                </GdsText>
              </GdsDiv>

              <GdsDivider />

              {/* Modal Content */}
              <GdsDiv>
                <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Description</GdsText>
                <GdsText style={{ marginTop: '0.25rem' } as any}>{selectedJob.description}</GdsText>
              </GdsDiv>

              <GdsGrid columns="1; m{2}" gap="m">
                <GdsDiv>
                  <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Client</GdsText>
                  <GdsText style={{ marginTop: '0.25rem' } as any}>{selectedJob.clientName}</GdsText>
                </GdsDiv>
                <GdsDiv>
                  <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Category</GdsText>
                  <GdsText style={{ marginTop: '0.25rem' } as any}>{selectedJob.category}</GdsText>
                </GdsDiv>
                <GdsDiv>
                  <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Budget</GdsText>
                  <GdsText style={{ marginTop: '0.25rem' } as any}>${selectedJob.budget} {selectedJob.budgetType}</GdsText>
                </GdsDiv>
                <GdsDiv>
                  <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Status</GdsText>
                  <GdsBadge variant={getStatusBadgeVariant(selectedJob.status)} style={{ marginTop: '0.25rem' } as any}>
                    {selectedJob.status}
                  </GdsBadge>
                </GdsDiv>
              </GdsGrid>

              {selectedJob.status === 'DRAFT' && (
                <GdsDiv>
                  <GdsText style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' } as any}>
                    Rejection Reason (if rejecting)
                  </GdsText>
                  <textarea
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gds-color-l3-border-primary)',
                      borderRadius: '4px',
                      minHeight: '80px',
                      background: 'var(--gds-color-l3-background-secondary)',
                      color: 'var(--gds-color-l3-content-primary)',
                    } as any}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </GdsDiv>
              )}

              <GdsDivider />

              {/* Modal Footer */}
              <GdsFlex justify-content="flex-end" gap="m">
                <GdsButton
                  rank="secondary"
                  onClick={() => {
                    setSelectedJob(null)
                    setRejectReason('')
                  }}
                >
                  Close
                </GdsButton>
                {selectedJob.status === 'DRAFT' && (
                  <>
                    <GdsButton
                      rank="secondary"
                      onClick={() =>
                        rejectMutation.mutate({
                          id: selectedJob.id,
                          reason: rejectReason,
                        })
                      }
                      style={{ background: 'var(--gds-color-l3-background-negative)', color: 'white' } as any}
                    >
                      Reject
                    </GdsButton>
                    <GdsButton
                      rank="primary"
                      onClick={() => approveMutation.mutate(selectedJob.id)}
                      style={{ background: 'var(--gds-color-l3-background-positive)' } as any}
                    >
                      Approve
                    </GdsButton>
                  </>
                )}
              </GdsFlex>
            </GdsFlex>
          </GdsCard>
        </GdsDiv>
      )}
    </GdsFlex>
  )
}



