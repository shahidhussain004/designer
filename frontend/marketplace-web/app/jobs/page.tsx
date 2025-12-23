'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GdsGrid,
  GdsFlex,
  GdsCard,
  GdsText,
  GdsButton,
  GdsInput,
  GdsBadge,
  GdsSpinner,
  GdsDivider,
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
  employer: {
    id: string;
    name: string;
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
];

const experienceLevels = [
  { value: '', label: 'All Levels' },
  { value: 'BEGINNER', label: 'Beginner' },
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
      
      const response = await fetch(`/api/jobs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data.jobs || []);
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
      <GdsFlex flex-direction="column" gap="l" padding="l">
        {/* Page Header */}
        <GdsFlex flex-direction="column" gap="s">
          <GdsText tag="h1" font-size="heading-l">
            Browse Jobs
          </GdsText>
          <GdsText color="secondary">
            Find your next design opportunity from our curated job listings
          </GdsText>
        </GdsFlex>

        {/* Search Bar */}
        <GdsCard padding="m" variant="information">
          <GdsFlex gap="m" align-items="flex-end">
            <GdsFlex flex="1">
              <GdsInput
                label="Search Jobs"
                value={searchQuery}
                onInput={(e: Event) => setSearchQuery((e.target as HTMLInputElement).value)}
              />
            </GdsFlex>
            <GdsButton onClick={handleApplyFilters}>
              Search
            </GdsButton>
          </GdsFlex>
        </GdsCard>

        <GdsGrid columns="1; m{4}" gap="l">
          {/* Filters Sidebar */}
          <GdsCard padding="l">
            <GdsFlex flex-direction="column" gap="m">
              <GdsText tag="h3" font-size="heading-s">
                Filters
              </GdsText>
              
              <GdsDivider />

              {/* Category Filter */}
              <GdsFlex flex-direction="column" gap="xs">
                <GdsText font-size="body-s" font-weight="book">
                  Category
                </GdsText>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid var(--gds-color-l3-border-primary)',
                    backgroundColor: 'var(--gds-color-l3-background-primary)',
                    color: 'var(--gds-color-l3-content-primary)',
                    fontSize: '0.875rem',
                    width: '100%',
                  } as any}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </GdsFlex>

              {/* Experience Level Filter */}
              <GdsFlex flex-direction="column" gap="xs">
                <GdsText font-size="body-s" font-weight="book">
                  Experience Level
                </GdsText>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid var(--gds-color-l3-border-primary)',
                    backgroundColor: 'var(--gds-color-l3-background-primary)',
                    color: 'var(--gds-color-l3-content-primary)',
                    fontSize: '0.875rem',
                    width: '100%',
                  } as any}
                >
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </GdsFlex>

              {/* Budget Range */}
              <GdsFlex flex-direction="column" gap="xs">
                <GdsText font-size="body-s" font-weight="book">
                  Budget Range
                </GdsText>
                <GdsFlex gap="s">
                  <GdsInput
                    label="Min"
                    type="number"
                    value={minBudget}
                    onInput={(e: Event) => setMinBudget((e.target as HTMLInputElement).value)}
                  />
                  <GdsInput
                    label="Max"
                    type="number"
                    value={maxBudget}
                    onInput={(e: Event) => setMaxBudget((e.target as HTMLInputElement).value)}
                  />
                </GdsFlex>
              </GdsFlex>

              <GdsDivider />

              {/* Filter Actions */}
              <GdsFlex flex-direction="column" gap="s">
                <GdsButton onClick={handleApplyFilters}>
                  Apply Filters
                </GdsButton>
                <GdsButton rank="secondary" onClick={handleClearFilters}>
                  Clear Filters
                </GdsButton>
              </GdsFlex>
            </GdsFlex>
          </GdsCard>

          {/* Jobs List */}
          <GdsFlex flex-direction="column" gap="m" style={{ gridColumn: 'span 3' } as any}>
            {loading ? (
              <GdsFlex justify-content="center" padding="xl">
                <GdsSpinner />
              </GdsFlex>
            ) : error ? (
              <GdsCard padding="l" variant="negative">
                <GdsText color="negative">{error}</GdsText>
              </GdsCard>
            ) : jobs.length === 0 ? (
              <GdsCard padding="xl">
                <GdsFlex flex-direction="column" align-items="center" gap="m">
                  <GdsText font-size="heading-s" color="secondary">
                    No jobs found
                  </GdsText>
                  <GdsText color="secondary">
                    Try adjusting your filters or search query
                  </GdsText>
                  <GdsButton rank="secondary" onClick={handleClearFilters}>
                    Clear All Filters
                  </GdsButton>
                </GdsFlex>
              </GdsCard>
            ) : (
              <>
                <GdsText font-size="body-s" color="secondary">
                  Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                </GdsText>
                
                {jobs.map((job) => (
                  <GdsCard key={job.id} padding="l">
                    <GdsFlex flex-direction="column" gap="m">
                      <GdsFlex justify-content="space-between" align-items="flex-start">
                        <GdsFlex flex-direction="column" gap="xs">
                          <GdsText tag="h3" font-size="heading-s">
                            {job.title}
                          </GdsText>
                          <GdsText font-size="body-s" color="secondary">
                            Posted by {job.employer.name} • {formatDate(job.createdAt)}
                          </GdsText>
                        </GdsFlex>
                        <GdsText font-size="heading-s" color="positive">
                          ${job.budget.toLocaleString()}
                        </GdsText>
                      </GdsFlex>

                      <GdsText>
                        {job.description.length > 200
                          ? `${job.description.substring(0, 200)}...`
                          : job.description}
                      </GdsText>

                      <GdsFlex gap="s" align-items="center">
                        <GdsBadge variant="notice">
                          {getCategoryLabel(job.category)}
                        </GdsBadge>
                        <GdsBadge variant="information">
                          {getExperienceLabel(job.experienceLevel)}
                        </GdsBadge>
                        <GdsBadge variant={job.status === 'OPEN' ? 'positive' : 'information'}>
                          {job.status}
                        </GdsBadge>
                      </GdsFlex>

                      <GdsDivider />

                      <GdsFlex justify-content="flex-end">
                        <GdsButton
                          rank="secondary"
                          onClick={() => router.push(`/jobs/${job.id}`)}
                        >
                          View Details
                        </GdsButton>
                      </GdsFlex>
                    </GdsFlex>
                  </GdsCard>
                ))}
              </>
            )}
          </GdsFlex>
        </GdsGrid>
      </GdsFlex>
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
