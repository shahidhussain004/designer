import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import logger from './logger';

const LMS_API_URL = process.env.NEXT_PUBLIC_LMS_API_URL || 'http://localhost:8082/api';

// Extend Axios config for metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

/**
 * Axios instance for LMS Service
 * Configured with interceptors for auth, logging, and error handling
 */
export const lmsClient = axios.create({
  baseURL: LMS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add auth token and logging
lmsClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const startTime = Date.now();
    config.metadata = { startTime };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    logger.apiRequest(
      config.method?.toUpperCase() || 'UNKNOWN',
      `[LMS] ${config.url || 'UNKNOWN'}`,
      config.data
    );
    return config;
  },
  (error) => {
    logger.error('LMS API Request Interceptor Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and log responses
lmsClient.interceptors.response.use(
  (response) => {
    const duration = response.config.metadata?.startTime 
      ? Date.now() - response.config.metadata.startTime 
      : 0;

    logger.apiResponse(
      response.config.method?.toUpperCase() || 'UNKNOWN',
      `[LMS] ${response.config.url || 'UNKNOWN'}`,
      response.status,
      duration
    );

    if (duration > 1000) {
      logger.warn(`Slow LMS API request: ${duration}ms`, {
        method: response.config.method,
        url: response.config.url,
        duration: `${duration}ms`,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    // Ignore cancellation errors
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { 
      _retry?: boolean; 
      metadata?: { startTime: number } 
    };

    const duration = originalRequest?.metadata?.startTime 
      ? Date.now() - originalRequest.metadata.startTime 
      : 0;

    if (error.response) {
      logger.apiError(
        originalRequest?.method?.toUpperCase() || 'UNKNOWN',
        `[LMS] ${originalRequest?.url || 'UNKNOWN'}`,
        error,
        error.response.status
      );

      logger.error('LMS API Error Response', error, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        duration: `${duration}ms`,
      });
    } else if (error.request) {
      logger.error('LMS API Request Failed - No Response', error, {
        url: originalRequest?.url,
        method: originalRequest?.method,
      });
    } else {
      logger.error('LMS API Request Setup Error', error);
    }

    return Promise.reject(error);
  }
);

export default lmsClient;
