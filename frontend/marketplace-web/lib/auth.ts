import { useEffect, useState } from 'react';
import { apiClient } from './api-client';

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName: string;
  role: 'CLIENT' | 'FREELANCER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    username: string;
    fullName: string;
    role: string;
  };
}

/**
 * Authentication service for Designer Marketplace
 */
export const authService = {
  /**
   * Login user and store tokens
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Ensure axios instance includes the new token for immediate requests
        apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        
        // DEBUG: Verify storage
        console.log('[AUTH] Login successful');
        console.log('[AUTH] Stored tokens:', {
          accessToken: data.accessToken?.substring(0, 20) + '...',
          refreshToken: data.refreshToken?.substring(0, 20) + '...',
          user: data.user
        });
      }
      
      return data;
    } catch (error) {
      console.error('[AUTH] Login failed:', error);
      throw error;
    }
  },

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Ensure axios instance includes the new token for immediate requests
      apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
    }
    
    return data;
  },

  /**
   * Logout user and clear tokens
   */
  logout() {
    if (typeof window !== 'undefined') {
      // Debug tracing: log a stack trace so we can see who triggered logout
      try {
        console.warn('[AUTH] logout() called - clearing localStorage');
        console.trace();
      } catch (e) {
        // ignore
      }

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  /**
   * Check if user is authenticated
   * NOTE: Does NOT check expiration - the API interceptor will handle 401 errors and refresh automatically
   * This prevents false logouts when token is expired but refresh token is still valid
   */
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      // Just check if token exists - let the API interceptor handle expiration and refresh
      return !!token;
    }
    return false;
  },

  /**
   * Verify token with backend
   */
  async verifyToken(): Promise<boolean> {
    if (!this.isAuthenticated()) return false;
    
    try {
      // Try to fetch current user profile to verify token
      await apiClient.get('/users/me');
      return true;
    } catch (error) {
      // Token is invalid, clear it
      this.logout();
      return false;
    }
  },

  /**
   * Check if current user can create courses
   */
  canCreateCourses(): boolean {
    if (typeof window === 'undefined') return false;
    const user = this.getCurrentUser();
    return user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';
  },

  /**
   * Check if current user is an instructor
   */
  isInstructor(): boolean {
    if (typeof window === 'undefined') return false;
    const user = this.getCurrentUser();
    return user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';
  },
};

/**
 * React hook to access current user from localStorage.
 * Returns `{ user, setUser }` for simple usage in client components.
 */
export function useAuth() {
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  });

  useEffect(() => {
    const handleStorage = () => {
      const userStr = localStorage.getItem('user');
      setUser(userStr ? JSON.parse(userStr) : null);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
      }
    };
  }, []);

  return { user, setUser };
}
