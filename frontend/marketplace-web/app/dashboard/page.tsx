'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/auth'
import { getDashboardData, ClientDashboard, FreelancerDashboard } from '@/lib/dashboard'
import { Flex, Grid, Card, Text, Div, Button, Spinner, Badge, Divider } from '@/components/green'
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

  if (!user || !dashboardData) {
    return null
  }

  return (
    <PageLayout>
      {/* Dashboard Header */}
      <Div background="brand-01" padding="l">
        <Flex 
          justify-content="space-between" 
          align-items="center"
          max-width="1280px"
          margin="0 auto"
          width="100%"
        >
          <Flex flex-direction="column" gap="xs">
            <Text font="heading-l" color="inversed">Dashboard</Text>
            <Text font="body-regular-m" color="inversed">
              Welcome back, {user.fullName || user.username}
            </Text>
          </Flex>
          <Button rank="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Div>

      {/* Main Content */}
      <Div padding="xl l" max-width="1280px" margin="0 auto" width="100%">
        {/* Profile Card */}
        <Card padding="l" variant="information" margin-bottom="l">
          <Flex flex-direction="column" gap="m">
            <Flex justify-content="space-between" align-items="center">
              <Text font="heading-m">Your Profile</Text>
              <Badge variant={user.role === 'FREELANCER' ? 'positive' : 'notice'}>
                {user.role}
              </Badge>
            </Flex>
            <Divider opacity="0.2" />
            <Grid columns="1; m{2}; l{4}" gap="m">
              <Div>
                <Text font="detail-regular-s" color="neutral-02">Full Name</Text>
                <Text font="body-regular-m">{user.fullName}</Text>
              </Div>
              <Div>
                <Text font="detail-regular-s" color="neutral-02">Username</Text>
                <Text font="body-regular-m">{user.username}</Text>
              </Div>
              <Div>
                <Text font="detail-regular-s" color="neutral-02">Email</Text>
                <Text font="body-regular-m">{user.email}</Text>
              </Div>
              <Div>
                <Text font="detail-regular-s" color="neutral-02">Role</Text>
                <Text font="body-regular-m">{user.role}</Text>
              </Div>
            </Grid>
          </Flex>
        </Card>

        {/* Role-Specific Dashboard */}
        {user.role === 'CLIENT' ? (
          <ClientDashboardContent data={dashboardData as ClientDashboard} />
        ) : (
          <FreelancerDashboardContent data={dashboardData as FreelancerDashboard} />
        )}
      </Div>
    </PageLayout>
  )
}

interface ClientDashboardProps {
  data: ClientDashboard
}

function ClientDashboardContent({ data }: ClientDashboardProps) {
  const { stats, activeJobs } = data

  return (
    <Flex flex-direction="column" gap="l">
      {/* Stats */}
      <Grid columns="1; m{3}" gap="m">
        <Card padding="l" variant="notice">
          <Flex flex-direction="column" gap="s">
            <Text font="detail-regular-s" color="neutral-02">Active Jobs</Text>
            <Text font="heading-xl">{stats.activeJobs || 0}</Text>
          </Flex>
        </Card>
        <Card padding="l" variant="information">
          <Flex flex-direction="column" gap="s">
            <Text font="detail-regular-s" color="neutral-02">Proposals Received</Text>
            <Text font="heading-xl">{stats.totalProposalsReceived || 0}</Text>
          </Flex>
        </Card>
        <Card padding="l" variant="positive">
          <Flex flex-direction="column" gap="s">
            <Text font="detail-regular-s" color="neutral-02">Completed Jobs</Text>
            <Text font="heading-xl">{stats.completedJobs || 0}</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Active Jobs */}
      <Card padding="l" variant="information">
        <Flex justify-content="space-between" align-items="center" margin-bottom="m">
          <Flex flex-direction="column" gap="xs">
            <Text font="heading-m">Your Active Jobs</Text>
            <Text font="body-regular-s" color="neutral-02">Jobs you have posted</Text>
          </Flex>
          <Link href="/jobs/create">
            <Button rank="primary" size="small">Post New Job</Button>
          </Link>
        </Flex>
        <Divider opacity="0.2" />
        {activeJobs.length === 0 ? (
          <Div padding="l">
            <Text font="body-regular-m" color="neutral-02">No active jobs.</Text>
          </Div>
        ) : (
          <Flex flex-direction="column">
            {activeJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' } as any}>
                <Div padding="m" border-width="0 0 4xs 0" border-color="subtle-01">
                  <Flex justify-content="space-between" align-items="flex-start">
                    <Flex flex-direction="column" gap="xs" flex="1">
                      <Text font="body-medium-m">{job.title}</Text>
                      <Text font="body-regular-s" color="neutral-02">
                        {job.description.substring(0, 100)}...
                      </Text>
                      <Text font="detail-regular-s" color="neutral-02">
                        {job.proposalCount} proposals
                      </Text>
                    </Flex>
                    <Text font="heading-s" color="brand-01">${job.budget}</Text>
                  </Flex>
                </Div>
              </Link>
            ))}
          </Flex>
        )}
      </Card>
    </Flex>
  )
}

interface FreelancerDashboardProps {
  data: FreelancerDashboard
}

function FreelancerDashboardContent({ data }: FreelancerDashboardProps) {
  const { stats, availableJobs } = data

  return (
    <Flex flex-direction="column" gap="l">
      {/* Stats */}
      <Grid columns="1; m{3}" gap="m">
        <Card padding="l" variant="notice">
          <Flex flex-direction="column" gap="s">
            <Text font="detail-regular-s" color="neutral-02">Proposals Submitted</Text>
            <Text font="heading-xl">{stats.proposalsSubmitted || 0}</Text>
          </Flex>
        </Card>
        <Card padding="l" variant="information">
          <Flex flex-direction="column" gap="s">
            <Text font="detail-regular-s" color="neutral-02">Proposals Accepted</Text>
            <Text font="heading-xl">{stats.proposalsAccepted || 0}</Text>
          </Flex>
        </Card>
        <Card padding="l" variant="positive">
          <Flex flex-direction="column" gap="s">
            <Text font="detail-regular-s" color="neutral-02">Completed Projects</Text>
            <Text font="heading-xl">{stats.completedProjects || 0}</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Available Jobs */}
      <Card padding="l" variant="information">
        <Flex justify-content="space-between" align-items="center" margin-bottom="m">
          <Flex flex-direction="column" gap="xs">
            <Text font="heading-m">Available Jobs</Text>
            <Text font="body-regular-s" color="neutral-02">
              Browse and apply for jobs that match your skills
            </Text>
          </Flex>
          <Link href="/jobs" style={{ textDecoration: 'none' } as any}>
            <Text font="body-regular-m" color="brand-01">View All →</Text>
          </Link>
        </Flex>
        <Divider opacity="0.2" />
        {availableJobs.length === 0 ? (
          <Div padding="l">
            <Text font="body-regular-m" color="neutral-02">No jobs available at the moment.</Text>
          </Div>
        ) : (
          <Flex flex-direction="column">
            {availableJobs.slice(0, 5).map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' } as any}>
                <Div padding="m" border-width="0 0 4xs 0" border-color="subtle-01">
                  <Flex justify-content="space-between" align-items="flex-start">
                    <Flex flex-direction="column" gap="xs" flex="1">
                      <Text font="body-medium-m">{job.title}</Text>
                      <Text font="body-regular-s" color="neutral-02">
                        {job.description.substring(0, 100)}...
                      </Text>
                      <Flex gap="s">
                        <Badge variant="information">{job.category}</Badge>
                        <Badge variant="information">{job.experienceLevel}</Badge>
                      </Flex>
                    </Flex>
                    <Flex flex-direction="column" align-items="flex-end" gap="s">
                      <Text font="heading-s" color="brand-01">${job.budget}</Text>
                      <Button rank="primary" size="small">View &amp; Propose</Button>
                    </Flex>
                  </Flex>
                </Div>
              </Link>
            ))}
          </Flex>
        )}
      </Card>
    </Flex>
  )
}
