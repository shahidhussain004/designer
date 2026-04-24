/**
 * Authentication redirect utilities
 * Handles smart redirects after login/registration
 */

import { ENV } from './env'

export interface RedirectOptions {
  userRole: 'COMPANY' | 'FREELANCER' | 'ADMIN'
  redirectPath?: string | null
}

/**
 * Get the default dashboard path for a user role
 */
export function getDefaultDashboard(role: 'COMPANY' | 'FREELANCER' | 'ADMIN'): string {
  switch (role) {
    case 'COMPANY':
      return '/dashboard/company'
    case 'FREELANCER':
      return '/dashboard/freelancer'
    case 'ADMIN':
      return ENV.ADMIN_DASHBOARD_URL // Admin dashboard on separate port
    default:
      return '/dashboard'
  }
}

/**
 * Get the redirect target after successful authentication
 * Priority: 
 * 1. Redirect query parameter (if valid)
 * 2. Role-specific dashboard
 */
export function getAuthRedirectTarget(options: RedirectOptions): string {
  const { userRole, redirectPath } = options

  // Use redirect param if provided and not a login/register page
  if (redirectPath && 
      redirectPath !== '/auth/login' && 
      redirectPath !== '/auth/register' &&
      redirectPath !== '/') {
    return redirectPath
  }

  // Default to role-specific dashboard
  return getDefaultDashboard(userRole)
}

/**
 * Check if a redirect path is safe (not an external URL or auth page)
 */
export function isSafeRedirect(path: string | null | undefined): boolean {
  if (!path) return false
  
  // Must start with / (internal path)
  if (!path.startsWith('/')) return false
  
  // Don't redirect back to auth pages
  if (path === '/auth/login' || path === '/auth/register') return false
  
  // Don't redirect to root (use dashboard instead)
  if (path === '/') return false
  
  return true
}
