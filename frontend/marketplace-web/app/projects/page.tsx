'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { JobsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useExperienceLevels, useProjectCategories, useProjects } from '@/hooks/useProjects';
import { parseCategories, parseExperienceLevels } from '@/lib/apiParsers';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

type ViewMode = 'list' | 'grid' | 'compact';
type SortBy = 'recent' | 'budget-high' | 'budget-low';

interface Project {
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

function ProjectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
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

  // Hooks
  const { data: projects = [], isLoading, error, refetch } = useProjects({ categoryId, experienceLevelId, minBudget, maxBudget, search: searchQuery });
  const { data: categoriesData } = useProjectCategories();
  const { data: experienceLevelsData } = useExperienceLevels();

  const categories = useMemo(() => parseCategories(categoriesData), [categoriesData]);
  const experienceLevels = useMemo(() => parseExperienceLevels(experienceLevelsData), [experienceLevelsData]);

  // Sort projects based on selection
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a: any, b: any) => {
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
  }, [projects, sortBy]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (experienceLevelId) params.append('experienceLevelId', experienceLevelId);
    if (minBudget) params.append('minBudget', minBudget);
    if (maxBudget) params.append('maxBudget', maxBudget);
    if (searchQuery) params.append('search', searchQuery);
    
    router.push(`/projects?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setCategoryId('');
    setExperienceLevelId('');
    setMinBudget('');
    setMaxBudget('');
    setSearchQuery('');
    router.push('/projects');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Count active filters
  const activeFilterCount = [categoryId, experienceLevelId, minBudget, maxBudget, searchQuery].filter(Boolean).length;

  // Render project card based on view mode
  const renderProjectCard = (project: Project) => {
    return (
      <div
        key={project.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer group"
        onClick={() => router.push(`/projects/${project.id}`)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && router.push(`/projects/${project.id}`)}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
              {project.category?.name ?? 'Uncategorized'}
            </span>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
              project.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {project.status}
            </span>
          </div>
          
          <h4 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {project.title}
          </h4>
          
          <p className="text-sm text-gray-500 mb-3">
            Posted by {project.client?.fullName || 'Unknown'} • {formatDate(project.createdAt)}
          </p>
          
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
            {project.description}
          </p>
          
          <div className="border-t border-gray-200 pt-4 mt-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Budget</span>
              <span className="text-lg font-bold text-green-600">${project.budget?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Level</span>
              <span className="text-sm text-gray-700">{project.experienceLevel?.name ?? 'Any'}</span>
            </div>
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/projects/${project.id}`); }}
            className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors group-hover:border-primary-300 group-hover:text-primary-600"
          >
            View Details →
          </button>
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-gray-900 text-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Find Your Next Project</h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Discover curated opportunities matched to your expertise
            </p>
            <p className="text-gray-400 mt-2">
              {projects.length} project{projects.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Bar */}
          <div className="sticky top-0 z-10 bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by project title, skills, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="select-with-arrow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                value={experienceLevelId}
                onChange={(e) => setExperienceLevelId(e.target.value)}
                className="select-with-arrow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="">All Levels</option>
                {experienceLevels.map((level) => (
                  <option key={level.id} value={level.id.toString()}>
                    {level.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="select-with-arrow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="budget-high">Highest Budget</option>
                <option value="budget-low">Lowest Budget</option>
              </select>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <JobsSkeleton />
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
              <ErrorMessage message={(error as Error).message} retry={refetch} />
            </div>
          ) : sortedProjects.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-xl text-gray-500 mb-4">No projects found</p>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                Try adjusting your search filters or check back later for new opportunities
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProjects.map((project) => renderProjectCard(project))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}

