import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../lib/api'
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

interface User {
  id: number
  email: string
  username: string
  fullName: string
  role: string
  isActive: boolean
  createdAt: string
  ratingAvg: number
}

export default function Users() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, roleFilter],
    queryFn: () => usersApi.getAll({ page, size: 10, role: roleFilter }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      usersApi.updateStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User status updated')
    },
    onError: () => {
      toast.error('Failed to update user status')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted')
    },
    onError: () => {
      toast.error('Failed to delete user')
    },
  })

  const filteredUsers = data?.content?.filter((user: User) =>
    user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.username?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const getRoleBadgeVariant = (role: string): 'positive' | 'notice' | 'information' | 'information' => {
    switch (role) {
      case 'ADMIN':
        return 'notice'
      case 'CLIENT':
        return 'information'
      case 'FREELANCER':
        return 'positive'
      default:
        return 'information'
    }
  }

  return (
    <GdsFlex flex-direction="column" gap="l">
      {/* Header */}
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsDiv>
          <GdsText tag="h1" style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>
            Users
          </GdsText>
          <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
            Manage platform users
          </GdsText>
        </GdsDiv>
      </GdsFlex>

      {/* Filters */}
      <GdsFlex gap="m" flex-wrap="wrap">
        <GdsDiv style={{ flex: 1, minWidth: '200px' } as any}>
          <GdsInput
            label=""
            value={search}
            onInput={(e: Event) => setSearch((e.target as HTMLInputElement).value)}
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="CLIENT">Clients</option>
            <option value="FREELANCER">Freelancers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </GdsDiv>
      </GdsFlex>

      {/* Users Table */}
      <GdsCard>
        {isLoading ? (
          <GdsFlex justify-content="center" align-items="center" padding="3xl">
            <GdsSpinner />
          </GdsFlex>
        ) : (
          <>
            {/* Table Header */}
            <GdsGrid columns="2fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" style={{ background: 'var(--gds-color-l3-background-secondary)', borderRadius: '8px 8px 0 0' } as any}>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>User</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Role</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Status</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Rating</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Joined</GdsText>
              <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)', textAlign: 'right' } as any}>Actions</GdsText>
            </GdsGrid>

            {/* Table Body */}
            {filteredUsers.map((user: User) => (
              <GdsDiv key={user.id}>
                <GdsDivider />
                <GdsGrid columns="2fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center" style={{ cursor: 'pointer' } as any}>
                  {/* User Info */}
                  <GdsFlex gap="m" align-items="center">
                    <GdsDiv
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--gds-color-l3-background-positive)',
                        color: 'var(--gds-color-l3-content-positive)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                      } as any}
                    >
                      {user.fullName?.charAt(0) || 'U'}
                    </GdsDiv>
                    <GdsDiv>
                      <GdsText style={{ fontWeight: 500 } as any}>{user.fullName}</GdsText>
                      <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                        {user.email}
                      </GdsText>
                    </GdsDiv>
                  </GdsFlex>

                  {/* Role */}
                  <GdsDiv>
                    <GdsBadge variant={getRoleBadgeVariant(user.role)}>{user.role}</GdsBadge>
                  </GdsDiv>

                  {/* Status */}
                  <GdsDiv>
                    <GdsBadge variant={user.isActive ? 'positive' : 'negative'}>
                      {user.isActive ? '✓ Active' : '✗ Inactive'}
                    </GdsBadge>
                  </GdsDiv>

                  {/* Rating */}
                  <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                    {user.ratingAvg?.toFixed(1) || 'N/A'}
                  </GdsText>

                  {/* Joined */}
                  <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)', fontSize: '0.875rem' } as any}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </GdsText>

                  {/* Actions */}
                  <GdsFlex gap="s" justify-content="flex-end">
                    <GdsButton
                      size="small"
                      rank="secondary"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: user.id,
                          isActive: !user.isActive,
                        })
                      }
                    >
                      {user.isActive ? 'Suspend' : 'Activate'}
                    </GdsButton>
                    <GdsButton
                      size="small"
                      rank="secondary"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this user?')) {
                          deleteMutation.mutate(user.id)
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
              <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)', fontSize: '0.875rem' } as any}>
                Showing page {page + 1} of {data?.totalPages || 1}
              </GdsText>
              <GdsFlex gap="s">
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
          </>
        )}
      </GdsCard>

      {/* Responsive Table Styles */}
      <style>{`
        @media (max-width: 768px) {
          gds-grid[columns="2fr 1fr 1fr 1fr 1fr 1fr"] {
            display: flex !important;
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </GdsFlex>
  )
}



