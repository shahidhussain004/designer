'use client'

import { PageLayout } from '@/components/ui'
import { authService } from '@/lib/auth'
import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      console.log('[Dashboard] checkAuth called, user:', user, 'loading:', loading);
      // Check both context state AND localStorage+token to handle race conditions
      let currentUser = user
      
      // If context doesn't have user but localStorage does, and token is valid, use localStorage
      if (!currentUser && authService.isAuthenticated()) {
        currentUser = authService.getCurrentUser()
        console.log('[Dashboard] Got user from localStorage:', currentUser);
      }
      
      if (!currentUser) {
        // Not authenticated — redirect to login
        console.log('[Dashboard] No user found, redirecting to login');
        router.replace('/auth/login')
        return
      }

      // Role-based redirect
      console.log('[Dashboard] User role:', currentUser.role);
      if (currentUser.role === 'CLIENT') {
        console.log('[Dashboard] Redirecting to /dashboard/client');
        router.replace('/dashboard/client')
      } else if (currentUser.role === 'FREELANCER') {
        console.log('[Dashboard] Redirecting to /dashboard/freelancer');
        router.replace('/dashboard/freelancer')
      } else if (currentUser.role === 'ADMIN') {
        console.log('[Dashboard] Redirecting to admin app');
        window.location.href = 'http://localhost:3001'
      }
    }
    
    // Call once after initial context load, then on context changes
    if (!loading) {
      checkAuth()
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-700">Loading your account…</p>
        </div>
      </PageLayout>
    )
  }

  // If we reach here, user is authenticated but role redirect will happen in useEffect.
  // Show a brief fallback while replace() runs.
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-700 mb-8">Redirecting to your dashboard…</p>
      </div>
    </PageLayout>
  )
}
