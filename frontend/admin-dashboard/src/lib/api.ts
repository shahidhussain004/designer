import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { emailOrUsername: email, password })
    return response.data
  },
  me: async (token?: string) => {
    // If token provided, override header for this call to avoid relying on store state during bootstrap
    const response = await api.get('/api/users/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    return response.data
  },
}

// Admin API
export const adminApi = {
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard/stats')
    return response.data
  },
  getRecentActivity: async () => {
    const response = await api.get('/api/admin/dashboard/recent-activity')
    return response.data
  },
}

// Users API
export const usersApi = {
  getAll: async (params?: { page?: number; size?: number; role?: string; status?: string }) => {
    const response = await api.get('/api/admin/users', { params })
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/admin/users/${id}`)
    return response.data
  },
  create: async (payload: { email: string; username: string; password: string; fullName: string; role: string }) => {
    const response = await api.post('/api/auth/register', payload)
    return response.data
  },
  update: async (id: number, payload: { email?: string; fullName?: string; role?: string }) => {
    const response = await api.put(`/api/admin/users/${id}`, payload)
    return response.data
  },
  updateStatus: async (id: number, isActive: boolean) => {
    // Backend expects `active` field; map `isActive` to `active` to ensure state changes apply
    const response = await api.put(`/api/admin/users/${id}/status`, { active: isActive })
    return response.data
  },
  delete: async (id: number) => {
    await api.delete(`/api/admin/users/${id}`)
  },
}

// Jobs API
export const jobsApi = {
  getAll: async (params?: { page?: number; size?: number; status?: string }) => {
    const response = await api.get('/api/admin/jobs', { params })
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/admin/jobs/${id}`)
    return response.data
  },
  create: async (payload: { title: string; description: string; categoryName: string; budgetMin: number; budgetMax: number; status?: string }) => {
    const response = await api.post('/api/jobs', payload)
    return response.data
  },
  update: async (id: number, payload: { title?: string; description?: string; categoryName?: string; budgetMin?: number; budgetMax?: number; status?: string }) => {
    const response = await api.put(`/api/jobs/${id}`, payload)
    return response.data
  },
  getCategories: async () => {
    const response = await api.get('/api/jobs/categories')
    return response.data
  },
  getPending: async () => {
    const response = await api.get('/api/admin/jobs/pending')
    return response.data
  },
  approve: async (id: number) => {
    const response = await api.put(`/api/admin/jobs/${id}/approve`)
    return response.data
  },
  reject: async (id: number, reason: string) => {
    const response = await api.put(`/api/admin/jobs/${id}/reject`, { reason })
    return response.data
  },
  delete: async (id: number) => {
    await api.delete(`/api/admin/jobs/${id}`)
  },
}

// Disputes API
export const disputesApi = {
  getAll: async (params?: { page?: number; size?: number; status?: string }) => {
    const response = await api.get('/api/admin/disputes', { params })
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/admin/disputes/${id}`)
    return response.data
  },
  resolve: async (id: number, resolution: string, refundAmount?: number, favorClient?: boolean) => {
    const response = await api.put(`/api/admin/disputes/${id}/resolve`, { 
      resolution, 
      refundAmount,
      favorClient
    })
    return response.data
  },
  escalate: async (id: number) => {
    const response = await api.put(`/api/admin/disputes/${id}/escalate`)
    return response.data
  },
}

// Analytics API
export const analyticsApi = {
  getUserGrowth: async () => {
    const response = await api.get('/api/admin/analytics/user-growth')
    return response.data
  },
  getRevenue: async () => {
    const response = await api.get('/api/admin/analytics/revenue')
    return response.data
  },
  getJobStats: async () => {
    const response = await api.get('/api/admin/analytics/jobs')
    return response.data
  },
  getCategoryDistribution: async () => {
    const response = await api.get('/api/admin/analytics/categories')
    return response.data
  },
}

export default api
