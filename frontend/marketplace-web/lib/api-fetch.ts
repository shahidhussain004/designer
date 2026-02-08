/**
 * Global API Fetch Wrapper with JWT Token Refresh
 * Handles expired tokens by attempting silent refresh before retrying requests
 */

import { authService } from './auth';

interface TokenPayload {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Decode JWT token payload (client-side only, no verification)
 */
function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (e) {
    console.error('[API-FETCH] Failed to decode token:', e);
    return null;
  }
}

/**
 * Check if token is expired (with 10s leeway)
 */
function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  // exp is in seconds, Date.now() is in milliseconds
  const now = Date.now() / 1000;
  const leeway = 10; // 10 second safety margin
  return now > (payload.exp - leeway);
}

/**
 * Attempt to refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Include cookies if using httpOnly tokens
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('[API-FETCH] Token refresh failed with status:', response.status);
      // Clear auth on refresh failure
      authService.logout();
      return false;
    }

    const data = await response.json();
    if (data.accessToken) {
      // Store new token
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refresh_token', data.refreshToken);
        }
      }
      console.log('[API-FETCH] Token refreshed successfully');
      return true;
    }

    authService.logout();
    return false;
  } catch (error) {
    console.error('[API-FETCH] Token refresh error:', error);
    authService.logout();
    return false;
  }
}

/**
 * Global API fetch wrapper that handles token expiration and refresh
 * @param url - API endpoint URL (without domain)
 * @param options - Fetch options
 * @returns Promise<Response>
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null;

  // Check if token is expired before sending request
  if (token && isTokenExpired(token)) {
    console.log('[API-FETCH] Token expired, attempting refresh...');
    const refreshed = await refreshAccessToken();

    if (!refreshed) {
      // Refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Token refresh failed - redirecting to login');
    }

    // Get the new token after refresh
    const newToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null;

    if (!newToken) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('No token after refresh');
    }

    // Use the new token for this request
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${newToken}`,
    };
  } else if (token) {
    // Token is valid, use it
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Set default credentials
  if (options.credentials === undefined) {
    options.credentials = 'include';
  }

  // Make the actual request
  const response = await fetch(url, options);

  // If we get a 401, try to refresh and retry once
  if (response.status === 401) {
    console.log('[API-FETCH] Got 401, attempting single retry with refresh...');
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      const newToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('access_token')
          : null;

      if (newToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        };

        // Retry the request once
        return fetch(url, options);
      }
    }

    // Refresh failed or no new token
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  return response;
}

/**
 * Convenience wrapper for JSON API calls with automatic token handling
 */
export async function apiJSON<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const response = await apiFetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data?.message || data?.error || 'API request failed',
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('[API-FETCH] Request error:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}
