import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import logger from './logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Extend Axios config to include metadata for logging
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
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

    // If 401 and not already retried, attempt token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      logger.info('Attempting token refresh due to 401 response');

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          logger.debug('Refresh token found, requesting new access token');
          
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          logger.info('Token refresh successful');

          localStorage.setItem('access_token', data.accessToken);
          apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          return apiClient(originalRequest);
        } else {
          logger.warn('No refresh token found, cannot refresh');
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        logger.error('Token refresh failed, logging out user', refreshError as Error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
