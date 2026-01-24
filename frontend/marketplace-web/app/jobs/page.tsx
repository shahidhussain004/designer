'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { JobsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useJobs } from '@/hooks/useJobs';
import { useCompanyProfile } from '@/hooks/useUsers';
import { useAuth } from '@/lib/auth';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

interface Job {
  id: number | string;
  title?: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  companyName?: string;
  companyId?: number;
  salaryMinCents?: number;
  salaryMaxCents?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  showSalary?: boolean;
  jobType?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  isRemote?: boolean;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  requiredSkills?: string;
  preferredSkills?: string;
  educationLevel?: string;
  experienceLevel?: string;
  status?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

const jobTypes = [
  { value: 'ALL', label: 'All Types' },
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'FREELANCE', label: 'Freelance' },
];

const statusOptions = [
  { value: 'ALL', label: 'All Status' },
  { value: 'OPEN', label: 'Open' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'FILLED', label: 'Filled' },
];

export default function JobsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyIdParam = searchParams.get('company');
  
  const { data: jobs, isLoading, error, refetch } = useJobs(companyIdParam);
  const { data: company } = useCompanyProfile(companyIdParam || null);

  // DEBUG: log runtime query param and jobs data to help diagnose filtering
  // Remove these logs after debugging is complete
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('JobsPage debug - company query param:', companyIdParam);
    // eslint-disable-next-line no-console
    console.log('JobsPage debug - jobs from useJobs():', jobs);
  }
  
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('OPEN');
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    const typedJobs = jobs as Job[];
    return typedJobs.filter((job) => {
      const matchesStatus = filterStatus === 'ALL' || job.status === filterStatus;
      const matchesType = filterType === 'ALL' || job.jobType === filterType;
      const matchesSearch = !searchQuery || 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [jobs, filterStatus, filterType, searchQuery]);

  if (isLoading) {
    return (
      <PageLayout>
        <JobsSkeleton />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <ErrorMessage 
          message={error instanceof Error ? error.message : 'Failed to load jobs'} 
          retry={refetch}
        />
      </PageLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-700';
      case 'CLOSED': return 'bg-gray-100 text-gray-600';
      case 'FILLED': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'Full Time';
      case 'PART_TIME': return 'Part Time';
      case 'CONTRACT': return 'Contract';
      case 'FREELANCE': return 'Freelance';
      default: return type;
    }
  };

  return (
    <PageLayout>
      {/* Page Header */}
      <section className="bg-gray-900 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              {companyIdParam && (
                <div className="mb-4 flex items-center gap-2">
                  <button
                    onClick={() => router.push('/jobs')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-gray-400 text-sm">Back to all jobs</span>
                </div>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                {companyIdParam ? `Jobs at ${company?.fullName ?? 'Company'}` : 'Discover Your Next Role'}
              </h1>
              <p className="text-xl text-gray-300">
                {companyIdParam 
                  ? `Viewing ${jobs?.length || 0} open position${(jobs?.length || 0) !== 1 ? 's' : ''} from ${company?.fullName ?? 'this company'}`
                  : `Explore ${jobs?.length || 0} open position${(jobs?.length || 0) !== 1 ? 's' : ''} from leading companies — find the one that fits you.`
                }
              </p>
            </div>
            {user && user.role === 'COMPANY' && !companyIdParam && (
              <Link
                href="/jobs/create"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-lg whitespace-nowrap"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post a New Job
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="w-full lg:w-44">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent bg-white"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            {/* Type Filter */}
            <div className="w-full lg:w-44">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent bg-white"
              >
                {jobTypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-gray-50 py-8 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs
              {filterStatus !== 'ALL' && <span> with status &ldquo;{filterStatus}&rdquo;</span>}
              {filterType !== 'ALL' && <span> of type &ldquo;{getJobTypeLabel(filterType)}&rdquo;</span>}
            </p>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setFilterStatus('ALL');
                  setFilterType('ALL');
                  setSearchQuery('');
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job: Job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block group">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          {/* Company Logo Placeholder */}
                          <div className="hidden sm:flex w-12 h-12 rounded-lg bg-gray-100 items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-gray-400">
                              {job.companyName?.charAt(0) || 'C'}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                                {job.title}
                              </h2>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status || '')}`}>
                                {job.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{job.companyName || 'Company'}</p>
                            
                            <p className="text-gray-600 mt-3 line-clamp-2">
                              {job.description ? job.description.substring(0, 200) : 'No description available'}
                              {job.description && job.description.length > 200 && '...'}
                            </p>
                            
                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 mt-4 text-sm">
                              {job.location && (
                                <span className="flex items-center text-gray-500">
                                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {job.location}
                                </span>
                              )}
                              {job.jobType && (
                                <span className="flex items-center text-gray-500">
                                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  {getJobTypeLabel(job.jobType)}
                                </span>
                              )}
                              {job.createdAt && (
                                <span className="flex items-center text-gray-500">
                                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action */}
                      <div className="flex items-center lg:flex-shrink-0">
                        <span className="text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                          View Details
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
