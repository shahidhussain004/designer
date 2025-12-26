import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../lib/api'
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

  const getRoleBadgeVariant = (role: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
    switch (role) {
      case 'ADMIN':
        return 'warning'
      case 'CLIENT':
        return 'primary'
      case 'FREELANCER':
        return 'success'
      default:
        return 'primary'
    }
  }

  return (
    <Flex flex-direction="column" gap="l">
      {/* Header */}
      <Flex justify-content="space-between" align-items="center">
        <div>
          <Text tag="h1">
            Users
          </Text>
          <Text>
            Manage platform users
          </Text>
        </div>
      </Flex>

      {/* Filters */}
      <Flex gap="m" flex-wrap="wrap">
        <div>
          <Input
            label=""
            value={search}
            onInput={(e: React.FormEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
          />
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="CLIENT">Clients</option>
            <option value="FREELANCER">Freelancers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </Flex>

      {/* Users Table */}
      <Card>
        {isLoading ? (
          <Flex justify-content="center" align-items="center" padding="3xl">
            <Spinner />
          </Flex>
        ) : (
          <>
            {/* Table Header */}
            <Grid columns="2fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m">
              <Text>User</Text>
              <Text>Role</Text>
              <Text>Status</Text>
              <Text>Rating</Text>
              <Text>Joined</Text>
              <Text>Actions</Text>
            </Grid>

            {/* Table Body */}
            {filteredUsers.map((user: User) => (
              <div key={user.id}>
                <Divider />
                <Grid columns="2fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center">
                  {/* User Info */}
                  <Flex gap="m" align-items="center">
                    <div>
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <Text>{user.fullName}</Text>
                      <Text>
                        {user.email}
                      </Text>
                    </div>
                  </Flex>

                  {/* Role */}
                  <div>
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  </div>

                  {/* Status */}
                  <div>
                    <Badge variant={user.isActive ? 'success' : 'danger'}>
                      {user.isActive ? '✓ Active' : '✗ Inactive'}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <Text>
                    {user.ratingAvg?.toFixed(1) || 'N/A'}
                  </Text>

                  {/* Joined */}
                  <Text>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Text>

                  {/* Actions */}
                  <Flex gap="s" justify-content="flex-end">
                    <Button
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
                    </Button>
                    <Button
                      size="small"
                      rank="secondary"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this user?')) {
                          deleteMutation.mutate(user.id)
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
              <Text>
                Showing page {page + 1} of {data?.totalPages || 1}
              </Text>
              <Flex gap="s">
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
          </>
        )}
      </Card>

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
    </Flex>
  )
}



