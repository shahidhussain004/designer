"use client"

import { Badge, Button, Card, Divider, Flex, Grid, Spinner, Text } from '@/components/green'
import { PageLayout } from '@/components/ui'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Review {
  id: number
  rating: number
  comment: string
  authorName: string
  createdAt: string
}

interface FreelancerProfile {
  id: number
  username: string
  fullName: string
  email: string
  bio?: string
  profileImageUrl?: string
  location?: string
  hourlyRate?: number
  skills?: string[]
  portfolioUrl?: string
  phone?: string
  ratingAvg?: number
  ratingCount?: number
  completionRate?: number
  createdAt?: string
  reviews?: Review[]
}

export default function FreelancerProfilePage() {
  const params = useParams()
  const freelancerId = params.id as string
  const [profile, setProfile] = useState<FreelancerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfile()
  }, [freelancerId])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${freelancerId}/profile`)
      if (!response.ok) {
        throw new Error('Failed to load profile')
      }
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" style={{ minHeight: '400px' }}>
          <Spinner />
        </Flex>
      </PageLayout>
    )
  }

  if (error || !profile) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" style={{ minHeight: '400px' }}>
          <Card padding="xl">
            <Flex flex-direction="column" align-items="center" gap="m">
              <Text font-size="heading-s">Profile Not Found</Text>
              <Text font-size="body-l" color="neutral-02">{error || 'Unable to load profile'}</Text>
              <Link href="/talents">
                <Button>Browse Other Talent</Button>
              </Link>
            </Flex>
          </Card>
        </Flex>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l">
        {/* Hero Section with Profile Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '2rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Flex gap="l" align-items="start">
            {/* Avatar */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              flexShrink: 0,
              border: '3px solid rgba(255,255,255,0.3)'
            }}>
              {profile.fullName?.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <Flex flex-direction="column" gap="m" style={{ flex: 1 }}>
              <div>
                <Text font-size="heading-l" style={{ color: 'white', marginBottom: '0.5rem' }}>
                  {profile.fullName}
                </Text>
                <Text font-size="body-l" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  @{profile.username}
                </Text>
              </div>

              <Flex gap="m" align-items="center">
                {profile.location && (
                  <Text font-size="body-l" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    📍 {profile.location}
                  </Text>
                )}
                {typeof profile.ratingAvg !== 'undefined' && (
                  <Flex align-items="center" gap="s">
                    <Text font-size="heading-xs" style={{ color: 'white' }}>
                      ⭐ {profile.ratingAvg.toFixed(1)}
                    </Text>
                    <Text font-size="body-s" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      ({profile.ratingCount} reviews)
                    </Text>
                  </Flex>
                )}
              </Flex>

              <Flex gap="l" align-items="center">
                {profile.hourlyRate && (
                  <div>
                    <Text font-size="body-s" style={{ color: 'rgba(255,255,255,0.7)' }}>Hourly Rate</Text>
                    <Text font-size="heading-s" style={{ color: 'white' }}>
                      ${profile.hourlyRate}/hr
                    </Text>
                  </div>
                )}
                {typeof profile.completionRate !== 'undefined' && (
                  <div>
                    <Text font-size="body-s" style={{ color: 'rgba(255,255,255,0.7)' }}>Job Success</Text>
                    <Text font-size="heading-s" style={{ color: 'white' }}>
                      {profile.completionRate}%
                    </Text>
                  </div>
                )}
              </Flex>
            </Flex>

            {/* Action Button */}
            <Flex flex-direction="column" gap="m" style={{ justifyContent: 'flex-start' }}>
              <Button style={{ whiteSpace: 'nowrap' }}>
                Contact Freelancer
              </Button>
              <Link href={`/portfolio/${profile.id}`}>
                <Button rank="secondary" style={{ whiteSpace: 'nowrap' }}>
                  View Portfolio
                </Button>
              </Link>
            </Flex>
          </Flex>
        </div>

        {/* Main Content Grid */}
        <Grid columns="3" gap="l">
          {/* Left Column - Bio & Skills */}
          <Flex flex-direction="column" gap="l" style={{ gridColumn: '1 / 3' }}>
            {/* Bio Section */}
            {profile.bio && (
              <Card padding="l">
                <Flex flex-direction="column" gap="m">
                  <Text font-size="heading-s">About</Text>
                  <Text font-size="body-l" color="neutral-02">
                    {profile.bio}
                  </Text>
                </Flex>
              </Card>
            )}

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <Card padding="l">
                <Flex flex-direction="column" gap="m">
                  <Text font-size="heading-s">Skills & Expertise</Text>
                  <Flex gap="m" style={{ flexWrap: 'wrap' }}>
                    {profile.skills.map((skill, idx) => (
                      <Badge key={idx} variant="information">
                        {skill}
                      </Badge>
                    ))}
                  </Flex>
                </Flex>
              </Card>
            )}

            {/* Contact Info */}
            <Card padding="l">
              <Flex flex-direction="column" gap="m">
                <Text font-size="heading-s">Contact Information</Text>
                <Flex flex-direction="column" gap="s">
                  {profile.email && (
                    <Flex gap="m">
                      <Text font-size="body-s" color="neutral-02" style={{ minWidth: '80px' }}>
                        Email:
                      </Text>
                      <Text font-size="body-l">{profile.email}</Text>
                    </Flex>
                  )}
                  {profile.phone && (
                    <Flex gap="m">
                      <Text font-size="body-s" color="neutral-02" style={{ minWidth: '80px' }}>
                        Phone:
                      </Text>
                      <Text font-size="body-l">{profile.phone}</Text>
                    </Flex>
                  )}
                  {profile.portfolioUrl && (
                    <Flex gap="m">
                      <Text font-size="body-s" color="neutral-02" style={{ minWidth: '80px' }}>
                        Website:
                      </Text>
                      <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <Text font-size="body-l" style={{ color: '#667eea' }}>
                          {profile.portfolioUrl}
                        </Text>
                      </a>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </Card>
          </Flex>

          {/* Right Column - Stats */}
          <Flex flex-direction="column" gap="l">
            <Card padding="l">
              <Flex flex-direction="column" gap="m">
                <Text font-size="heading-s">Statistics</Text>
                <Divider />
                <Flex flex-direction="column" gap="m">
                  <Flex justify-content="space-between" align-items="center">
                    <Text font-size="body-l" color="neutral-02">Member Since</Text>
                    <Text font-size="body-l" font-weight="bold">
                      {profile.createdAt ? new Date(profile.createdAt).getFullYear() : 'N/A'}
                    </Text>
                  </Flex>
                  <Divider />
                  <Flex justify-content="space-between" align-items="center">
                    <Text font-size="body-l" color="neutral-02">Job Success</Text>
                    <Text font-size="body-l" font-weight="bold">
                      {profile.completionRate || 0}%
                    </Text>
                  </Flex>
                  <Divider />
                  <Flex justify-content="space-between" align-items="center">
                    <Text font-size="body-l" color="neutral-02">Rating</Text>
                    <Text font-size="body-l" font-weight="bold">
                      {profile.ratingAvg ? profile.ratingAvg.toFixed(1) : 'No ratings'}/5
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            {/* Quick Actions */}
            <Card padding="l">
              <Flex flex-direction="column" gap="m">
                <Button style={{ width: '100%' }}>
                  Send Message
                </Button>
                <Button rank="secondary" style={{ width: '100%' }}>
                  Save Profile
                </Button>
              </Flex>
            </Card>
          </Flex>
        </Grid>

        {/* Reviews Section */}
        {profile.reviews && profile.reviews.length > 0 && (
          <Card padding="l">
            <Flex flex-direction="column" gap="m">
              <Text font-size="heading-s">Reviews ({profile.reviews.length})</Text>
              <Divider />
              <Flex flex-direction="column" gap="m">
                {profile.reviews.map(review => (
                  <Flex key={review.id} flex-direction="column" gap="s">
                    <Flex justify-content="space-between" align-items="start">
                      <Flex flex-direction="column" gap="s">
                        <Text font-size="body-l" font-weight="bold">
                          {review.authorName}
                        </Text>
                        <Text font-size="body-s" color="neutral-02">
                          ⭐ {review.rating}/5
                        </Text>
                      </Flex>
                      <Text font-size="body-s" color="neutral-02">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Text>
                    </Flex>
                    <Text font-size="body-l">{review.comment}</Text>
                    <Divider />
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Card>
        )}

        {/* Navigation */}
        <Flex gap="m" justify-content="center" padding="l">
          <Link href="/talents">
            <Button rank="tertiary">← Back to Talent List</Button>
          </Link>
        </Flex>
      </Flex>
    </PageLayout>
  )
}
