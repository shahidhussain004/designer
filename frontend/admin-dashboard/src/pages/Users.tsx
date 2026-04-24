import { CheckCircleIcon, PencilSquareIcon, PlusIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Input,
  Spinner,
  Text
} from '../components/green'
import { usersApi } from '../lib/api'

interface User {
  id: number
  email: string
  username: string
  fullName: string
  role: string
  active: boolean
  emailVerified: boolean
  profileImage?: string
  createdAt: string
  totalJobs?: number
  totalProposals?: number
}

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { email: string; username: string; password: string; fullName: string; role: string }) => void
}

function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
  const [formData, setFormData] = useState({ 
    email: '', 
    username: '', 
    password: '', 
    fullName: '', 
    role: 'COMPANY' 
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <Flex flex-direction="column" gap="m" padding="l">
          <Text className="text-lg font-bold">Add New User</Text>
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onInput={(e) => setFormData({...formData, email: (e.target as HTMLInputElement).value})}
            placeholder="user@example.com"
          />
          
          <Input
            label="Username"
            value={formData.username}
            onInput={(e) => setFormData({...formData, username: (e.target as HTMLInputElement).value})}
            placeholder="Username (letters, numbers, underscores only)"
          />
          
          <Input
            label="Full Name"
            value={formData.fullName}
            onInput={(e) => setFormData({...formData, fullName: (e.target as HTMLInputElement).value})}
            placeholder="John Doe"
          />
          
          <Input
            label="Initial Password"
            type="password"
            value={formData.password}
            onInput={(e) => setFormData({...formData, password: (e.target as HTMLInputElement).value})}
            placeholder="Minimum 8 characters"
          />
          <Text className="text-xs text-secondary-600 -mt-2">User will receive this password to login initially</Text>
          
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg"
            >
              <option value="COMPANY">Company</option>
              <option value="FREELANCER">Freelancer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <Flex gap="s" justify-content="flex-end">
            <Button rank="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={() => {
              onSubmit(formData)
              setFormData({ email: '', username: '', password: '', fullName: '', role: 'COMPANY' })
            }}>Add User</Button>
          </Flex>
        </Flex>
      </Card>
    </div>
  )
}

export default function Users() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showAddModal, setShowAddModal] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, roleFilter, statusFilter],
    queryFn: () => usersApi.getAll({ page, size: 10, role: roleFilter, status: statusFilter || undefined }),
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
      toast.success('User deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete user')
    },
  })

  const createUserMutation = useMutation({
    mutationFn: (userData: { email: string; username: string; password: string; fullName: string; role: string }) =>
      usersApi.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
      setShowAddModal(false)
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create user'
      toast.error(errorMessage)
    },
  })

  const filteredUsers = (data?.content || []).filter((user: User) => {
    const matchesSearch = user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === '' ? true : (statusFilter === 'active' ? user.active === true : user.active === false)

    return matchesSearch && matchesStatus
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-warning-100 text-warning-800 border-warning-300'
      case 'COMPANY': return 'bg-primary-100 text-blue-800 border-primary-300'
      case 'FREELANCER': return 'bg-success-100 text-success-800 border-success-300'
      default: return 'bg-secondary-100 text-secondary-800 border-secondary-300'
    }
  }

  return (
    <Flex flex-direction="column" gap="l" className="pb-12">
      {/* Header */}
      <Flex justify-content="space-between" align-items="center" className="mb-4">
        <div>
          <Text className="text-3xl font-bold text-secondary-900">User Management</Text>
          <Text className="text-secondary-600 mt-1">Manage platform users, roles, and permissions</Text>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white">
          <PlusIcon width={20} height={20} className="mr-2" />
          Add User
        </Button>
      </Flex>

      {/* Filters & Search */}
      <Card className="bg-secondary-50 border border-secondary-200">
        <Flex gap="m" align-items="flex-end" padding="m" flex-wrap="wrap">
          <div className="flex-1 min-w-xs">
            <label className="block text-sm font-medium text-secondary-700 mb-1">Search</label>
            <Input
              placeholder="Search by name, email, or username..."
              value={search}
              onInput={(e: React.FormEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
              className="w-full"
            />
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-secondary-700 mb-1">Role Filter</label>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(0) }}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Roles</option>
              <option value="COMPANY">Company</option>
              <option value="FREELANCER">Freelancer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setStatusFilter(''); setPage(0) }}
                className={`px-3 py-2 rounded text-sm ${statusFilter === '' ? 'bg-primary-600 text-white' : 'bg-white border border-secondary-300'}`}>
                All
              </button>
              <button
                onClick={() => { setStatusFilter('active'); setPage(0) }}
                className={`px-3 py-2 rounded text-sm ${statusFilter === 'active' ? 'bg-primary-600 text-white' : 'bg-white border border-secondary-300'}`}>
                Active
              </button>
              <button
                onClick={() => { setStatusFilter('inactive'); setPage(0) }}
                className={`px-3 py-2 rounded text-sm ${statusFilter === 'inactive' ? 'bg-primary-600 text-white' : 'bg-white border border-secondary-300'}`}>
                Inactive
              </button>
            </div>
          </div>
        </Flex>
      </Card>

      {/* Users List */}
      <Card className="border border-secondary-200 shadow-sm">
        {isLoading ? (
          <Flex justify-content="center" align-items="center" padding="3xl">
            <Spinner />
          </Flex>
        ) : filteredUsers.length === 0 ? (
          <Flex justify-content="center" align-items="center" padding="3xl" flex-direction="column" gap="m">
            <Text className="text-secondary-500">No users found</Text>
          </Flex>
        ) : (
          <>
            {/* Desktop Table View - Only shown on larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-secondary-100 to-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-secondary-700">User Info</th>
                    <th className="px-6 py-3 text-left font-semibold text-secondary-700">Role</th>
                    <th className="px-6 py-3 text-left font-semibold text-secondary-700">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-secondary-700">Email Verified</th>
                    <th className="px-6 py-3 text-left font-semibold text-secondary-700">Joined</th>
                    <th className="px-6 py-3 text-left font-semibold text-secondary-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: User, idx: number) => (
                    <tr key={user.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-secondary-50'} border-b border-secondary-200 hover:bg-primary-50 transition`}>
                      <td className="px-6 py-4">
                        <Flex align-items="center" gap="m">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                            <Text className="text-white font-bold">{user.fullName?.charAt(0) || 'U'}</Text>
                          </div>
                          <div>
                            <Text className="font-medium text-secondary-900">{user.fullName}</Text>
                            <Text className="text-xs text-secondary-500">@{user.username}</Text>
                          </div>
                        </Flex>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${getRoleBadgeColor(user.role)} px-2 py-1 rounded text-xs font-medium border`}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Flex align-items="center" gap="s">
                          {user.active ? (
                            <>
                              <CheckCircleIcon width={16} height={16} className="text-success-600" />
                              <Text className="text-success-600 font-medium">Active</Text>
                            </>
                          ) : (
                            <>
                              <XCircleIcon width={16} height={16} className="text-error-600" />
                              <Text className="text-error-600 font-medium">Inactive</Text>
                            </>
                          )}
                        </Flex>
                      </td>
                      <td className="px-6 py-4">
                        {user.emailVerified ? (
                          <Badge className="bg-success-100 text-success-800 border-success-300 px-2 py-1 rounded text-xs font-medium border">✓ Verified</Badge>
                        ) : (
                          <Badge className="bg-warning-100 text-warning-800 border-warning-300 px-2 py-1 rounded text-xs font-medium border">Pending</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Text className="text-secondary-600">{new Date(user.createdAt).toLocaleDateString()}</Text>
                      </td>
                      <td className="px-6 py-4">
                        <Flex gap="xs">
                          <Button
                            size="small"
                            rank="tertiary"
                            title="Edit user"
                            className="text-primary-700 hover:text-blue-800"
                          >
                            <PencilSquareIcon width={16} height={16} />
                          </Button>
                          <Button
                            size="small"
                            rank="tertiary"
                            onClick={() => updateStatusMutation.mutate({ id: user.id, isActive: !user.active })}
                            title={user.active ? 'Deactivate' : 'Activate'}
                            className={user.active ? 'text-warning-600 hover:text-warning-700' : 'text-success-600 hover:text-success-700'}
                          >
                            {user.active ? '✕' : '✓'}
                          </Button>
                          <Button
                            size="small"
                            rank="tertiary"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
                                deleteMutation.mutate(user.id)
                              }
                            }}
                            title="Delete user"
                            className="text-error-600 hover:text-error-700"
                          >
                            <TrashIcon width={16} height={16} />
                          </Button>
                        </Flex>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Only shown on small screens */}
            <div className="md:hidden space-y-3 p-4">
              {filteredUsers.map((user: User) => (
                <Card key={user.id} className="bg-white border border-secondary-200">
                  <Flex flex-direction="column" gap="m" padding="m">
                    <Flex justify-content="space-between" align-items="start">
                      <Flex align-items="center" gap="m" flex="1">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Text className="text-white font-bold">{user.fullName?.charAt(0) || 'U'}</Text>
                        </div>
                        <div>
                          <Text className="font-semibold text-secondary-900">{user.fullName}</Text>
                          <Text className="text-xs text-secondary-500">{user.email}</Text>
                        </div>
                      </Flex>
                      <Badge className={`${getRoleBadgeColor(user.role)} px-2 py-1 rounded text-xs font-medium border`}>
                        {user.role}
                      </Badge>
                    </Flex>

                    <Flex justify-content="space-between" align-items="center" text-size="sm">
                      <Text className="text-secondary-600">
                        {user.active ? 'Active' : 'Inactive'} • {user.emailVerified ? 'Email verified' : 'Email pending'}
                      </Text>
                    </Flex>

                    <Flex gap="xs" justify-content="space-around">
                      <Button size="small" rank="tertiary" className="flex-1 text-primary-700">Edit</Button>
                      <Button
                        size="small"
                        rank="secondary"
                        onClick={() => updateStatusMutation.mutate({ id: user.id, isActive: !user.active })}
                        className="flex-1"
                      >
                        {user.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="small"
                        rank="tertiary"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
                            deleteMutation.mutate(user.id)
                          }
                        }}
                        className="flex-1 text-error-600"
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <Divider />
            <Flex justify-content="space-between" align-items="center" padding="m">
              <Text className="text-sm text-secondary-600">
                Page {page + 1} of {data?.totalPages || 1} • Showing {filteredUsers.length} of {data?.totalElements || 0} users
              </Text>
              <Flex gap="s">
                <Button
                  rank="secondary"
                  size="small"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="disabled:opacity-50"
                >
                  ← Previous
                </Button>
                <Text className="px-3 py-2 text-sm text-secondary-700">{page + 1}</Text>
                <Button
                  rank="secondary"
                  size="small"
                  onClick={() => setPage(page + 1)}
                  disabled={data?.last}
                  className="disabled:opacity-50"
                >
                  Next →
                </Button>
              </Flex>
            </Flex>
          </>
        )}
      </Card>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(userData) => {
          // Validate required fields
          if (!userData.email || !userData.username || !userData.password || !userData.fullName) {
            toast.error('Please fill in all required fields')
            return
          }
          
          if (userData.password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
          }
          
          if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
            toast.error('Username can only contain letters, numbers, and underscores')
            return
          }
          
          createUserMutation.mutate(userData)
        }}
      />
    </Flex>
  )
}
