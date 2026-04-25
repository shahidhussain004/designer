"use client";

import { PageLayout } from '@/components/ui';
import { useMyApplications } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  MapPin,
  Search,
  Trash2,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  location?: string;
  fullName: string;
  email: string;
  phone?: string;
  status: string;
  createdAt: string;
  appliedAt: string;
  coverLetter?: string;
  resumeUrl?: string;
  rejectionReason?: string;
  companyNotes?: string;
}

export default function MyApplicationsPage() {
  const _router = useRouter();
  const { user } = useAuth();
  const { data: applications = [], isLoading, error } = useMyApplications();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client before rendering dates
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    if (!Array.isArray(applications) || applications.length === 0) {
      return [];
    }

    let filtered = [...applications]; // Create a copy to avoid mutating original

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app?.jobTitle?.toLowerCase().includes(query) ||
          app?.companyName?.toLowerCase().includes(query) ||
          app?.location?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((app) => app?.status === statusFilter);
    }

    // Sort
    if (Array.isArray(filtered) && filtered.length > 0) {
      filtered.sort((a, b) => {
        const aDate = new Date(a?.createdAt || 0).getTime();
        const bDate = new Date(b?.createdAt || 0).getTime();
        return sortBy === 'latest' ? bDate - aDate : aDate - bDate;
      });
    }

    return filtered;
  }, [applications, searchQuery, statusFilter, sortBy]);

  // Status badge styling
  const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return {
          bg: 'bg-primary-50',
          text: 'text-primary-700',
          badge: 'bg-primary-100 text-blue-800',
          icon: Clock,
        };
      case 'REVIEWING':
        return {
          bg: 'bg-warning-50',
          text: 'text-warning-700',
          badge: 'bg-warning-100 text-warning-800',
          icon: Search,
        };
      case 'SHORTLISTED':
        return {
          bg: 'bg-success-50',
          text: 'text-success-700',
          badge: 'bg-success-100 text-success-800',
          icon: CheckCircle,
        };
      case 'INTERVIEWING':
        return {
          bg: 'bg-primary-50',
          text: 'text-primary-700',
          badge: 'bg-primary-100 text-primary-800',
          icon: Briefcase,
        };
      case 'OFFERED':
        return {
          bg: 'bg-success-50',
          text: 'text-success-700',
          badge: 'bg-success-100 text-success-800',
          icon: CheckCircle,
        };
      case 'REJECTED':
        return {
          bg: 'bg-error-50',
          text: 'text-error-700',
          badge: 'bg-error-100 text-error-800',
          icon: X,
        };
      case 'WITHDRAWN':
        return {
          bg: 'bg-secondary-50',
          text: 'text-secondary-700',
          badge: 'bg-secondary-100 text-secondary-800',
          icon: X,
        };
      default:
        return {
          bg: 'bg-secondary-50',
          text: 'text-secondary-700',
          badge: 'bg-secondary-100 text-secondary-800',
          icon: Clock,
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    return status?.replace(/_/g, ' ').toUpperCase() || 'PENDING';
  };

  // Prevent hydration mismatch by waiting for client-side mount
  if (!mounted) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="inline-block w-8 h-8 border-4 border-secondary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-secondary-50 py-12">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <p className="text-secondary-600 mb-6">Please log in to view your applications.</p>
            <Link href="/auth/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white py-12" suppressHydrationWarning>
        <div className="mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-secondary-900 mb-2">My Applications</h1>
              <p className="text-secondary-600">
                Track your job applications and stay updated on their status
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-secondary-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary-600">{applications.length}</div>
              <p className="text-secondary-600 text-sm mt-1">Total Applications</p>
            </div>
            <div className="bg-white rounded-lg border border-secondary-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-warning-600">
                {applications.filter((a: Application) => a.status === 'REVIEWING').length}
              </div>
              <p className="text-secondary-600 text-sm mt-1">Under Review</p>
            </div>
            <div className="bg-white rounded-lg border border-secondary-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-success-600">
                {applications.filter((a: Application) => a.status === 'SHORTLISTED').length}
              </div>
              <p className="text-secondary-600 text-sm mt-1">Shortlisted</p>
            </div>
            <div className="bg-white rounded-lg border border-secondary-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-success-600">
                {applications.filter((a: Application) => a.status === 'OFFERED').length}
              </div>
              <p className="text-secondary-600 text-sm mt-1">Offers</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-secondary-200 p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
                <select
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWING">Reviewing</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEWING">Interviewing</option>
                  <option value="OFFERED">Offered</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest')}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="inline-block w-8 h-8 border-4 border-secondary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
              <p className="text-error-700">Failed to load applications. Please try again.</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg border border-secondary-200 p-12 text-center shadow-sm">
              <Briefcase className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {searchQuery || statusFilter ? 'No applications found' : 'No applications yet'}
              </h3>
              <p className="text-secondary-600 mb-6">
                {searchQuery || statusFilter
                  ? 'Try adjusting your filters or search terms.'
                  : 'Start exploring job opportunities and submit your first application!'}
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4" suppressHydrationWarning>
              {filteredApplications.map((application) => {
                const statusStyles = getStatusStyles(application.status);
                const StatusIcon = statusStyles.icon;

                return (
                  <div
                    key={application.id}
                    className={`${statusStyles.bg} rounded-lg border border-secondary-200 p-6 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      {/* Left: Job Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          {/* Company Logo Placeholder */}
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/jobs/${application.jobId}`}
                              className="text-lg font-bold text-secondary-900 hover:text-primary-600 transition-colors block truncate"
                            >
                              {application.jobTitle}
                            </Link>
                            <p className="text-secondary-600 mb-2">{application.companyName}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                              {application.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {application.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Applied {formatDate(application.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status and Actions */}
                      <div className="flex flex-col md:items-end gap-4">
                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 ${statusStyles.badge} rounded-full font-semibold whitespace-nowrap`}>
                          <StatusIcon className="w-4 h-4" />
                          {getStatusLabel(application.status)}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Link
                            href={`/jobs/${application.jobId}`}
                            className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors font-medium text-sm inline-block"
                          >
                            View Details
                          </Link>
                          {application.status === 'PENDING' && (
                            <button className="px-4 py-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors font-medium text-sm">
                              <Trash2 className="w-4 h-4 inline mr-1" />
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Status */}
                    <div className="mt-4 pt-4 border-t border-secondary-200 grid grid-cols-4 gap-4 text-center text-sm">
                      <div className={application.status && ['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'REJECTED', 'WITHDRAWN'].includes(application.status) ? 'text-secondary-900 font-semibold' : 'text-secondary-400'}>
                        <div>{'Applied'}</div>
                        <div className="text-xs">{formatDate(application.appliedAt || application.createdAt)}</div>
                      </div>
                      <div className={['REVIEWING', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'REJECTED'].includes(application.status) ? 'text-secondary-900 font-semibold' : 'text-secondary-400'}>
                        <div>Under Review</div>
                      </div>
                      <div className={['SHORTLISTED', 'INTERVIEWING', 'OFFERED'].includes(application.status) ? 'text-secondary-900 font-semibold' : 'text-secondary-400'}>
                        <div>Decision</div>
                      </div>
                      <div className={application.status === 'OFFERED' ? 'text-success-600 font-semibold' : 'text-secondary-400'}>
                        <div>Offer</div>
                      </div>
                    </div>

                    {/* Rejection Feedback */}
                    {application.status === 'REJECTED' && (
                      <div className="mt-4 pt-4 border-t border-error-200 space-y-3">
                        {application.rejectionReason && (
                          <div className="bg-white rounded p-3 border border-error-200">
                            <p className="text-xs text-secondary-600 uppercase tracking-wide font-semibold mb-1">Feedback from Company</p>
                            <p className="text-secondary-900 text-sm">{application.rejectionReason}</p>
                          </div>
                        )}

                        {application.companyNotes && (
                          <div className="bg-white rounded p-3 border border-error-200">
                            <p className="text-xs text-secondary-600 uppercase tracking-wide font-semibold mb-1">Additional Notes</p>
                            <p className="text-secondary-900 text-sm">{application.companyNotes}</p>
                          </div>
                        )}

                        {!application.rejectionReason && !application.companyNotes && (
                          <p className="text-error-600 text-sm italic">No feedback provided by the company.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
