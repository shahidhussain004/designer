'use client'

import { PageLayout } from '@/components/ui'
import { authService } from '@/lib/auth'
import { useAuth } from '@/lib/context/AuthContext'
import { ENV } from '@/lib/env'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Generic dashboard router - redirects to role-specific dashboards.
 * This page should rarely be hit now that login redirects directly to role-specific dashboards.
 * Kept as a fallback for any direct /dashboard links.
 */
export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Don't do anything while auth is loading
    if (loading) return

    // If no user, get from localStorage as fallback
    let currentUser = user
    if (!currentUser && authService.isAuthenticated()) {
      currentUser = authService.getCurrentUser()
    }
    
    // Not authenticated - redirect to login
    if (!currentUser) {
      router.replace('/auth/login')
      return
    }

    // Redirect to role-specific dashboard
    if (currentUser.role === 'COMPANY') {
      router.replace('/dashboard/company')
    } else if (currentUser.role === 'FREELANCER') {
      router.replace('/dashboard/freelancer')
    } else if (currentUser.role === 'ADMIN') {
      // Set cookie for admin dashboard on different port
      const token = localStorage.getItem('access_token')
      if (token) {
        const expires = new Date(Date.now() + 15 * 60 * 1000).toUTCString()
        document.cookie = `admin_access_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Expires=${expires}`
      }
      window.location.href = ENV.ADMIN_DASHBOARD_URL
    }
  }, [loading, user, router])

  // Show loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-secondary-700">Loading your account…</p>
        </div>
      </PageLayout>
    )
  }

  // Show fallback while redirect happens
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-secondary-700 mb-8">Redirecting to your dashboard…</p>
      </div>
    </PageLayout>
  )
}
