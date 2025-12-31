"use client"

import { Badge, Button, Card, Divider, Flex, Grid, Input, Spinner, Text } from '@/components/green'
import { PageLayout } from '@/components/ui'
import { apiClient } from '@/lib/api-client'
import logger from '@/lib/logger'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Freelancer {
  id: number
  username: string
  fullName: string
  bio?: string
  profileImageUrl?: string
  location?: string
  hourlyRate?: number
  skills?: string[]
  ratingAvg?: number
  ratingCount?: number
  completionRate?: number
  portfolioItems?: {
    id: number
    title: string
    imageUrl?: string
  }[]
}

export default function TalentsPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')

  useEffect(() => {
    loadFreelancers()
  }, [])

  const loadFreelancers = async () => {
    try {
      // Call the new public freelancers endpoint (returns a paged response)
      const { data } = await apiClient.get('/users/freelancers?page=0&size=50')

      // Paged response shape: { content: [...], totalElements, totalPages, number }
      const items = data?.content || []

      const normalized: Freelancer[] = (items || []).map((u: any) => ({
        id: u.id,
        username: u.username,
        fullName: u.full_name || u.fullName || u.fullName,
        bio: u.bio,
        profileImageUrl: u.profile_image_url || u.profileImageUrl,
        location: u.location,
        hourlyRate: u.hourly_rate || u.hourlyRate,
        skills: u.skills || [],
        ratingAvg: u.rating_avg || u.ratingAvg,
        ratingCount: u.rating_count || u.ratingCount,
        completionRate: u.completion_rate || u.completionRate,
        portfolioItems: u.portfolio_items ? u.portfolio_items.map((p: any) => ({ id: p.id, title: p.title, imageUrl: p.image_url || p.imageUrl })) : [],
      }))

      setFreelancers(normalized)
    } catch (err) {
      logger.error('Failed to load freelancers', err as Error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFreelancers = freelancers.filter(freelancer => {
    if (searchQuery && !freelancer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !freelancer.bio?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    if (skillFilter && !freelancer.skills?.some(skill => 
      skill.toLowerCase().includes(skillFilter.toLowerCase())
    )) {
      return false
    }

    if (minRate && freelancer.hourlyRate && freelancer.hourlyRate < parseInt(minRate)) {
      return false
    }

    if (maxRate && freelancer.hourlyRate && freelancer.hourlyRate > parseInt(maxRate)) {
      return false
    }

    return true
  })

  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l">
        {/* Header */}
        <div>
          <Text font-size="heading-l">Find Top Talent</Text>
          <Text font-size="body-l" color="neutral-02">Browse and hire experienced freelancers for your projects</Text>
        </div>

        {/* Filters */}
        <Card padding="m">
          <Flex flex-direction="column" gap="m">
            <Text font-size="heading-xs">Search & Filters</Text>
            
            <Grid columns="4" gap="m">
              <Input
                placeholder="Search by name or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <Input
                placeholder="Filter by skill (e.g., React)"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              />
              
              <Input
                type="number"
                placeholder="Min hourly rate"
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
              />
              
              <Input
                type="number"
                placeholder="Max hourly rate"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
              />
            </Grid>

            {(searchQuery || skillFilter || minRate || maxRate) && (
              <Flex gap="s">
                <Text font-size="body-s" color="neutral-02">Showing {filteredFreelancers.length} results</Text>
                <Button 
                  rank="tertiary" 
                  size="small"
                  onClick={() => {
                    setSearchQuery('')
                    setSkillFilter('')
                    setMinRate('')
                    setMaxRate('')
                  }}
                >
                  Clear filters
                </Button>
              </Flex>
            )}
          </Flex>
        </Card>

        {/* Results */}
        {loading ? (
          <Flex justify-content="center" padding="xl">
            <Spinner />
          </Flex>
        ) : filteredFreelancers.length === 0 ? (
          <Card padding="xl">
            <Flex flex-direction="column" align-items="center" gap="m">
              <Text font-size="heading-s">No freelancers found</Text>
              <Text font-size="body-l" color="neutral-02">Try adjusting your filters</Text>
            </Flex>
          </Card>
        ) : (
          <Flex flex-direction="column" gap="m">
            {filteredFreelancers.map(freelancer => (
              <Card key={freelancer.id} padding="l">
                <Flex gap="l">
                  {/* Avatar */}
                  <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '8px', 
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#666',
                    flexShrink: 0
                  }}>
                    {freelancer.fullName?.charAt(0).toUpperCase()}
                  </div>

                  {/* Main Content */}
                  <Flex flex-direction="column" gap="m" style={{ flex: 1 }}>
                    {/* Header */}
                    <Flex justify-content="space-between" align-items="start">
                      <div>
                        <Text font-size="heading-s">{freelancer.fullName}</Text>
                        <Text font-size="body-s" color="neutral-02">@{freelancer.username}</Text>
                        {freelancer.location && (
                          <Text font-size="body-s" color="neutral-02">📍 {freelancer.location}</Text>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {freelancer.hourlyRate && (
                          <Text font-size="heading-xs">${freelancer.hourlyRate}/hr</Text>
                        )}
                        {typeof freelancer.ratingAvg !== 'undefined' && (
                          <Text font-size="body-s" color="neutral-02">
                            ⭐ {freelancer.ratingAvg.toFixed(1)} ({freelancer.ratingCount} reviews)
                          </Text>
                        )}
                      </div>
                    </Flex>

                    {/* Bio */}
                    {freelancer.bio && (
                      <Text font-size="body-l">{freelancer.bio}</Text>
                    )}

                    {/* Skills */}
                    {freelancer.skills && freelancer.skills.length > 0 && (
                      <Flex gap="s" style={{ flexWrap: 'wrap' }}>
                        {freelancer.skills.map((skill, idx) => (
                          <Badge key={idx} variant="information">{skill}</Badge>
                        ))}
                      </Flex>
                    )}

                    {/* Portfolio Preview */}
                    {freelancer.portfolioItems && freelancer.portfolioItems.length > 0 && (
                      <div>
                        <Text font-size="body-s" color="neutral-02" style={{ marginBottom: '0.5rem' }}>
                          Recent Work
                        </Text>
                        <Flex gap="m">
                          {freelancer.portfolioItems.slice(0, 3).map(item => (
                            <div 
                              key={item.id}
                              style={{
                                width: '120px',
                                height: '80px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                color: '#666',
                                textAlign: 'center',
                                padding: '8px'
                              }}
                            >
                              {item.title}
                            </div>
                          ))}
                        </Flex>
                      </div>
                    )}

                    <Divider />

                    {/* Actions */}
                    <Flex gap="m" justify-content="space-between" align-items="center">
                      <Flex gap="m">
                        {typeof freelancer.completionRate !== 'undefined' && (
                          <Text font-size="body-s" color="neutral-02">
                            {freelancer.completionRate}% Job Success
                          </Text>
                        )}
                      </Flex>
                      <Flex gap="m">
                        <Link href={`/portfolio/${freelancer.id}`}>
                          <Button rank="secondary" size="small">
                            View Portfolio
                          </Button>
                        </Link>
                        <Link href={`/freelancers/${freelancer.id}`}>
                          <Button size="small">
                            View Profile
                          </Button>
                        </Link>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        )}
      </Flex>
    </PageLayout>
  )
}
