'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/auth'
import { getDashboardData, ClientDashboard, FreelancerDashboard } from '@/lib/dashboard'
import { GdsFlex, GdsGrid, GdsCard, GdsText, GdsDiv, GdsButton, GdsSpinner, GdsBadge, GdsDivider } from '@sebgroup/green-core/react'
import { PageLayout } from '@/components/layout'

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
  const [dashboardData, setDashboardData] = useState<ClientDashboard | FreelancerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return

      try {
        const data = await getDashboardData()
        setDashboardData(data)
      } catch (err) {
        console.error('Error fetching dashboard:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [user])

  const handleLogout = () => {
    authService.logout()
    router.push('/')
  }

  if (loading) {
    return (
      <PageLayout>
        <GdsFlex justify-content="center" align-items="center" min-height="50vh">
          <GdsSpinner />
        </GdsFlex>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <GdsFlex justify-content="center" align-items="center" min-height="50vh">
          <GdsText font="body-regular-l" color="negative-01">{error}</GdsText>
        </GdsFlex>
      </PageLayout>
    )
  }

  if (!user || !dashboardData) {
    return null
  }

  return (
    <PageLayout>
      {/* Dashboard Header */}
      <GdsDiv background="brand-01" padding="l">
        <GdsFlex 
          justify-content="space-between" 
          align-items="center"
          max-width="1280px"
          margin="0 auto"
          width="100%"
        >
          <GdsFlex flex-direction="column" gap="xs">
            <GdsText font="heading-l" color="inversed">Dashboard</GdsText>
            <GdsText font="body-regular-m" color="inversed">
              Welcome back, {user.fullName || user.username}
            </GdsText>
          </GdsFlex>
          <GdsButton rank="secondary" onClick={handleLogout}>
            Logout
          </GdsButton>
        </GdsFlex>
      </GdsDiv>

      {/* Main Content */}
      <GdsDiv padding="xl l" max-width="1280px" margin="0 auto" width="100%">
        {/* Profile Card */}
        <GdsCard padding="l" variant="information" margin-bottom="l">
          <GdsFlex flex-direction="column" gap="m">
            <GdsFlex justify-content="space-between" align-items="center">
              <GdsText font="heading-m">Your Profile</GdsText>
              <GdsBadge variant={user.role === 'FREELANCER' ? 'positive' : 'notice'}>
                {user.role}
              </GdsBadge>
            </GdsFlex>
            <GdsDivider opacity="0.2" />
            <GdsGrid columns="1; m{2}; l{4}" gap="m">
              <GdsDiv>
                <GdsText font="detail-regular-s" color="neutral-02">Full Name</GdsText>
                <GdsText font="body-regular-m">{user.fullName}</GdsText>
              </GdsDiv>
              <GdsDiv>
                <GdsText font="detail-regular-s" color="neutral-02">Username</GdsText>
                <GdsText font="body-regular-m">{user.username}</GdsText>
              </GdsDiv>
              <GdsDiv>
                <GdsText font="detail-regular-s" color="neutral-02">Email</GdsText>
                <GdsText font="body-regular-m">{user.email}</GdsText>
              </GdsDiv>
              <GdsDiv>
                <GdsText font="detail-regular-s" color="neutral-02">Role</GdsText>
                <GdsText font="body-regular-m">{user.role}</GdsText>
              </GdsDiv>
            </GdsGrid>
          </GdsFlex>
        </GdsCard>

        {/* Role-Specific Dashboard */}
        {user.role === 'CLIENT' ? (
          <ClientDashboardContent data={dashboardData as ClientDashboard} />
        ) : (
          <FreelancerDashboardContent data={dashboardData as FreelancerDashboard} />
        )}
      </GdsDiv>
    </PageLayout>
  )
}

interface ClientDashboardProps {
  data: ClientDashboard
}

function ClientDashboardContent({ data }: ClientDashboardProps) {
  const { stats, activeJobs } = data

  return (
    <GdsFlex flex-direction="column" gap="l">
      {/* Stats */}
      <GdsGrid columns="1; m{3}" gap="m">
        <GdsCard padding="l" variant="notice">
          <GdsFlex flex-direction="column" gap="s">
            <GdsText font="detail-regular-s" color="neutral-02">Active Jobs</GdsText>
            <GdsText font="heading-xl">{stats.activeJobs || 0}</GdsText>
          </GdsFlex>
        </GdsCard>
        <GdsCard padding="l" variant="information">
          <GdsFlex flex-direction="column" gap="s">
            <GdsText font="detail-regular-s" color="neutral-02">Proposals Received</GdsText>
            <GdsText font="heading-xl">{stats.totalProposalsReceived || 0}</GdsText>
          </GdsFlex>
        </GdsCard>
        <GdsCard padding="l" variant="positive">
          <GdsFlex flex-direction="column" gap="s">
            <GdsText font="detail-regular-s" color="neutral-02">Completed Jobs</GdsText>
            <GdsText font="heading-xl">{stats.completedJobs || 0}</GdsText>
          </GdsFlex>
        </GdsCard>
      </GdsGrid>

      {/* Active Jobs */}
      <GdsCard padding="l" variant="information">
        <GdsFlex justify-content="space-between" align-items="center" margin-bottom="m">
          <GdsFlex flex-direction="column" gap="xs">
            <GdsText font="heading-m">Your Active Jobs</GdsText>
            <GdsText font="body-regular-s" color="neutral-02">Jobs you have posted</GdsText>
          </GdsFlex>
          <Link href="/jobs/create">
            <GdsButton rank="primary" size="small">Post New Job</GdsButton>
          </Link>
        </GdsFlex>
        <GdsDivider opacity="0.2" />
        {activeJobs.length === 0 ? (
          <GdsDiv padding="l">
            <GdsText font="body-regular-m" color="neutral-02">No active jobs.</GdsText>
          </GdsDiv>
        ) : (
          <GdsFlex flex-direction="column">
            {activeJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' } as any}>
                <GdsDiv padding="m" border-width="0 0 4xs 0" border-color="subtle-01">
                  <GdsFlex justify-content="space-between" align-items="flex-start">
                    <GdsFlex flex-direction="column" gap="xs" flex="1">
                      <GdsText font="body-medium-m">{job.title}</GdsText>
                      <GdsText font="body-regular-s" color="neutral-02">
                        {job.description.substring(0, 100)}...
                      </GdsText>
                      <GdsText font="detail-regular-s" color="neutral-02">
                        {job.proposalCount} proposals
                      </GdsText>
                    </GdsFlex>
                    <GdsText font="heading-s" color="brand-01">${job.budget}</GdsText>
                  </GdsFlex>
                </GdsDiv>
              </Link>
            ))}
          </GdsFlex>
        )}
      </GdsCard>
    </GdsFlex>
  )
}

interface FreelancerDashboardProps {
  data: FreelancerDashboard
}

function FreelancerDashboardContent({ data }: FreelancerDashboardProps) {
  const { stats, availableJobs } = data

  return (
    <GdsFlex flex-direction="column" gap="l">
      {/* Stats */}
      <GdsGrid columns="1; m{3}" gap="m">
        <GdsCard padding="l" variant="notice">
          <GdsFlex flex-direction="column" gap="s">
            <GdsText font="detail-regular-s" color="neutral-02">Proposals Submitted</GdsText>
            <GdsText font="heading-xl">{stats.proposalsSubmitted || 0}</GdsText>
          </GdsFlex>
        </GdsCard>
        <GdsCard padding="l" variant="information">
          <GdsFlex flex-direction="column" gap="s">
            <GdsText font="detail-regular-s" color="neutral-02">Proposals Accepted</GdsText>
            <GdsText font="heading-xl">{stats.proposalsAccepted || 0}</GdsText>
          </GdsFlex>
        </GdsCard>
        <GdsCard padding="l" variant="positive">
          <GdsFlex flex-direction="column" gap="s">
            <GdsText font="detail-regular-s" color="neutral-02">Completed Projects</GdsText>
            <GdsText font="heading-xl">{stats.completedProjects || 0}</GdsText>
          </GdsFlex>
        </GdsCard>
      </GdsGrid>

      {/* Available Jobs */}
      <GdsCard padding="l" variant="information">
        <GdsFlex justify-content="space-between" align-items="center" margin-bottom="m">
          <GdsFlex flex-direction="column" gap="xs">
            <GdsText font="heading-m">Available Jobs</GdsText>
            <GdsText font="body-regular-s" color="neutral-02">
              Browse and apply for jobs that match your skills
            </GdsText>
          </GdsFlex>
          <Link href="/jobs" style={{ textDecoration: 'none' } as any}>
            <GdsText font="body-regular-m" color="brand-01">View All →</GdsText>
          </Link>
        </GdsFlex>
        <GdsDivider opacity="0.2" />
        {availableJobs.length === 0 ? (
          <GdsDiv padding="l">
            <GdsText font="body-regular-m" color="neutral-02">No jobs available at the moment.</GdsText>
          </GdsDiv>
        ) : (
          <GdsFlex flex-direction="column">
            {availableJobs.slice(0, 5).map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' } as any}>
                <GdsDiv padding="m" border-width="0 0 4xs 0" border-color="subtle-01">
                  <GdsFlex justify-content="space-between" align-items="flex-start">
                    <GdsFlex flex-direction="column" gap="xs" flex="1">
                      <GdsText font="body-medium-m">{job.title}</GdsText>
                      <GdsText font="body-regular-s" color="neutral-02">
                        {job.description.substring(0, 100)}...
                      </GdsText>
                      <GdsFlex gap="s">
                        <GdsBadge variant="information">{job.category}</GdsBadge>
                        <GdsBadge variant="information">{job.experienceLevel}</GdsBadge>
                      </GdsFlex>
                    </GdsFlex>
                    <GdsFlex flex-direction="column" align-items="flex-end" gap="s">
                      <GdsText font="heading-s" color="brand-01">${job.budget}</GdsText>
                      <GdsButton rank="primary" size="small">View &amp; Propose</GdsButton>
                    </GdsFlex>
                  </GdsFlex>
                </GdsDiv>
              </Link>
            ))}
          </GdsFlex>
        )}
      </GdsCard>
    </GdsFlex>
  )
}
