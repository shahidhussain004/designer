import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Use Vite's import.meta.env in the browser (process is not defined in browsers)
const CONTENT_API_URL = import.meta.env.VITE_CONTENT_API_URL || 'http://localhost:8083/api/v1'

const apiContent = axios.create({
  baseURL: CONTENT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiContent.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiContent.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface Resource {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  content_type: 'blog' | 'article' | 'news'
  featured_image?: string
  author_id?: string
  status: 'draft' | 'published'
  published_at?: string
  created_at: string
  updated_at: string
  view_count: number
  like_count: number
  is_featured: boolean
  category_id?: string
  category?: { id: string; name: string }
  tags?: Array<{ id: string; name: string }>
}

export interface ResourceFilters {
  content_type?: 'blog' | 'article' | 'news'
  search?: string
  status?: 'draft' | 'published'
  page?: number
  limit?: number
}

export const resourcesApi = {
  // Fetch all resources with filters
  getAll: async (filters: ResourceFilters = {}) => {
    const response = await apiContent.get('/content', {
      params: {
        ...filters,
        limit: filters.limit || 20,
        page: filters.page || 1,
      },
    })
    return response.data.data
  },

  // Fetch single resource by ID
  getById: async (id: string) => {
    const response = await apiContent.get(`/content/${id}`)
    return response.data.data
  },

  // Fetch resource by slug
  getBySlug: async (slug: string) => {
    const response = await apiContent.get(`/content/slug/${slug}`)
    return response.data.data
  },

  // Update resource
  update: async (id: string, data: Partial<Resource>) => {
    const response = await apiContent.patch(`/content/${id}`, data)
    return response.data.data
  },

  // Delete resource
  delete: async (id: string) => {
    await apiContent.delete(`/content/${id}`)
  },

  // Publish resource
  publish: async (id: string) => {
    const response = await apiContent.post(`/content/${id}/publish`)
    return response.data.data
  },

  // Unpublish resource
  unpublish: async (id: string) => {
    const response = await apiContent.post(`/content/${id}/unpublish`)
    return response.data.data
  },

  // Get categories
  getCategories: async () => {
    const response = await apiContent.get('/categories')
    return response.data.data
  },

  // Get tags
  getTags: async () => {
    const response = await apiContent.get('/tags')
    return response.data.data
  },
}

export default apiContent
