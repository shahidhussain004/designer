'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { JobsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useExperienceLevels, useProjectCategories, useProjects } from '@/hooks/useProjects';
import { parseCategories, parseExperienceLevels } from '@/lib/apiParsers';
import { Grid, List } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

type ViewMode = 'list' | 'grid' | 'compact';
type SortBy = 'recent' | 'budget-high' | 'budget-low';
type LayoutMode = 'list' | 'grid';

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
  company: {
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
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
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
    
    setCurrentPage(1);
    router.push(`/projects?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setCategoryId('');
    setExperienceLevelId('');
    setMinBudget('');
    setMaxBudget('');
    setSearchQuery('');
    setCurrentPage(1);
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
            Posted by {project.company?.fullName || 'Unknown'} • {formatDate(project.createdAt)}
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
            <h1 className="text-4xl font-bold mb-4">Discover Your Next Project</h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Explore {projects.length} curated project{projects.length !== 1 ? 's' : ''} matched to your expertise.
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

              {/* Layout Toggle */}
              <div className="flex gap-2 border border-gray-300 rounded-lg p-1 w-fit h-fit">
                <button
                  onClick={() => setLayoutMode('list')}
                  className={`p-2 rounded transition-colors ${
                    layoutMode === 'list'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    layoutMode === 'grid'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>

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
            <>
              {/* Pagination Info */}
              <div className="mb-6 text-sm text-gray-600">
                Showing {sortedProjects.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, sortedProjects.length)} of {sortedProjects.length} projects
              </div>

              {/* List View */}
              {layoutMode === 'list' && (
                <div className="space-y-4 mb-8">
                  {sortedProjects
                    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                    .map((project) => (
                      <div
                        key={project.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer group"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        <div className="flex items-start justify-between gap-6 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h4 className="text-lg font-semibold group-hover:text-primary-600 transition-colors">
                                  {project.title}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  Posted by {project.company?.fullName || 'Unknown'} • {formatDate(project.createdAt)}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                                  {project.category?.name ?? 'Uncategorized'}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              ${project.budget?.toLocaleString() || '0'}
                            </div>
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                              project.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <span className="text-sm text-gray-500">Level: {project.experienceLevel?.name ?? 'Any'}</span>
                          <span className="text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                            View Details →
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Grid View */}
              {layoutMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {sortedProjects
                    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                    .map((project) => renderProjectCard(project))}
                </div>
              )}

              {/* Pagination Controls */}
              {Math.ceil(sortedProjects.length / ITEMS_PER_PAGE) > 1 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.ceil(sortedProjects.length / ITEMS_PER_PAGE) }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);
                      const showPage = 
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        pageNum === currentPage || 
                        (pageNum === currentPage - 1 && currentPage > 1) || 
                        (pageNum === currentPage + 1 && currentPage < totalPages);
                      
                      const isEllipsis = 
                        (pageNum === 2 && currentPage > 3) || 
                        (pageNum === totalPages - 1 && currentPage < totalPages - 2);

                      if (isEllipsis) {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-600">
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            pageNum === currentPage
                              ? 'bg-primary-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(sortedProjects.length / ITEMS_PER_PAGE)))}
                      disabled={currentPage === Math.ceil(sortedProjects.length / ITEMS_PER_PAGE)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
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

