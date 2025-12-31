'use client'

import { Flex, Spinner, Text } from '@/components/green'
import { PageLayout } from '@/components/ui'
import { authService } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: number
  email: string
  username: string
  fullName: string
  role: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, _setLoading] = useState(true)
  const [error, _setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [router])

  // Redirect to role-specific dashboard pages when user is available
  useEffect(() => {
    if (!user) return
    const rolePath = user.role === 'CLIENT' ? 'client' : 'freelancer'
    router.replace(`/dashboard/${rolePath}`)
  }, [router, user])

  if (loading) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" min-height="50vh">
          <Spinner />
        </Flex>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" min-height="50vh">
          <Text font="body-regular-l" color="negative-01">{error}</Text>
        </Flex>
      </PageLayout>
    )
  }

  return null
}
