/**
 * Environment configuration for Designer Marketplace
 * Centralizes all environment variables with fallbacks and validation
 */

/**
 * Get environment variable with fallback and optional validation
 */
function getEnvVar(key: string, fallback: string, required = false): string {
  const value = process.env[key] || fallback

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

/**
 * Core API service URLs
 */
export const ENV = {
  // API endpoints
  API_URL: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:8080/api'),
  CONTENT_API_URL: getEnvVar('NEXT_PUBLIC_CONTENT_API_URL', 'http://localhost:8083/api/v1'),
  LMS_SERVICE_URL: getEnvVar('NEXT_PUBLIC_LMS_SERVICE_URL', 'http://localhost:8082/api'),

  // Dashboard URLs
  ADMIN_DASHBOARD_URL: getEnvVar('NEXT_PUBLIC_ADMIN_DASHBOARD_URL', 'http://localhost:3001'),
  APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3002'),

  // Feature flags
  ENABLE_ADMIN_FEATURES: getEnvVar('NEXT_PUBLIC_ENABLE_ADMIN_FEATURES', 'true') === 'true',
  ENABLE_LMS_FEATURES: getEnvVar('NEXT_PUBLIC_ENABLE_LMS_FEATURES', 'true') === 'true',

  // OAuth (optional)
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
} as const

/**
 * Validate that all required environment variables are set
 * Call this on app initialization
 */
export function validateEnv(): void {
  const requiredVars = [
    'NEXT_PUBLIC_API_URL',
  ]

  const missing = requiredVars.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.warn('Missing optional environment variables:', missing)
  }
}

/**
 * Check if we're in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Check if we're in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production'

/**
 * Check if we're running in browser
 */
export const isBrowser = typeof window !== 'undefined'
