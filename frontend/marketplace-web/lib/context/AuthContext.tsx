"use client"

import { authService } from '@/lib/auth'
// Import storage tracer to catch unexpected localStorage changes
import '@/lib/storage-tracer'
import { User } from '@/types'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface AuthContextValue {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    console.log('[AuthContext] refreshUser called');
    try {
      // Get user from localStorage
      const u = authService.getCurrentUser()
      console.log('[AuthContext] User from localStorage:', u);
      
      // Check if token exists (not expiration - let API interceptor handle that)
      const isValid = authService.isAuthenticated()
      console.log('[AuthContext] Token exists:', isValid);
      
      if (u && isValid) {
        // User exists in storage and token exists
        console.log('[AuthContext] Setting user state:', u);
        setUser(u)
      } else {
        // No user data or no token - just clear user state, don't logout
        console.log('[AuthContext] No user or token found');
        setUser(null)
      }
    } catch (err) {
      console.error('AuthContext refreshUser error:', err)
      setUser(null)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[AuthContext] Initializing auth on app startup');
      
      try {
        // Check if we have refresh token - only try refresh if we DON'T already have a valid access token
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        
        // Only attempt silent refresh when access token is absent but refresh token exists.
        // This avoids a race where a freshly stored access token (just after login) is
        // immediately overwritten/cleared by a failing refresh attempt.
        if (!accessToken && refreshToken) {
          console.log('[AuthContext] Refresh token found, attempting to refresh access token');
          try {
            // Try to refresh the access token silently
            const { apiClient } = await import('@/lib/api-client');
            const response = await apiClient.post('/auth/refresh', { refreshToken });
            
            if (response.data.accessToken) {
              console.log('[AuthContext] Token refresh successful on startup');
              localStorage.setItem('access_token', response.data.accessToken);
              if (response.data.refreshToken) {
                localStorage.setItem('refresh_token', response.data.refreshToken);
              }
              // Update Axios default headers
              apiClient.defaults.headers.Authorization = `Bearer ${response.data.accessToken}`;
            }
          } catch (err) {
            console.warn('[AuthContext] Token refresh failed on startup, will require login:', err);
          }
        }
        
        // Now refresh user state
        await refreshUser();
      } finally {
        // CRITICAL: Always set loading to false when initialization completes
        console.log('[AuthContext] Auth initialization complete, setting loading=false');
        setLoading(false);
      }
    }
    
    initializeAuth();
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
