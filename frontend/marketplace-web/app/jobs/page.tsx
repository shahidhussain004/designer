'use client';

import {
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Input,
  Spinner,
  Text,
} from '@/components/green';
import { PageLayout } from '@/components/layout';
import { parseCategories, parseExperienceLevels } from '@/lib/apiParsers';
import type { ExperienceLevel, JobCategory } from '@/lib/apiTypes';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

interface Job {
  id: string;
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    displayOrder: number;
  };
  experienceLevel: {
    id: number;
    name: string;
    code: string;
    description: string;
    yearsMin: number;
    yearsMax: number;
    displayOrder: number;
  };
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

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<ExperienceLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states - now using IDs
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [experienceLevelId, setExperienceLevelId] = useState(searchParams.get('experienceLevelId') || '');
  const [minBudget, setMinBudget] = useState(searchParams.get('minBudget') || '');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('maxBudget') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Fetch categories and experience levels on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catsResponse, levelsResponse] = await Promise.all([
          fetch('/api/job-categories'),
          fetch('/api/experience-levels')
        ]);
        
        if (catsResponse.ok) {
          const catsData = await catsResponse.json();
          const parsed = parseCategories(catsData);
          setCategories(parsed);
        }
        
        if (levelsResponse.ok) {
          const levelsData = await levelsResponse.json();
          const parsed = parseExperienceLevels(levelsData);
          setExperienceLevels(parsed);
        }
      } catch (err) {
        console.error('Failed to fetch filters:', err);
      }
    };
    
    fetchFilters();
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId);
      if (experienceLevelId) params.append('experienceLevelId', experienceLevelId);
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
  }, [categoryId, experienceLevelId, minBudget, maxBudget, searchQuery]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (experienceLevelId) params.append('experienceLevelId', experienceLevelId);
    if (minBudget) params.append('minBudget', minBudget);
    if (maxBudget) params.append('maxBudget', maxBudget);
    if (searchQuery) params.append('search', searchQuery);
    
    router.push(`/jobs?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setCategoryId('');
    setExperienceLevelId('');
    setMinBudget('');
    setMaxBudget('');
    setSearchQuery('');
    router.push('/jobs');
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
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>
                      {cat.name}
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
                  value={experienceLevelId}
                  onChange={(e) => setExperienceLevelId(e.target.value)}
                >
                  <option value="">All Levels</option>
                  {experienceLevels.map((level) => (
                    <option key={level.id} value={level.id.toString()}>
                      {level.name}
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
                          {job.category.name}
                        </Badge>
                        <Badge variant="information">
                          {job.experienceLevel.name}
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
