import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { disputesApi } from '../lib/api'
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

  const getStatusBadgeVariant = (status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'UNDER_REVIEW':
        return 'primary'
      case 'RESOLVED':
        return 'success'
      case 'REJECTED':
        return 'danger'
      default:
        return 'primary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '⏳'
      case 'UNDER_REVIEW':
        return '⚠️'
      case 'RESOLVED':
        return '✓'
      case 'REJECTED':
        return '✗'
      default:
        return '○'
    }
  }

  return (
    <Flex flex-direction="column" gap="l">
      {/* Header */}
      <Flex justify-content="space-between" align-items="center">
        <div>
          <Text tag="h1" style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>
            Disputes
          </Text>
          <Text style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
            Handle payment disputes and resolutions
          </Text>
        </div>
      </Flex>

      {/* Stats */}
      <Grid columns="1; s{2}; m{4}" gap="m">
        <Card>
          <Flex padding="m" gap="m" align-items="center">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--gds-color-l3-background-notice-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              } as any}
            >
              ⏳
            </div>
            <div>
              <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Pending</Text>
              <Text style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>{data?.stats?.pending || 0}</Text>
            </div>
          </Flex>
        </Card>

        <Card>
          <Flex padding="m" gap="m" align-items="center">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--gds-color-l3-background-information-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              } as any}
            >
              ⚠️
            </div>
            <div>
              <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Under Review</Text>
              <Text style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>{data?.stats?.underReview || 0}</Text>
            </div>
          </Flex>
        </Card>

        <Card>
          <Flex padding="m" gap="m" align-items="center">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--gds-color-l3-background-positive-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              } as any}
            >
              ✓
            </div>
            <div>
              <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Resolved</Text>
              <Text style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>{data?.stats?.resolved || 0}</Text>
            </div>
          </Flex>
        </Card>

        <Card>
          <Flex padding="m" gap="m" align-items="center">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--gds-color-l3-background-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--gds-color-l3-content-positive)',
              } as any}
            >
              $
            </div>
            <div>
              <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Total Disputed</Text>
              <Text style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>${(data?.stats?.totalAmount || 0).toLocaleString()}</Text>
            </div>
          </Flex>
        </Card>
      </Grid>

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
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </Flex>

      {/* Disputes List */}
      <Card>
        {isLoading ? (
          <Flex justify-content="center" align-items="center" padding="3xl">
            <Spinner />
          </Flex>
        ) : filteredDisputes.length === 0 ? (
          <Flex justify-content="center" padding="3xl">
            <Text style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>No disputes found</Text>
          </Flex>
        ) : (
          <Flex flex-direction="column">
            {filteredDisputes.map((dispute: Dispute, index: number) => (
              <div key={dispute.id}>
                {index > 0 && <Divider />}
                <Flex flex-direction="column" gap="m" padding="l">
                  <Flex justify-content="space-between" align-items="flex-start" flex-wrap="wrap" gap="m">
                    <Flex gap="m" align-items="flex-start">
                      <Text style={{ fontSize: '1.5rem' } as any}>{getStatusIcon(dispute.status)}</Text>
                      <div>
                        <Text style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>{dispute.jobTitle}</Text>
                        <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                          {dispute.clientName} vs {dispute.freelancerName}
                        </Text>
                        <Text style={{ fontSize: '0.875rem', marginTop: '0.5rem' } as any}>
                          Reason: {dispute.reason}
                        </Text>
                        <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                          {dispute.description}
                        </Text>
                      </div>
                    </Flex>
                    <div style={{ textAlign: 'right' } as any}>
                      <Text style={{ fontSize: '1.25rem', fontWeight: 700 } as any}>
                        ${dispute.amount.toLocaleString()}
                      </Text>
                      <Badge variant={getStatusBadgeVariant(dispute.status)} style={{ marginTop: '0.5rem' } as any}>
                        {dispute.status.replace('_', ' ')}
                      </Badge>
                      <Text style={{ fontSize: '0.75rem', color: 'var(--gds-color-l3-content-tertiary)', marginTop: '0.5rem' } as any}>
                        Filed {new Date(dispute.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                  </Flex>
                  <Flex gap="m">
                    <Button
                      size="small"
                      rank="tertiary"
                      onClick={() => {
                        setSelectedDispute(dispute)
                        setRefundAmount(dispute.amount)
                      }}
                    >
                      View Details
                    </Button>
                    {dispute.status === 'PENDING' && (
                      <>
                        <Button
                          size="small"
                          rank="tertiary"
                          onClick={() => escalateMutation.mutate(dispute.id)}
                          style={{ color: 'var(--gds-color-l3-content-notice)' } as any}
                        >
                          Escalate
                        </Button>
                        <Button
                          size="small"
                          rank="tertiary"
                          onClick={() => {
                            setSelectedDispute(dispute)
                            setRefundAmount(dispute.amount)
                          }}
                          style={{ color: 'var(--gds-color-l3-content-positive)' } as any}
                        >
                          Resolve
                        </Button>
                      </>
                    )}
                  </Flex>
                </Flex>
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
          </Flex>
        )}
      </Card>

      {/* Resolution Modal */}
      {selectedDispute && (
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
                  Resolve Dispute - {selectedDispute.jobTitle}
                </Text>
              </div>

              <Divider />

              {/* Modal Content */}
              <Grid columns="1; m{2}" gap="m">
                <div>
                  <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Client</Text>
                  <Text style={{ marginTop: '0.25rem' } as any}>{selectedDispute.clientName}</Text>
                </div>
                <div>
                  <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Freelancer</Text>
                  <Text style={{ marginTop: '0.25rem' } as any}>{selectedDispute.freelancerName}</Text>
                </div>
              </Grid>

              <div>
                <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Dispute Reason</Text>
                <Text style={{ marginTop: '0.25rem' } as any}>{selectedDispute.reason}</Text>
              </div>

              <div>
                <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Description</Text>
                <Text style={{ marginTop: '0.25rem' } as any}>{selectedDispute.description}</Text>
              </div>

              <div>
                <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Disputed Amount</Text>
                <Text style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.25rem' } as any}>
                  ${selectedDispute.amount.toLocaleString()}
                </Text>
              </div>

              <Divider />

              <div>
                <Text style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' } as any}>
                  Resolution Notes
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
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                />
              </div>

              <div>
                <Text style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' } as any}>
                  Refund Amount (to client)
                </Text>
                <Flex align-items="center" gap="s">
                  <Text>$</Text>
                  <input
                    type="number"
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      border: '1px solid var(--gds-color-l3-border-primary)',
                      borderRadius: '4px',
                      background: 'var(--gds-color-l3-background-secondary)',
                      color: 'var(--gds-color-l3-content-primary)',
                    } as any}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    min={0}
                    max={selectedDispute.amount}
                  />
                </Flex>
                <Text style={{ fontSize: '0.75rem', color: 'var(--gds-color-l3-content-tertiary)', marginTop: '0.25rem' } as any}>
                  Remaining ${(selectedDispute.amount - refundAmount).toLocaleString()} goes to freelancer
                </Text>
              </div>

              <Divider />

              {/* Modal Footer */}
              <Flex justify-content="flex-end" gap="m" flex-wrap="wrap">
                <Button
                  rank="secondary"
                  onClick={() => {
                    setSelectedDispute(null)
                    setResolution('')
                    setRefundAmount(0)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  rank="secondary"
                  onClick={() =>
                    resolveMutation.mutate({
                      id: selectedDispute.id,
                      resolution,
                      refundAmount: 0,
                      favorClient: false,
                    })
                  }
                  style={{ background: 'var(--gds-color-l3-background-positive)' } as any}
                >
                  Favor Freelancer
                </Button>
                <Button
                  rank="primary"
                  onClick={() =>
                    resolveMutation.mutate({
                      id: selectedDispute.id,
                      resolution,
                      refundAmount,
                      favorClient: true,
                    })
                  }
                >
                  Favor Client (Refund ${refundAmount})
                </Button>
              </Flex>
            </Flex>
          </Card>
        </div>
      )}
    </Flex>
  )
}



