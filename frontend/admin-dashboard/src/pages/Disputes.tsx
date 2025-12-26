import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { disputesApi } from '../lib/api'
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
    <GdsFlex flex-direction="column" gap="l">
      {/* Header */}
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsDiv>
          <GdsText tag="h1" style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>
            Disputes
          </GdsText>
          <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
            Handle payment disputes and resolutions
          </GdsText>
        </GdsDiv>
      </GdsFlex>

      {/* Stats */}
      <GdsGrid columns="1; s{2}; m{4}" gap="m">
        <GdsCard>
          <GdsFlex padding="m" gap="m" align-items="center">
            <GdsDiv
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
            </GdsDiv>
            <GdsDiv>
              <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Pending</GdsText>
              <GdsText style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>{data?.stats?.pending || 0}</GdsText>
            </GdsDiv>
          </GdsFlex>
        </GdsCard>

        <GdsCard>
          <GdsFlex padding="m" gap="m" align-items="center">
            <GdsDiv
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
            </GdsDiv>
            <GdsDiv>
              <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Under Review</GdsText>
              <GdsText style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>{data?.stats?.underReview || 0}</GdsText>
            </GdsDiv>
          </GdsFlex>
        </GdsCard>

        <GdsCard>
          <GdsFlex padding="m" gap="m" align-items="center">
            <GdsDiv
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
            </GdsDiv>
            <GdsDiv>
              <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Resolved</GdsText>
              <GdsText style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>{data?.stats?.resolved || 0}</GdsText>
            </GdsDiv>
          </GdsFlex>
        </GdsCard>

        <GdsCard>
          <GdsFlex padding="m" gap="m" align-items="center">
            <GdsDiv
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
            </GdsDiv>
            <GdsDiv>
              <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Total Disputed</GdsText>
              <GdsText style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>${(data?.stats?.totalAmount || 0).toLocaleString()}</GdsText>
            </GdsDiv>
          </GdsFlex>
        </GdsCard>
      </GdsGrid>

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
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </GdsDiv>
      </GdsFlex>

      {/* Disputes List */}
      <GdsCard>
        {isLoading ? (
          <GdsFlex justify-content="center" align-items="center" padding="3xl">
            <GdsSpinner />
          </GdsFlex>
        ) : filteredDisputes.length === 0 ? (
          <GdsFlex justify-content="center" padding="3xl">
            <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>No disputes found</GdsText>
          </GdsFlex>
        ) : (
          <GdsFlex flex-direction="column">
            {filteredDisputes.map((dispute: Dispute, index: number) => (
              <GdsDiv key={dispute.id}>
                {index > 0 && <GdsDivider />}
                <GdsFlex flex-direction="column" gap="m" padding="l">
                  <GdsFlex justify-content="space-between" align-items="flex-start" flex-wrap="wrap" gap="m">
                    <GdsFlex gap="m" align-items="flex-start">
                      <GdsText style={{ fontSize: '1.5rem' } as any}>{getStatusIcon(dispute.status)}</GdsText>
                      <GdsDiv>
                        <GdsText style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>{dispute.jobTitle}</GdsText>
                        <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                          {dispute.clientName} vs {dispute.freelancerName}
                        </GdsText>
                        <GdsText style={{ fontSize: '0.875rem', marginTop: '0.5rem' } as any}>
                          Reason: {dispute.reason}
                        </GdsText>
                        <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                          {dispute.description}
                        </GdsText>
                      </GdsDiv>
                    </GdsFlex>
                    <GdsDiv style={{ textAlign: 'right' } as any}>
                      <GdsText style={{ fontSize: '1.25rem', fontWeight: 700 } as any}>
                        ${dispute.amount.toLocaleString()}
                      </GdsText>
                      <GdsBadge variant={getStatusBadgeVariant(dispute.status)} style={{ marginTop: '0.5rem' } as any}>
                        {dispute.status.replace('_', ' ')}
                      </GdsBadge>
                      <GdsText style={{ fontSize: '0.75rem', color: 'var(--gds-color-l3-content-tertiary)', marginTop: '0.5rem' } as any}>
                        Filed {new Date(dispute.createdAt).toLocaleDateString()}
                      </GdsText>
                    </GdsDiv>
                  </GdsFlex>
                  <GdsFlex gap="m">
                    <GdsButton
                      size="small"
                      rank="tertiary"
                      onClick={() => {
                        setSelectedDispute(dispute)
                        setRefundAmount(dispute.amount)
                      }}
                    >
                      View Details
                    </GdsButton>
                    {dispute.status === 'PENDING' && (
                      <>
                        <GdsButton
                          size="small"
                          rank="tertiary"
                          onClick={() => escalateMutation.mutate(dispute.id)}
                          style={{ color: 'var(--gds-color-l3-content-notice)' } as any}
                        >
                          Escalate
                        </GdsButton>
                        <GdsButton
                          size="small"
                          rank="tertiary"
                          onClick={() => {
                            setSelectedDispute(dispute)
                            setRefundAmount(dispute.amount)
                          }}
                          style={{ color: 'var(--gds-color-l3-content-positive)' } as any}
                        >
                          Resolve
                        </GdsButton>
                      </>
                    )}
                  </GdsFlex>
                </GdsFlex>
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
          </GdsFlex>
        )}
      </GdsCard>

      {/* Resolution Modal */}
      {selectedDispute && (
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
                  Resolve Dispute - {selectedDispute.jobTitle}
                </GdsText>
              </GdsDiv>

              <GdsDivider />

              {/* Modal Content */}
              <GdsGrid columns="1; m{2}" gap="m">
                <GdsDiv>
                  <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Client</GdsText>
                  <GdsText style={{ marginTop: '0.25rem' } as any}>{selectedDispute.clientName}</GdsText>
                </GdsDiv>
                <GdsDiv>
                  <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Freelancer</GdsText>
                  <GdsText style={{ marginTop: '0.25rem' } as any}>{selectedDispute.freelancerName}</GdsText>
                </GdsDiv>
              </GdsGrid>

              <GdsDiv>
                <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Dispute Reason</GdsText>
                <GdsText style={{ marginTop: '0.25rem' } as any}>{selectedDispute.reason}</GdsText>
              </GdsDiv>

              <GdsDiv>
                <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Description</GdsText>
                <GdsText style={{ marginTop: '0.25rem' } as any}>{selectedDispute.description}</GdsText>
              </GdsDiv>

              <GdsDiv>
                <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Disputed Amount</GdsText>
                <GdsText style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.25rem' } as any}>
                  ${selectedDispute.amount.toLocaleString()}
                </GdsText>
              </GdsDiv>

              <GdsDivider />

              <GdsDiv>
                <GdsText style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' } as any}>
                  Resolution Notes
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
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                />
              </GdsDiv>

              <GdsDiv>
                <GdsText style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' } as any}>
                  Refund Amount (to client)
                </GdsText>
                <GdsFlex align-items="center" gap="s">
                  <GdsText>$</GdsText>
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
                </GdsFlex>
                <GdsText style={{ fontSize: '0.75rem', color: 'var(--gds-color-l3-content-tertiary)', marginTop: '0.25rem' } as any}>
                  Remaining ${(selectedDispute.amount - refundAmount).toLocaleString()} goes to freelancer
                </GdsText>
              </GdsDiv>

              <GdsDivider />

              {/* Modal Footer */}
              <GdsFlex justify-content="flex-end" gap="m" flex-wrap="wrap">
                <GdsButton
                  rank="secondary"
                  onClick={() => {
                    setSelectedDispute(null)
                    setResolution('')
                    setRefundAmount(0)
                  }}
                >
                  Cancel
                </GdsButton>
                <GdsButton
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
                </GdsButton>
                <GdsButton
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
                </GdsButton>
              </GdsFlex>
            </GdsFlex>
          </GdsCard>
        </GdsDiv>
      )}
    </GdsFlex>
  )
}



