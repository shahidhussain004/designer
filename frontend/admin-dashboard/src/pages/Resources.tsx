import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import {
    Button,
    Card,
    Divider,
    Flex,
    Spinner,
    Text,
} from '../components/green'
import { resourcesApi, type Resource, type ResourceFilters } from '../lib/resourcesApi'

export default function ResourcesPage() {
  const [filters, setFilters] = useState<ResourceFilters>({
    page: 1,
    limit: 20,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'blog' | 'article' | 'news' | ''>('')
  const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | ''>('')

  // Fetch resources
  const { data: resources = [], isLoading, isFetching } = useQuery({
    queryKey: ['admin-resources', filters],
    queryFn: () =>
      resourcesApi.getAll({
        ...filters,
        search: searchQuery || undefined,
        content_type: (typeFilter as any) || undefined,
        status: (statusFilter as any) || undefined,
      }),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, page: 1 })
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await resourcesApi.delete(id)
      toast.success('Resource deleted successfully')
      // Refetch would happen automatically via query invalidation in a production app

      window.location.reload()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete resource')
    }
  }

  const getTypeBadge = (type: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      blog: { bg: 'bg-blue-100', text: 'text-blue-800' },
      article: { bg: 'bg-green-100', text: 'text-green-800' },
      news: { bg: 'bg-amber-100', text: 'text-amber-800' },
    }
    return styles[type] || { bg: 'bg-gray-100', text: 'text-gray-800' }
  }

  const getStatusBadge = (status: string) => {
    return status === 'published'
      ? { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' }
      : { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' }
  }

  return (
    <Flex flex-direction="column" gap="l" padding="l">
      {/* Header */}
      <Flex justify-content="space-between" align-items="center">
        <Text tag="h1" font-size="heading-l">
          Resources Management
        </Text>
      </Flex>

      <Divider />

      {/* Filters */}
      <Card padding="m" variant="secondary">
        <form onSubmit={handleSearch}>
          <Flex flex-direction="column" gap="m">
            <Flex gap="m" align-items="flex-end">
              <div style={{ flex: 1 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="blog">Blog</option>
                  <option value="article">Article</option>
                  <option value="news">News</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <Button type="submit" disabled={isFetching}>
                {isFetching ? 'Searching...' : 'Search'}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Card>

      {/* Resources Table */}
      {isLoading ? (
        <Flex justify-content="center" padding="l">
          <Spinner />
        </Flex>
      ) : resources.length === 0 ? (
        <Card padding="l">
          <Text color="secondary">No resources found matching your filters.</Text>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Created
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(resources as Resource[]).map((resource) => (
                <tr key={resource.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    <div className="max-w-xs truncate">{resource.title}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        getTypeBadge(resource.content_type).bg
                      } ${getTypeBadge(resource.content_type).text}`}
                    >
                      {resource.content_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        getStatusBadge(resource.status).bg
                      } ${getStatusBadge(resource.status).text}`}
                    >
                      {getStatusBadge(resource.status).label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {resource.author_id || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {resource.view_count}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(resource.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Flex justify-content="center" gap="s">
                      <Link to={`/admin/resources/${resource.id}/edit`}>
                        <Button rank="secondary" size="small">
                          Edit
                        </Button>
                      </Link>
                      <button
                        onClick={() => handleDelete(resource.id, resource.title)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </Flex>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Flex>
  )
}
