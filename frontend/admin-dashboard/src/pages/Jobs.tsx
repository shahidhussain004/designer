import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '../lib/api'
import toast from 'react-hot-toast'
import {
  Card,
  Flex,
  Grid,
  Text,
  Button,
  Input,
  Divider,
  Badge,
  Spinner,
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
    <Flex flex-direction="column" gap="l">
      {/* Header */}
      <Flex justify-content="space-between" align-items="center" flex-wrap="wrap" gap="m">
        <div>
          <Text tag="h1">Jobs</Text>
          <Text>Manage job listings and moderation queue</Text>
        </div>
        {pendingJobs?.length > 0 && (
          <Badge variant="warning">{pendingJobs.length} pending review</Badge>
        )}
      </Flex>

      {/* Pending Jobs Queue */}
      {pendingJobs?.length > 0 && (
        <Card>
          <Flex flex-direction="column" gap="m" padding="m">
            <Text>Moderation Queue</Text>
            {pendingJobs.slice(0, 3).map((job: Job) => (
              <Card key={job.id}>
                <Flex justify-content="space-between" align-items="center" padding="m">
                  <div>
                    <Text style={{ fontWeight: 500 } as any}>{job.title}</Text>
                    <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                      by {job.clientName} • ${job.budget} {job.budgetType}
                    </Text>
                  </div>
                  <Flex gap="s">
                    <Button size="small" rank="tertiary" onClick={() => setSelectedJob(job)}>
                      👁️ View
                    </Button>
                    <Button size="small" rank="secondary" onClick={() => approveMutation.mutate(job.id)}>
                      ✓ Approve
                    </Button>
                    <Button size="small" rank="secondary" onClick={() => setSelectedJob(job)}>
                      ✗ Reject
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Card>
      )}

      {/* Filters */}
      <Flex gap="m" flex-wrap="wrap">
        <div style={{ flex: 1, minWidth: '200px' } as any}>
          <Input
            label=""
            value={search}
            onInput={(e: React.FormEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
          />
        </div>
        <div>
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
        </div>
      </Flex>

      {/* Jobs Table */}
      <Card>
        {isLoading ? (
          <Flex justify-content="center" align-items="center" padding="3xl">
            <Spinner />
          </Flex>
        ) : (
          <>
            {/* Table Header */}
            <Grid columns="2fr 1fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m">
              <Text>Job</Text>
              <Text>Category</Text>
              <Text>Budget</Text>
              <Text>Status</Text>
              <Text>Proposals</Text>
              <Text>Posted</Text>
              <Text>Actions</Text>
            </Grid>

            {/* Table Body */}
            {filteredJobs.map((job: Job) => (
              <div key={job.id}>
                <Divider />
                <Grid columns="2fr 1fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center">
                  {/* Job Info */}
                  <div>
                    <Text font-weight="500">{job.title}</Text>
                    <Text>by {job.clientName}</Text>
                  </div>

                  {/* Category */}
                  <Text>{job.category}</Text>

                  {/* Budget */}
                  <Text font-weight="500">${job.budget?.toLocaleString()} {job.budgetType}</Text>

                  {/* Status */}
                  <div>
                    <Badge variant={getStatusBadgeVariant(job.status)}>{job.status}</Badge>
                  </div>

                  {/* Proposals */}
                  <Text>{job.proposalCount}</Text>

                  {/* Posted */}
                  <Text>{new Date(job.createdAt).toLocaleDateString()}</Text>

                  {/* Actions */}
                  <Flex gap="s" justify-content="flex-end">
                    <Button size="small" rank="tertiary" onClick={() => setSelectedJob(job)}>
                      View
                    </Button>
                    <Button
                      size="small"
                      rank="secondary"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this job?')) {
                          deleteMutation.mutate(job.id)
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Grid>
              </div>
            ))}

            {/* Pagination */}
            <Divider />
            <Flex justify-content="space-between" align-items="center" padding="m">
              <Button
                rank="secondary"
                size="small"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                rank="secondary"
                size="small"
                onClick={() => setPage(page + 1)}
                disabled={!data?.hasNext}
              >
                Next
              </Button>
            </Flex>
          </>
        )}
      </Card>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
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
          <Card style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh', overflow: 'auto' } as any}>
            <Flex flex-direction="column" gap="l" padding="l">
              {/* Modal Header */}
              <div>
                <Text tag="h2" style={{ fontSize: '1.25rem', fontWeight: 600 } as any}>
                  {selectedJob.title}
                </Text>
              </div>

              <Divider />

              {/* Modal Content */}
              <div>
                <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Description</Text>
                <Text style={{ marginTop: '0.25rem' } as any}>{selectedJob.description}</Text>
              </div>

              <Grid columns="1; m{2}" gap="m">
                <div>
                  <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Client</Text>
                  <Text style={{ marginTop: '0.25rem' } as any}>{selectedJob.clientName}</Text>
                </div>
                <div>
                  <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Category</Text>
                  <Text style={{ marginTop: '0.25rem' } as any}>{selectedJob.category}</Text>
                </div>
                <div>
                  <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Budget</Text>
                  <Text style={{ marginTop: '0.25rem' } as any}>${selectedJob.budget} {selectedJob.budgetType}</Text>
                </div>
                <div>
                  <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Status</Text>
                  <Badge variant={getStatusBadgeVariant(selectedJob.status)} style={{ marginTop: '0.25rem' } as any}>
                    {selectedJob.status}
                  </Badge>
                </div>
              </Grid>

              {selectedJob.status === 'DRAFT' && (
                <div>
                  <Text style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' } as any}>
                    Rejection Reason (if rejecting)
                  </Text>
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
                </div>
              )}

              <Divider />

              {/* Modal Footer */}
              <Flex justify-content="flex-end" gap="m">
                <Button
                  rank="secondary"
                  onClick={() => {
                    setSelectedJob(null)
                    setRejectReason('')
                  }}
                >
                  Close
                </Button>
                {selectedJob.status === 'DRAFT' && (
                  <>
                    <Button
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
                    </Button>
                    <Button
                      rank="primary"
                      onClick={() => approveMutation.mutate(selectedJob.id)}
                      style={{ background: 'var(--gds-color-l3-background-positive)' } as any}
                    >
                      Approve
                    </Button>
                  </>
                )}
              </Flex>
            </Flex>
          </Card>
        </div>
      )}
    </Flex>
  )
}



