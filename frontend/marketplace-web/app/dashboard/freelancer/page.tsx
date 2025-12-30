"use client"

import { Badge, Button, Card, Div, Divider, Flex, Grid, Spinner, Text } from '@/components/green'
import { PageLayout } from '@/components/layout'
import { authService } from '@/lib/auth'
import { FreelancerDashboard, getDashboardData } from '@/lib/dashboard'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function FreelancerDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<FreelancerDashboard | null>(null)
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
        setData(d as FreelancerDashboard)
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

  const { stats, availableJobs } = data

  return (
    <PageLayout>
      <Div background="brand-01" padding="l">
        <Flex justify-content="space-between" align-items="center" max-width="1280px" margin="0 auto" width="100%">
          <Flex flex-direction="column" gap="xs">
            <Text font="heading-l" color="inversed">Freelancer Dashboard</Text>
            <Text font="body-regular-m" color="inversed">Welcome back</Text>
          </Flex>
        </Flex>
      </Div>

      <Div padding="xl l" max-width="1280px" margin="0 auto" width="100%">
        <Flex flex-direction="column" gap="l">
          {/* Quick Navigation */}
          <Card padding="l">
            <Flex flex-direction="column" gap="m">
                <Text font-size="heading-s">Quick Access</Text>
              <Grid columns="1; m{4}" gap="m">
                <Link href={`/portfolio/${authService.getCurrentUser()?.id}`}>
                  <Card padding="m" variant="information" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <Flex flex-direction="column" gap="s" align-items="center">
                      <Text font-size="heading-l">📁</Text>
                      <Text font-size="body-regular-m" text-align="center">Portfolio</Text>
                      <Text font-size="body-regular-s" color="neutral-02" text-align="center">Manage your work</Text>
                    </Flex>
                  </Card>
                </Link>
                <Link href="/dashboard/freelancer/reviews">
                  <Card padding="m" variant="information" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <Flex flex-direction="column" gap="s" align-items="center">
                      <Text font-size="heading-l">⭐</Text>
                      <Text font-size="body-regular-m" text-align="center">Reviews</Text>
                      <Text font-size="body-regular-s" color="neutral-02" text-align="center">Client feedback</Text>
                    </Flex>
                  </Card>
                </Link>
                <Link href="/dashboard/freelancer/time-tracking">
                  <Card padding="m" variant="information" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <Flex flex-direction="column" gap="s" align-items="center">
                      <Text font-size="heading-l">⏱️</Text>
                      <Text font-size="body-regular-m" text-align="center">Time Tracking</Text>
                      <Text font-size="body-regular-s" color="neutral-02" text-align="center">Log your hours</Text>
                    </Flex>
                  </Card>
                </Link>
                <Link href="/dashboard/freelancer/contracts">
                  <Card padding="m" variant="information" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <Flex flex-direction="column" gap="s" align-items="center">
                      <Text font-size="heading-l">📋</Text>
                      <Text font-size="body-regular-m" text-align="center">Contracts</Text>
                      <Text font-size="body-regular-s" color="neutral-02" text-align="center">Active agreements</Text>
                    </Flex>
                  </Card>
                </Link>
              </Grid>
            </Flex>
          </Card>

          {/* Stats Cards */}
          <Grid columns="1; m{3}" gap="m">
            <Card padding="l" variant="notice">
              <Flex flex-direction="column" gap="s">
                  <Text font-size="detail-regular-s" color="neutral-02">Proposals Submitted</Text>
                <Text font-size="heading-l">{stats.proposalsSubmitted || 0}</Text>
              </Flex>
            </Card>
            <Card padding="l" variant="information">
              <Flex flex-direction="column" gap="s">
                <Text font-size="detail-regular-s" color="neutral-02">Proposals Accepted</Text>
                <Text font-size="heading-l">{stats.proposalsAccepted || 0}</Text>
              </Flex>
            </Card>
            <Card padding="l" variant="positive">
              <Flex flex-direction="column" gap="s">
                <Text font-size="detail-regular-s" color="neutral-02">Completed Projects</Text>
                <Text font-size="heading-l">{stats.completedProjects || 0}</Text>
              </Flex>
            </Card>
          </Grid>

          <Card padding="l" variant="information">
            <Flex justify-content="space-between" align-items="center" margin-bottom="m">
              <Flex flex-direction="column" gap="xs">
                <Text font-size="heading-s">Available Jobs</Text>
                <Text font-size="body-regular-s" color="neutral-02">Browse and apply for jobs that match your skills</Text>
              </Flex>
                <Link href="/jobs">
                <Text font-size="body-regular-m" color="brand-01">View All →</Text>
              </Link>
            </Flex>
            <Divider opacity="0.2" />
            {availableJobs.length === 0 ? (
                <Div padding="l">
                <Text font-size="body-regular-m" color="neutral-02">No jobs available at the moment.</Text>
              </Div>
            ) : (
              <Flex flex-direction="column">
                {availableJobs.slice(0, 5).map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <Div padding="m" border-width="0 0 4xs 0" border-color="subtle-01">
                      <Flex justify-content="space-between" align-items="flex-start">
                        <Flex flex-direction="column" gap="xs" flex="1">
                          <Text font-size="body-regular-m">{job.title}</Text>
                          <Text font-size="body-regular-s" color="neutral-02">{job.description.substring(0, 100)}...</Text>
                          <Flex gap="s">
                            <Badge variant="information">{typeof job.category === 'string' ? job.category : job.category?.name}</Badge>
                            <Badge variant="information">{typeof job.experienceLevel === 'string' ? job.experienceLevel : job.experienceLevel?.name}</Badge>
                          </Flex>
                        </Flex>
                        <Flex flex-direction="column" align-items="flex-end" gap="s">
                          <Text font-size="heading-s" color="brand-01">${job.budget}</Text>
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
      </Div>
    </PageLayout>
  )
}