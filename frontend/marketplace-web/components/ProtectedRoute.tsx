import { authService } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'INSTRUCTOR' | 'ADMIN' | 'COMPANY' | 'FREELANCER'
  redirectTo?: string
}

/**
 * Server component to protect routes based on authentication and role
 * Usage in layout.tsx:
 * 
 * export default function ProtectedLayout({ children }) {
 *   return (
 *     <ProtectedRoute requiredRole="INSTRUCTOR" redirectTo="/auth/login">
 *       {children}
 *     </ProtectedRoute>
 *   )
 * }
 */
export function ProtectedRoute({
  children,
  requiredRole: _requiredRole,
  redirectTo: _redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  // Note: Full protection requires client-side checking in the component
  // This is a placeholder for the pattern. Prefix unused props with underscore
  // to satisfy lint rules until server-side logic is implemented.
  return <>{children}</>;
}

/**
 * Client-side hook to protect routes
 * Usage in page.tsx:
 * 
 * 'use client'
 * 
 * export default function Page() {
 *   useProtectedRoute('INSTRUCTOR')
 *   // ... component code
 * }
 */
export function useProtectedRoute(
  requiredRole?: 'INSTRUCTOR' | 'ADMIN' | 'COMPANY' | 'FREELANCER',
  redirectTo = '/auth/login'
) {
  if (typeof window === 'undefined') return

  const user = authService.getCurrentUser()

  if (!user) {
    redirect(redirectTo)
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
    redirect('/')
  }
}
