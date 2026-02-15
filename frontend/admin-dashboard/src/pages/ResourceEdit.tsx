import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Button,
    Card,
    Divider,
    Flex,
    Spinner,
    Text,
} from '../components/green'
import { resourcesApi, type Resource } from '../lib/resourcesApi'

export default function ResourceEditPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<Partial<Resource>>({
    title: '',
    excerpt: '',
    content: '',
    content_type: 'blog',
    featured_image: '',
    author_id: '',
    status: 'draft',
    is_featured: false,
  })
  const [isSaving, setIsSaving] = useState(false)

  // Fetch resource
  const { data: resource, isLoading } = useQuery({
    queryKey: ['resource', resourceId],
    queryFn: () => resourcesApi.getById(resourceId!),
    enabled: !!resourceId,
  })

  // Populate form with fetched data
  useEffect(() => {
    console.log(' [ResourceEditPage] Fetched resource:', resource)
    if (resource) {
      setFormData(resource)
    }
  }, [resource])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as any
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required')
      return
    }

    setIsSaving(true)
    try {
      // Build a clean payload matching backend UpdateContentDTO
      const payload: any = {}
      if (formData.title) payload.title = formData.title
      if ((formData as any).slug) payload.slug = (formData as any).slug
      if (formData.excerpt) payload.excerpt = formData.excerpt
      // backend expects `body`
      if ((formData as any).content) payload.body = (formData as any).content
      if (formData.content_type) payload.content_type = formData.content_type
      if (formData.status) payload.status = formData.status
      if (formData.featured_image) payload.featured_image = formData.featured_image
      // author_id
      if (formData.author_id) payload.author_id = formData.author_id
      else if ((formData as any).author && (formData as any).author.id) payload.author_id = (formData as any).author.id
      // category may be object or id
      if (formData.category_id) payload.category_id = formData.category_id
      else if ((formData as any).category && (formData as any).category.id) payload.category_id = (formData as any).category.id
      // tags -> tag_ids
      if ((formData as any).tags && Array.isArray((formData as any).tags)) {
        payload.tag_ids = (formData as any).tags.map((t: any) => t.id).filter(Boolean)
      }
      if (formData.is_featured !== undefined) payload.is_featured = formData.is_featured
      if ((formData as any).is_trending !== undefined) payload.is_trending = (formData as any).is_trending
      if ((formData as any).meta_title) payload.meta_title = (formData as any).meta_title
      if ((formData as any).meta_description) payload.meta_description = (formData as any).meta_description
      if ((formData as any).meta_keywords) payload.meta_keywords = (formData as any).meta_keywords

      await resourcesApi.update(resourceId!, payload)
      toast.success('Resource saved successfully')
      navigate('/admin/resources')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save resource')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    setIsSaving(true)
    try {
      if (formData.status === 'published') {
        await resourcesApi.unpublish(resourceId!)
        toast.success('Resource unpublished')
        setFormData((prev) => ({ ...prev, status: 'draft' }))
      } else {
        await resourcesApi.publish(resourceId!)
        toast.success('Resource published')
        setFormData((prev) => ({ ...prev, status: 'published' }))
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change publish status')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Flex justify-content="center" align-items="center" padding="l" style={{ minHeight: '400px' }}>
        <Spinner />
      </Flex>
    )
  }

  return (
    <Flex flex-direction="column" gap="l" padding="l">
      {/* Header */}
      <Flex justify-content="space-between" align-items="center">
        <Text tag="h1" font-size="heading-l">
          Edit Resource
        </Text>
        <Flex gap="s">
          <Button
            rank="secondary"
            onClick={() => navigate('/admin/resources')}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isSaving}
            rank={formData.status === 'published' ? 'secondary' : 'primary'}
          >
            {isSaving ? 'Processing...' : formData.status === 'published' ? 'Unpublish' : 'Publish'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Flex>
      </Flex>

      <Divider />

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card padding="m">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Resource title"
            />
          </Card>

          {/* Excerpt */}
          <Card padding="m">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt / Summary
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary of the resource"
            />
          </Card>

          {/* Content */}
          <Card padding="m">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content || ''}
              onChange={handleChange}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Resource full content (HTML supported)"
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card padding="m">
            <Text font-size="body-m" font-weight="bold" className="mb-3 block">
              Status
            </Text>
            <div className="space-y-2">
              <div className="flex items-center">
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full ${
                    formData.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {formData.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {formData.status === 'published'
                  ? 'This resource is visible to everyone'
                  : 'This resource is only visible to admins'}
              </p>
            </div>
          </Card>

          {/* Type */}
          <Card padding="m">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="content_type"
              value={formData.content_type || 'blog'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="blog">Blog Post</option>
              <option value="article">Article</option>
              <option value="news">News</option>
            </select>
          </Card>

          {/* Author */}
          <Card padding="m">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              name="author_id"
              value={formData.author_id || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Author ID"
            />
          </Card>

          {/* Featured Image */}
          <Card padding="m">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              name="featured_image"
              value={formData.featured_image || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            {formData.featured_image && (
              <div className="mt-3">
                <img
                  src={formData.featured_image}
                  alt="Featured"
                  className="w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </Card>

          {/* Featured */}
          <Card padding="m">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured || false}
                onChange={handleChange}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Mark as Featured
              </span>
            </label>
            <p className="text-xs text-gray-600 mt-2">
              Featured resources appear at the top of listings
            </p>
          </Card>

          {/* Metadata */}
          <Card padding="m" variant="secondary">
            <Text font-size="body-s" font-weight="bold" className="mb-2 block">
              Metadata
            </Text>
            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <strong>ID:</strong> {resource?.id}
              </p>
              <p>
                <strong>Created:</strong>{' '}
                {new Date(resource?.createdAt || '').toLocaleDateString()}
              </p>
              <p>
                <strong>Updated:</strong>{' '}
                {new Date(resource?.updatedAt || '').toLocaleDateString()}
              </p>
              <p>
                <strong>Views:</strong> {resource?.viewCount || 0}
              </p>
              <p>
                <strong>Likes:</strong> {resource?.likeCount || 0}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Flex>
  )
}
