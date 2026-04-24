import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from './env';
import logger from './logger';

const API_URL = ENV.API_URL;

/**
 * Token refresh singleton to prevent race conditions
 * When multiple requests fail with 401, only one refresh attempt is made
 * All other requests wait for the same refresh promise
 */
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Extend Axios config to include metadata for logging
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
    _retry?: boolean;
    _retryCount?: number; // Track retry attempts
  }
}

/**
 * Axios instance configured for Designer Marketplace API
 * Automatically includes JWT token in Authorization header
 * Includes comprehensive logging for debugging and monitoring
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add auth token and log requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const startTime = Date.now();
    config.metadata = { startTime }; // Store start time for duration calculation

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Debug: log whether Authorization header will be sent
      try {

      } catch {
        // ignore
      }
    }

    // Log API request
    logger.apiRequest(
      config.method?.toUpperCase() || 'UNKNOWN',
      config.url || 'UNKNOWN',
      config.data
    );

    return config;
  },
  (error) => {
    logger.error('API Request Interceptor Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh and log responses
// Response interceptor - handle token refresh and log responses
apiClient.interceptors.response.use(
  (response) => {
    const duration = response.config.metadata?.startTime 
      ? Date.now() - response.config.metadata.startTime 
      : 0;

    // Log successful response
    logger.apiResponse(
      response.config.method?.toUpperCase() || 'UNKNOWN',
      response.config.url || 'UNKNOWN',
      response.status,
      duration
    );

    // Warn on slow requests
    if (duration > 1000) {
      logger.warn(`Slow API request detected: ${duration}ms`, {
        method: response.config.method,
        url: response.config.url,
        duration: `${duration}ms`,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    // Ignore cancellation errors - they're expected behavior
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; metadata?: { startTime: number } };
    const duration = originalRequest?.metadata?.startTime 
      ? Date.now() - originalRequest.metadata.startTime 
      : 0;

    // Log API error
    if (error.response) {
      logger.apiError(
        originalRequest?.method?.toUpperCase() || 'UNKNOWN',
        originalRequest?.url || 'UNKNOWN',
        error,
        error.response.status
      );

      logger.error(`API Error Response Details`, error, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        duration: `${duration}ms`,
      });
    } else if (error.request) {
      logger.error('API Request Failed - No Response', error, {
        url: originalRequest?.url,
        method: originalRequest?.method,
        timeout: error.code === 'ECONNABORTED',
      });
    } else {
      logger.error('API Request Setup Error', error);
    }

    // Production-grade 401 handling with race condition prevention
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, wait for the existing refresh promise
      if (isRefreshing && refreshPromise) {
        logger.debug('Token refresh already in progress, waiting...');
        try {
          const newAccessToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch {
          // Refresh failed, will be handled below
          return Promise.reject(error);
        }
      }

      // Start new refresh process
      isRefreshing = true;
      logger.info('Starting token refresh due to 401 response');

      refreshPromise = (async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          
          if (!refreshToken) {
            logger.warn('No refresh token found - session expired');
            throw new Error('No refresh token available');
          }

          logger.debug('Requesting new access token from refresh endpoint');
          
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          if (!data.accessToken) {
            throw new Error('No access token in refresh response');
          }

          logger.info('✓ Token refresh successful');

          // Update stored token and axios defaults
          localStorage.setItem('access_token', data.accessToken);
          apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
          
          return data.accessToken;

        } catch (refreshError) {
          // Refresh failed - gracefully logout user
          logger.error('✗ Token refresh failed - logging out user', refreshError as Error);
          
          // Clear tokens and auth state
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          
          // Redirect to login with message
          const currentPath = window.location.pathname + window.location.search;
          const isAuthPage = currentPath.startsWith('/auth/');
          
          if (!isAuthPage) {
            logger.info(`Redirecting to login (session expired), return path: ${currentPath}`);
            window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}&message=${encodeURIComponent('Your session has expired. Please log in again.')}`;
          }
          
          throw refreshError;
        } finally {
          // Reset refresh state
          isRefreshing = false;
          refreshPromise = null;
        }
      })();

      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
