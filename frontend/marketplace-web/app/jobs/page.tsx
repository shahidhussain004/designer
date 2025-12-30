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

type ViewMode = 'list' | 'grid' | 'compact';
type SortBy = 'recent' | 'budget-high' | 'budget-low';

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
  
  // View and Sort states
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [filtersOpen, setFiltersOpen] = useState(true);
  
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

  // Sort jobs based on selection
  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case 'budget-high':
        return b.budget - a.budget;
      case 'budget-low':
        return a.budget - b.budget;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Count active filters
  const activeFilterCount = [categoryId, experienceLevelId, minBudget, maxBudget, searchQuery].filter(Boolean).length;

  // Render job card based on view mode
  const renderJobCard = (job: Job) => {
    switch (viewMode) {
      case 'compact':
        return (
          <Card key={job.id} padding="m" className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/jobs/${job.id}`)}>
            <Flex justify-content="space-between" align-items="flex-start" gap="m">
              <Flex flex-direction="column" gap="xs" flex="1">
                <Text tag="h4" font-size="body-l" font-weight="book">
                  {job.title}
                </Text>
                <Text font-size="body-s" color="secondary">
                  {job.client.fullName} • {job.category.name}
                </Text>
              </Flex>
              <Flex flex-direction="column" gap="xs" align-items="flex-end">
                <Text font-size="body-l" font-weight="book" color="positive">
                  ${job.budget.toLocaleString()}
                </Text>
                <Badge variant={job.status === 'OPEN' ? 'positive' : 'information'} className="text-xs">
                  {job.status}
                </Badge>
              </Flex>
            </Flex>
          </Card>
        );

      case 'list':
        return (
          <Card key={job.id} padding="l" className="hover:shadow-md transition-shadow">
            <Flex flex-direction="column" gap="m">
              <Flex justify-content="space-between" align-items="flex-start">
                <Flex flex-direction="column" gap="xs" flex="1">
                  <Text tag="h3" font-size="heading-s" className="cursor-pointer hover:text-primary-600 transition-colors" onClick={() => router.push(`/jobs/${job.id}`)}>
                    {job.title}
                  </Text>
                  <Text font-size="body-s" color="secondary">
                    Posted by {job.client.fullName} • {formatDate(job.createdAt)}
                  </Text>
                </Flex>
                <Text font-size="heading-s" color="positive" className="whitespace-nowrap ml-4">
                  ${job.budget.toLocaleString()}
                </Text>
              </Flex>

              <Text className="line-clamp-2 text-secondary-700">
                {job.description.length > 250
                  ? `${job.description.substring(0, 250)}...`
                  : job.description}
              </Text>

              <Flex gap="s" align-items="center" className="flex-wrap">
                <Badge variant="notice">{job.category.name}</Badge>
                <Badge variant="information">{job.experienceLevel.name}</Badge>
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
                  View Details →
                </Button>
              </Flex>
            </Flex>
          </Card>
        );

      case 'grid':
      default:
        return (
          <Card key={job.id} padding="l" className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform" onClick={() => router.push(`/jobs/${job.id}`)}>
            <Flex flex-direction="column" gap="m" flex="1">
              <Flex flex-direction="column" gap="xs" flex="1">
                <Badge variant="notice" className="w-fit">{job.category.name}</Badge>
                <Text tag="h4" font-size="heading-s" className="line-clamp-2">
                  {job.title}
                </Text>
                <Text font-size="body-s" color="secondary">
                  {job.client.fullName}
                </Text>
              </Flex>

              <Text className="line-clamp-3 text-sm text-secondary-600">
                {job.description}
              </Text>

              <Divider />

              <Flex flex-direction="column" gap="s">
                <Flex justify-content="space-between" align-items="center">
                  <Text font-size="body-s" color="secondary">
                    Budget
                  </Text>
                  <Text font-size="body-l" font-weight="book" color="positive">
                    ${job.budget.toLocaleString()}
                  </Text>
                </Flex>
                <Flex justify-content="space-between" align-items="center">
                  <Text font-size="body-s" color="secondary">
                    Level
                  </Text>
                  <Text font-size="body-s">{job.experienceLevel.name}</Text>
                </Flex>
              </Flex>

              <Flex gap="s" align-items="center" className="mt-auto pt-2">
                <Badge variant={job.status === 'OPEN' ? 'positive' : 'information'} className="flex-1 text-center">
                  {job.status}
                </Badge>
                <Text font-size="body-xs" color="secondary" className="whitespace-nowrap">
                  {formatDate(job.createdAt)}
                </Text>
              </Flex>
            </Flex>
          </Card>
        );
    }
  };

  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l" className="max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <Flex flex-direction="column" gap="s">
          <Text tag="h1" font-size="heading-l">
            ✨ Find Your Next Work
          </Text>
          <Text color="secondary" font-size="body-l">
            Discover curated opportunities matched to your expertise
          </Text>
        </Flex>

        {/* Search Bar */}
        <Card padding="m" variant="information" className="shadow-sm">
          <Flex gap="m" align-items="flex-end">
            <Flex flex="1">
              <Input
                label="Search by job title, skills, or keywords"
                value={searchQuery}
                onInput={(e: Event) => setSearchQuery((e.target as HTMLInputElement).value)}
                placeholder="e.g., Logo Design, Web Development..."
              />
            </Flex>
            <Button onClick={handleApplyFilters} className="whitespace-nowrap">
              🔍 Search
            </Button>
          </Flex>
        </Card>

        {/* View Controls Bar */}
        <Card padding="m" className="border-secondary-200">
          <Flex justify-content="space-between" align-items="center" className="flex-wrap gap-4">
            {/* Left: Filter Toggle and Count */}
            <Flex align-items="center" gap="m">
              <Button
                rank="secondary"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden"
              >
                {filtersOpen ? '✕ Hide' : '⊞ Show'} Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
              <Text font-size="body-s" color="secondary" className="hidden lg:block">
                Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                {activeFilterCount > 0 && ` • ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied`}
              </Text>
            </Flex>

            {/* Center: Sort Dropdown */}
            <Flex gap="s" align-items="center">
              <Text font-size="body-s" color="secondary" className="hidden sm:block">
                Sort by:
              </Text>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="recent">📅 Most Recent</option>
                <option value="budget-high">💰 Highest Budget</option>
                <option value="budget-low">💵 Lowest Budget</option>
              </select>
            </Flex>

            {/* Right: View Mode Toggle */}
            <Flex gap="xs" className="border border-secondary-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
                title="List View"
              >
                ≡ List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
                title="Grid View"
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
                title="Compact View"
              >
                ≣ Compact
              </button>
            </Flex>
          </Flex>
        </Card>

        {/* Outer grid: sidebar (1) + content (2) on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters Sidebar (left) */}
          {filtersOpen && (
            <Card padding="l" className="col-span-1 lg:col-span-1 h-fit sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto">
              <Flex flex-direction="column" gap="m">
                <Text tag="h3" font-size="heading-s">
                  🎯 Filters
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
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
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
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
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
                  <Flex gap="s" flex-direction="column">
                    <Input
                      label="Min Budget"
                      type="number"
                      value={minBudget}
                      onInput={(e: Event) => setMinBudget((e.target as HTMLInputElement).value)}
                      placeholder="Min"
                    />
                    <Input
                      label="Max Budget"
                      type="number"
                      value={maxBudget}
                      onInput={(e: Event) => setMaxBudget((e.target as HTMLInputElement).value)}
                      placeholder="Max"
                    />
                  </Flex>
                </Flex>

                <Divider />

                {/* Filter Actions */}
                <Flex flex-direction="column" gap="s">
                  <Button onClick={handleApplyFilters} className="w-full">
                    ✓ Apply Filters
                  </Button>
                  {activeFilterCount > 0 && (
                    <Button rank="secondary" onClick={handleClearFilters} className="w-full">
                      ✕ Clear All
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Card>
          )}

          {/* Jobs List/Grid (right) */}
          <Flex flex-direction="column" gap="m" className="col-span-1 lg:col-span-2">
            {loading ? (
              <Flex justify-content="center" padding="xl" className="min-h-96">
                <Spinner />
              </Flex>
            ) : error ? (
              <Card padding="l" variant="negative">
                <Flex flex-direction="column" gap="m" align-items="center">
                  <Text color="negative" font-weight="book">
                    ⚠ {error}
                  </Text>
                  <Button rank="secondary" onClick={handleClearFilters}>
                    Clear Filters & Try Again
                  </Button>
                </Flex>
              </Card>
            ) : sortedJobs.length === 0 ? (
              <Card padding="xl" className="text-center">
                <Flex flex-direction="column" align-items="center" gap="m">
                  <Text font-size="heading-s" color="secondary">
                    🔍 No jobs found
                  </Text>
                  <Text color="secondary" className="max-w-sm">
                    Try adjusting your search filters or check back later for new opportunities
                  </Text>
                  <Button rank="secondary" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </Flex>
              </Card>
            ) : (
              <>
                {/* Jobs Count Summary on Mobile */}
                <Text font-size="body-s" color="secondary" className="lg:hidden px-2">
                  Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                  {activeFilterCount > 0 && ` • ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} active`}
                </Text>

                {/* Grid layout for grid view mode */}
                {viewMode === 'grid' && (
                  <Grid columns="1; m{2} l{3}" gap="m">
                    {sortedJobs.map((job) => renderJobCard(job))}
                  </Grid>
                )}

                {/* Stack layout for list/compact view modes */}
                {(viewMode === 'list' || viewMode === 'compact') && (
                  sortedJobs.map((job) => renderJobCard(job))
                )}
              </>
            )}
          </Flex>
        </div>
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
