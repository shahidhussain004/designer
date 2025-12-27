'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Grid,
  Flex,
  Card,
  Text,
  Button,
  Input,
  Badge,
  Spinner,
  Divider,
} from '@/components/green';
import { PageLayout } from '@/components/layout';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  experienceLevel: string;
  budget: number;
  status: string;
  createdAt: string;
  client: {
    id: number;
    username: string;
    fullName: string;
    profileImageUrl: string | null;
    location: string | null;
    ratingAvg: number;
    ratingCount: number;
  };
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'WEB_DESIGN', label: 'Web Design' },
  { value: 'GRAPHIC_DESIGN', label: 'Graphic Design' },
  { value: 'UI_UX', label: 'UI/UX Design' },
  { value: 'BRANDING', label: 'Branding' },
  { value: 'ILLUSTRATION', label: 'Illustration' },
  { value: 'MOTION_GRAPHICS', label: 'Motion Graphics' },
  { value: 'LOGO_DESIGN', label: 'Logo Design' },
  { value: 'PRINT_DESIGN', label: 'Print Design' },
  { value: 'PACKAGING', label: 'Packaging' },
  { value: 'PHOTOGRAPHY', label: 'Photography' },
  { value: 'VIDEO_EDITING', label: 'Video Editing' },
  { value: '3D_MODELING', label: '3D Modeling' },
  { value: 'ANIMATION', label: 'Animation' },
  { value: 'MOBILE_DESIGN', label: 'Mobile Design' },
  { value: 'PRODUCT_DESIGN', label: 'Product Design' },
];

const experienceLevels = [
  { value: '', label: 'All Levels' },
  { value: 'ENTRY', label: 'Entry' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'EXPERT', label: 'Expert' },
];

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || '');
  const [minBudget, setMinBudget] = useState(searchParams.get('minBudget') || '');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('maxBudget') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (experienceLevel) params.append('experienceLevel', experienceLevel);
      if (minBudget) params.append('minBudget', minBudget);
      if (maxBudget) params.append('maxBudget', maxBudget);
      if (searchQuery) params.append('search', searchQuery);
      
      const queryString = params.toString();
      const url = queryString ? `/api/jobs?${queryString}` : '/api/jobs';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data.content || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [category, experienceLevel, minBudget, maxBudget, searchQuery]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (experienceLevel) params.append('experienceLevel', experienceLevel);
    if (minBudget) params.append('minBudget', minBudget);
    if (maxBudget) params.append('maxBudget', maxBudget);
    if (searchQuery) params.append('search', searchQuery);
    
    router.push(`/jobs?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setCategory('');
    setExperienceLevel('');
    setMinBudget('');
    setMaxBudget('');
    setSearchQuery('');
    router.push('/jobs');
  };

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  const getExperienceLabel = (value: string) => {
    return experienceLevels.find(e => e.value === value)?.label || value;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l">
        {/* Page Header */}
        <Flex flex-direction="column" gap="s">
          <Text tag="h1" font-size="heading-l">
            Browse Jobs
          </Text>
          <Text color="secondary">
            Find your next design opportunity from our curated job listings
          </Text>
        </Flex>

        {/* Search Bar */}
        <Card padding="m" variant="information">
          <Flex gap="m" align-items="flex-end">
            <Flex flex="1">
              <Input
                label="Search Jobs"
                value={searchQuery}
                onInput={(e: Event) => setSearchQuery((e.target as HTMLInputElement).value)}
              />
            </Flex>
            <Button onClick={handleApplyFilters}>
              Search
            </Button>
          </Flex>
        </Card>

        <Grid columns="1; m{4}" gap="l">
          {/* Filters Sidebar */}
          <Card padding="l">
            <Flex flex-direction="column" gap="m">
              <Text tag="h3" font-size="heading-s">
                Filters
              </Text>
              
              <Divider />

              {/* Category Filter */}
              <Flex flex-direction="column" gap="xs">
                <Text font-size="body-s" font-weight="book">
                  Category
                </Text>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </Flex>

              {/* Experience Level Filter */}
              <Flex flex-direction="column" gap="xs">
                <Text font-size="body-s" font-weight="book">
                  Experience Level
                </Text>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </Flex>

              {/* Budget Range */}
              <Flex flex-direction="column" gap="xs">
                <Text font-size="body-s" font-weight="book">
                  Budget Range
                </Text>
                <Flex gap="s">
                  <Input
                    label="Min"
                    type="number"
                    value={minBudget}
                    onInput={(e: Event) => setMinBudget((e.target as HTMLInputElement).value)}
                  />
                  <Input
                    label="Max"
                    type="number"
                    value={maxBudget}
                    onInput={(e: Event) => setMaxBudget((e.target as HTMLInputElement).value)}
                  />
                </Flex>
              </Flex>

              <Divider />

              {/* Filter Actions */}
              <Flex flex-direction="column" gap="s">
                <Button onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
                <Button rank="secondary" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </Flex>
            </Flex>
          </Card>

          {/* Jobs List */}
          <Flex flex-direction="column" gap="m">
            {loading ? (
              <Flex justify-content="center" padding="xl">
                <Spinner />
              </Flex>
            ) : error ? (
              <Card padding="l" variant="negative">
                <Text color="negative">{error}</Text>
              </Card>
            ) : jobs.length === 0 ? (
              <Card padding="xl">
                <Flex flex-direction="column" align-items="center" gap="m">
                  <Text font-size="heading-s" color="secondary">
                    No jobs found
                  </Text>
                  <Text color="secondary">
                    Try adjusting your filters or search query
                  </Text>
                  <Button rank="secondary" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </Flex>
              </Card>
            ) : (
              <>
                <Text font-size="body-s" color="secondary">
                  Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                </Text>
                
                {jobs.map((job) => (
                  <Card key={job.id} padding="l">
                    <Flex flex-direction="column" gap="m">
                      <Flex justify-content="space-between" align-items="flex-start">
                        <Flex flex-direction="column" gap="xs">
                          <Text tag="h3" font-size="heading-s">
                            {job.title}
                          </Text>
                          <Text font-size="body-s" color="secondary">
                            Posted by {job.client.fullName} • {formatDate(job.createdAt)}
                          </Text>
                        </Flex>
                        <Text font-size="heading-s" color="positive">
                          ${job.budget.toLocaleString()}
                        </Text>
                      </Flex>

                      <Text>
                        {job.description.length > 200
                          ? `${job.description.substring(0, 200)}...`
                          : job.description}
                      </Text>

                      <Flex gap="s" align-items="center">
                        <Badge variant="notice">
                          {getCategoryLabel(job.category)}
                        </Badge>
                        <Badge variant="information">
                          {getExperienceLabel(job.experienceLevel)}
                        </Badge>
                        <Badge variant={job.status === 'OPEN' ? 'positive' : 'information'}>
                          {job.status}
                        </Badge>
                      </Flex>

                      <Divider />

                      <Flex justify-content="flex-end">
                        <Button
                          rank="secondary"
                          onClick={() => router.push(`/jobs/${job.id}`)}
                        >
                          View Details
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </>
            )}
          </Flex>
        </Grid>
      </Flex>
    </PageLayout>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsPageContent />
    </Suspense>
  );
}
