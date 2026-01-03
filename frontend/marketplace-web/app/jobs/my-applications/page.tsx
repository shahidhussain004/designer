'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useMyApplications } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import { ArrowLeft, Briefcase, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  coverLetter: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: applications = [], isLoading, isError, error, refetch } = useMyApplications();

  useEffect(() => {
    if (user) {
      if (user.role !== 'FREELANCER') {
        router.push('/jobs');
      }
    }
  }, [router, user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-900 text-white py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/jobs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>
            <h1 className="text-3xl font-bold mb-2">My Applications</h1>
            <p className="text-gray-400">Track the status of your job applications</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isError && (
            <div className="mb-6">
              <ErrorMessage 
                message={error?.message || 'Failed to load applications'} 
                retry={() => refetch()}
              />
            </div>
          )}

          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h2>
              <p className="text-gray-500 mb-6">Start applying to jobs to track them here</p>
              <Link 
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application: any) => (
                <Link
                  key={application.id}
                  href={`/jobs/${application.jobId}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                          {application.jobTitle}
                        </h2>
                        <p className="text-gray-500 mb-3">{application.companyName}</p>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {application.coverLetter.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(application.status)}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        Updated {new Date(application.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
