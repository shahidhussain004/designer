'use client'

import { PageLayout } from '@/components/ui'
import { authService } from '@/lib/auth'
import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, refreshUser } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      console.log('[Dashboard] checkAuth called, user:', user, 'loading:', loading);
      
      // IMPORTANT: Try both context state AND localStorage to handle different timing scenarios
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
      if (currentUser.role === 'COMPANY') {
        console.log('[Dashboard] Redirecting to /dashboard/company');
        router.replace('/dashboard/company')
      } else if (currentUser.role === 'FREELANCER') {
        console.log('[Dashboard] Redirecting to /dashboard/freelancer');
        router.replace('/dashboard/freelancer')
      } else if (currentUser.role === 'ADMIN') {
        console.log('[Dashboard] Redirecting to admin app');
        // Pass auth token via cookie (shared across ports on localhost). More secure than URL parameters.
        const token = localStorage.getItem('access_token');
        if (token) {
          // Set a short-lived cookie accessible on localhost for port 3001
          const expires = new Date(Date.now() + 15 * 60 * 1000).toUTCString(); // 15 minutes
          // Domain is omitted because browsers ignore Domain=localhost; this keeps it valid for both ports on localhost
          document.cookie = `admin_access_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Expires=${expires}`;
        }
        window.location.href = 'http://localhost:3001';
      }
    }
    
    // Check immediately if we already have user in context
    if (user) {
      checkAuth()
      return
    }
    
    // If not loading, also check (handles both authenticated and unauthenticated)
    if (!loading) {
      checkAuth()
      return
    }
    
    // If still loading, wait a bit then check anyway (prevent infinite loading)
    const timer = setTimeout(() => {
      console.log('[Dashboard] Timeout waiting for auth, checking anyway');
      checkAuth()
    }, 3000)
    
    return () => clearTimeout(timer)
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
