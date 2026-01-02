"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { Button, Card, Divider, Flex, Grid, Text } from '@/components/green'
import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import { useUserPortfolio, useUserProfile } from '@/hooks/useUsers'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface PortfolioItem {
  id: number
  title: string
  description: string
  imageUrl: string
  projectUrl?: string
  technologies: string[]
  completionDate?: string
  isVisible: boolean
}

interface Freelancer {
  id: number
  fullName: string
  username: string
  bio?: string
  profileImageUrl?: string
  hourlyRate?: number
  ratingAvg?: number
  ratingCount?: number
}

export default function FreelancerPortfolioPage() {
  const params = useParams()
  const freelancerId = params.id as string

  const { data: freelancerData, isLoading: profileLoading, isError: profileError, error: profileErrorMsg, refetch: refetchProfile } = useUserProfile(freelancerId)
  const { data: portfolioData = [], isLoading: portfolioLoading, isError: portfolioError, error: portfolioErrorMsg, refetch: refetchPortfolio } = useUserPortfolio(parseInt(freelancerId))

  const freelancer = freelancerData as Freelancer | undefined
  const portfolio = portfolioData as PortfolioItem[]

  const loading = profileLoading || portfolioLoading
  const error = profileError || portfolioError
  const errorMessage = profileErrorMsg?.message || portfolioErrorMsg?.message

  if (loading) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" style={{ minHeight: '400px' }}>
          <LoadingSpinner />
        </Flex>
      </PageLayout>
    )
  }

  if (error || !freelancer) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" style={{ minHeight: '400px' }}>
          <ErrorMessage 
            message={errorMessage || 'Failed to load portfolio'} 
            retry={() => {
              refetchProfile()
              refetchPortfolio()
            }}
          />
        </Flex>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l">
        {/* Header Section */}
        <div>
          {/* Breadcrumb & Navigation */}
          <Flex gap="m" align-items="center" style={{ marginBottom: '1.5rem' }}>
            <Link href="/talents">
              <Button rank="tertiary" size="small">← Back to Talent</Button>
            </Link>
            <Text font-size="body-s" color="neutral-02">/</Text>
            <Link href={`/freelancers/${freelancer.id}`}>
              <Button rank="tertiary" size="small">View Profile</Button>
            </Link>
          </Flex>

          {/* Page Title */}
          <Flex gap="m" align-items="start">
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '12px',
              backgroundColor: '#667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              flexShrink: 0
            }}>
              {freelancer.fullName?.charAt(0).toUpperCase()}
            </div>
            <Flex flex-direction="column" gap="s" style={{ flex: 1 }}>
              <Text font-size="heading-l">{freelancer.fullName}&rsquo;s Portfolio</Text>
              <Text font-size="body-l" color="neutral-02">
                @{freelancer.username}
              </Text>
              {(freelancer.hourlyRate || freelancer.ratingAvg) && (
                <Flex gap="l" align-items="center">
                  {freelancer.hourlyRate && (
                    <Text font-size="body-l">💰 ${freelancer.hourlyRate}/hr</Text>
                  )}
                  {typeof freelancer.ratingAvg !== 'undefined' && (
                    <Text font-size="body-l">
                      ⭐ {freelancer.ratingAvg.toFixed(1)} ({freelancer.ratingCount} reviews)
                    </Text>
                  )}
                </Flex>
              )}
            </Flex>
          </Flex>
        </div>

        <Divider />

        {/* Portfolio Content */}
        {portfolio.length === 0 ? (
          <Card padding="xl">
            <Flex flex-direction="column" align-items="center" gap="m">
              <Text font-size="heading-s">No Portfolio Items</Text>
              <Text font-size="body-l" color="neutral-02">
                This freelancer has not added any portfolio items yet
              </Text>
            </Flex>
          </Card>
        ) : (
          <Flex flex-direction="column" gap="l">
            {/* Portfolio Grid */}
            <Grid columns="2" gap="l">
              {portfolio.map(item => (
                <Card key={item.id} padding="0" style={{ overflow: 'hidden' }}>
                  {/* Image Section */}
                  <div style={{
                    width: '100%',
                    height: '250px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    fontSize: '14px',
                    color: '#999',
                    textAlign: 'center',
                    padding: '1rem'
                  }}>
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        onError={() => {}}
                      />
                    )}
                  </div>

                  {/* Content Section */}
                  <div style={{ padding: '1.5rem' }}>
                    <Flex flex-direction="column" gap="m">
                      {/* Title */}
                      <Text font-size="heading-s">{item.title}</Text>

                      {/* Description */}
                      <Text font-size="body-l" color="neutral-02" style={{ lineHeight: '1.6' }}>
                        {item.description}
                      </Text>

                      {/* Technologies */}
                      {item.technologies && item.technologies.length > 0 && (
                        <Flex gap="s" style={{ flexWrap: 'wrap' }}>
                          {item.technologies.map((tech, idx) => (
                            <div
                              key={idx}
                              style={{
                                padding: '0.35rem 0.75rem',
                                backgroundColor: '#667eea20',
                                borderRadius: '20px',
                                fontSize: '0.875rem',
                                color: '#667eea',
                                fontWeight: 500
                              }}
                            >
                              {tech}
                            </div>
                          ))}
                        </Flex>
                      )}

                      {/* Metadata */}
                      {item.completionDate && (
                        <Text font-size="body-s" color="neutral-02">
                          📅 Completed: {new Date(item.completionDate).toLocaleDateString()}
                        </Text>
                      )}

                      <Divider />

                      {/* Actions */}
                      {item.projectUrl && (
                        <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                          <Button rank="secondary" style={{ width: '100%' }}>
                            View Live Project →
                          </Button>
                        </a>
                      )}
                    </Flex>
                  </div>
                </Card>
              ))}
            </Grid>
          </Flex>
        )}

        {/* Bottom CTA */}
        <Card padding="l" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Flex justify-content="space-between" align-items="center">
            <Flex flex-direction="column" gap="s">
              <Text font-size="heading-s" style={{ color: 'white' }}>
                Impressed by this work?
              </Text>
              <Text font-size="body-l" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Hire {freelancer.fullName} for your next project
              </Text>
            </Flex>
            <Flex gap="m">
              <Link href={`/freelancers/${freelancer.id}`}>
                <Button rank="secondary">View Profile</Button>
              </Link>
              <Button style={{ whiteSpace: 'nowrap' }}>
                Contact Freelancer
              </Button>
            </Flex>
          </Flex>
        </Card>

        {/* Footer Navigation */}
        <Flex gap="m" justify-content="center" padding="l">
          <Link href="/talents">
            <Button rank="tertiary">← Browse More Talent</Button>
          </Link>
        </Flex>
      </Flex>
    </PageLayout>
  )
}
