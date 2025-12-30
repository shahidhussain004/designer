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
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
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
    }
    
    return data;
  },

  /**
   * Logout user and clear tokens
   */
  logout() {
    if (typeof window !== 'undefined') {
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
   * Check if user is authenticated and token is valid
   */
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (!token) return false;
      
      // Try to decode JWT and check expiration
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp && payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          // Clear expired tokens
          this.logout();
          return false;
        }
        
        return true;
      } catch {
        // If token is malformed, clear it
        this.logout();
        return false;
      }
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
};
