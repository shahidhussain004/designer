'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { JobSaveButton } from '@/components/JobSaveButton';
import { JobsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useAuth } from '@/lib/context/AuthContext';
import { getSavedJobs, SavedJobResponse } from '@/lib/jobs';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SavedJobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<SavedJobResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/auth/login?redirect=/jobs/saved');
      return;
    }

    loadSavedJobs();
  }, [user, router]);

  const loadSavedJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const jobs = await getSavedJobs();
      setSavedJobs(jobs);
      console.log(`Loaded ${jobs.length} saved jobs`);
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load saved jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = (jobId: string | number) => {
    // Remove from local state optimistically
    setSavedJobs(prev => prev.filter(sj => sj.job.id !== jobId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-success-100 text-success-700';
      case 'CLOSED': return 'bg-secondary-100 text-secondary-600';
      case 'FILLED': return 'bg-primary-100 text-primary-700';
      default: return 'bg-secondary-100 text-secondary-600';
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

  if (isLoading) {
    return (
      <PageLayout>
        <div className="bg-secondary-900 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Saved Jobs</h1>
            <p className="text-xl text-secondary-300">Loading your saved jobs...</p>
          </div>
        </div>
        <div className="bg-secondary-50 py-8 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <JobsSkeleton />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="bg-secondary-900 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Saved Jobs</h1>
          </div>
        </div>
        <div className="bg-secondary-50 py-8 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ErrorMessage message={error} retry={loadSavedJobs} />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Page Header */}
      <section className="bg-secondary-900 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-primary-400 fill-primary-400" />
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Saved Jobs</h1>
          </div>
          <p className="text-xl text-secondary-300">
            {savedJobs.length === 0 
              ? "You haven't saved any jobs yet" 
              : `${savedJobs.length} job${savedJobs.length !== 1 ? 's' : ''} you're interested in`
            }
          </p>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-secondary-50 py-8 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {savedJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-secondary-200 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">No saved jobs yet</h3>
              <p className="text-secondary-600 mb-6">Start exploring and save jobs you&apos;re interested in for later</p>
              <Link
                href="/jobs"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all"
              >
                Browse All Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((savedJob) => {
                const job = savedJob.job;
                return (
                  <div key={savedJob.savedJobId} className="relative">
                    <Link href={`/jobs/${job.id}`} className="block group">
                      <div className="bg-white rounded-xl border border-secondary-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all">
                        {/* Save Button - Top Right (shows as filled/saved) */}
                        <div className="absolute top-4 right-4 z-10">
                          <JobSaveButton 
                            jobId={job.id} 
                            initialSaved={true}
                            onSaveChange={(isSaved) => {
                              if (!isSaved) {
                                handleUnsave(job.id);
                              }
                            }}
                          />
                        </div>
                        
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          {/* Main Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-4">
                              {/* Company Logo Placeholder */}
                              <div className="hidden sm:flex w-12 h-12 rounded-lg bg-secondary-100 items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold text-secondary-400">
                                  {job.companyName?.charAt(0) || 'C'}
                                </span>
                              </div>
                              
                              <div className="flex-1 min-w-0 pr-12">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <h2 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors truncate">
                                    {job.title}
                                  </h2>
                                  {job.status && (
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                      {job.status}
                                    </span>
                                  )}
                                </div>
                                <p className="text-secondary-600 mt-1">{job.companyName || 'Company'}</p>
                                
                                {job.description && (
                                  <p className="text-secondary-600 mt-3 line-clamp-2">
                                    {job.description.substring(0, 200)}
                                    {job.description.length > 200 && '...'}
                                  </p>
                                )}
                                
                                {/* Meta Info */}
                                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                  {job.location && (
                                    <span className="flex items-center text-secondary-500">
                                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      {job.location}
                                    </span>
                                  )}
                                  {job.jobType && (
                                    <span className="flex items-center text-secondary-500">
                                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                      {getJobTypeLabel(job.jobType)}
                                    </span>
                                  )}
                                  <span className="flex items-center text-secondary-500">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    Saved {new Date(savedJob.savedAt).toLocaleDateString()}
                                  </span>
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
