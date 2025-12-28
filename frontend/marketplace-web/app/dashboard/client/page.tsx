"use client"

import { Button, Card, Div, Divider, Flex, Grid, Spinner, Text } from '@/components/green'
import { PageLayout } from '@/components/layout'
import { authService } from '@/lib/auth'
import { ClientDashboard, getDashboardData } from '@/lib/dashboard'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ClientDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<ClientDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    const load = async () => {
      try {
        const d = await getDashboardData()
        setData(d as ClientDashboard)
      } catch (err) {
        console.error(err)
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  if (loading) return (
    <PageLayout>
      <Flex justify-content="center" align-items="center" min-height="50vh"><Spinner /></Flex>
    </PageLayout>
  )

  if (error || !data) return (
    <PageLayout>
      <Flex justify-content="center" align-items="center" min-height="50vh"><Text color="negative-01">{error || 'No data'}</Text></Flex>
    </PageLayout>
  )

  const { stats, activeJobs } = data

  return (
    <PageLayout>
      <Div background="brand-01" padding="l">
        <Flex justify-content="space-between" align-items="center" max-width="1280px" margin="0 auto" width="100%">
          <Flex flex-direction="column" gap="xs">
            <Text font="heading-l" color="inversed">Client Dashboard</Text>
            <Text font="body-regular-m" color="inversed">Welcome back</Text>
          </Flex>
        </Flex>
      </Div>

      <Div padding="xl l" max-width="1280px" margin="0 auto" width="100%">
        <Flex flex-direction="column" gap="l">
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
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <Div padding="m" border-width="0 0 4xs 0" border-color="subtle-01">
                      <Flex justify-content="space-between" align-items="flex-start">
                        <Flex flex-direction="column" gap="xs" flex="1">
                          <Text font="body-medium-m">{job.title}</Text>
                          <Text font="body-regular-s" color="neutral-02">{job.description.substring(0, 100)}...</Text>
                          <Text font="detail-regular-s" color="neutral-02">{job.proposalCount} proposals</Text>
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
      </Div>
    </PageLayout>
  )
}