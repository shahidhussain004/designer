"use client";

import { ErrorMessage } from '@/components/ErrorMessage';
import { JobDetailsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useCloseJob, useDeleteJob, useJob, useMyApplications, useMyCompany, usePublishJob } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCheck,
  CheckCircle,
  Clock,
  DollarSign,
  Edit2,
  ExternalLink,
  Eye,
  Globe,
  Mail,
  MapPin,
  Plane,
  Send,
  Shield,
  Star,
  Target,
  Trash2,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function JobDetailsPage() {
  const params = useParams();
  const _router = useRouter();
  const jobId = params?.id as string;
  const { user } = useAuth();

  // Fetch job details
  const { data: job, isLoading: jobLoading, error: jobError, refetch } = useJob(jobId);
  
  // Fetch user's company profile (only for COMPANY users, to determine job ownership)
  const { data: myCompany } = useMyCompany();
  
  // Fetch user's applications to check if already applied
  const { data: myApplications = [] } = useMyApplications();
  
  // Check if user has already applied for this job
  const userApplication = myApplications.find((app: Record<string, unknown>) => app.jobId === parseInt(jobId));

  // Determine ownership: user is owner if their company ID matches the job's company ID
  // Uses both backend isOwner flag AND frontend company ID comparison as fallback
  const isJobOwner = user?.role === 'COMPANY' && (
    job?.isOwner === true || 
    (myCompany?.id != null && job?.companyId != null && myCompany.id === job.companyId)
  );

  // Job management mutations
  const publishJobMutation = usePublishJob();
  const closeJobMutation = useCloseJob();
  const deleteJobMutation = useDeleteJob();

  // Loading states
  const [isPublishing, setIsPublishing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle publish
  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this job? It will become visible to all users.')) return;
    
    setIsPublishing(true);
    try {
      await publishJobMutation.mutateAsync(jobId);
      refetch();
    } catch (error) {
      console.error('Failed to publish job:', error);
      alert('Failed to publish job. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle close
  const handleClose = async () => {
    if (!confirm('Are you sure you want to close this job? No new applications will be accepted.')) return;
    
    setIsClosing(true);
    try {
      await closeJobMutation.mutateAsync(jobId);
      refetch();
    } catch (error) {
      console.error('Failed to close job:', error);
      alert('Failed to close job. Please try again.');
    } finally {
      setIsClosing(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    if (!confirm('This will permanently delete the job and all associated data. Are you absolutely sure?')) return;
    
    setIsDeleting(true);
    try {
      await deleteJobMutation.mutateAsync(jobId);
      // Router push is handled in the mutation's onSuccess
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job. Please try again.');
      setIsDeleting(false);
    }
  };

  if (jobLoading) {
    return (
      <PageLayout>
        <JobDetailsSkeleton />
      </PageLayout>
    );
  }

  if (jobError || !job) {
    return (
      <PageLayout>
        <div className="bg-secondary-50 min-h-screen py-12">
          <div className="mx-auto max-w-4xl px-4">
            <ErrorMessage
              message={jobError instanceof Error ? jobError.message : 'Job not found'}
              retry={refetch}
            />
            <Link href="/jobs" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mt-4">
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Helper functions for rendering
  const formatSalary = () => {
    if (!job.showSalary || !job.salaryMinCents) {
      return 'Salary not disclosed';
    }
    const min = (job.salaryMinCents / 100).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const max = job.salaryMaxCents
      ? ` - ${(job.salaryMaxCents / 100).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`
      : '';
    const currency = job.salaryCurrency || 'USD';
    const period = job.salaryPeriod ? ` / ${job.salaryPeriod.toLowerCase()}` : '';
    return `${min}${max} ${currency}${period}`;
  };

  const formatExperienceLevel = (level: string) => {
    return level.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const parseJsonArray = (data: unknown): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  return (
    <PageLayout>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-secondary-300 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span>Back to Jobs</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{job.title}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Status Badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  job.status === 'OPEN'
                    ? 'bg-success-500/20 text-success-300 border border-success-400/30'
                    : job.status === 'FILLED'
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-400/30'
                    : job.status === 'PAUSED'
                    ? 'bg-warning-500/20 text-warning-300 border border-warning-400/30'
                    : 'bg-secondary-500/20 text-secondary-300 border border-secondary-400/30'
                }`}>
                  {job.status === 'OPEN' && <CheckCircle className="w-3.5 h-3.5" />}
                  {job.status}
                </span>

                {/* Featured Badge */}
                {job.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-warning-500/20 text-warning-300 border border-warning-400/30">
                    <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    Featured
                  </span>
                )}

                {/* Urgent Badge */}
                {job.isUrgent && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-error-500/20 text-error-300 border border-error-400/30">
                    <Zap className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    Urgent
                  </span>
                )}
              </div>

              {/* Key Details */}
              <div className="flex flex-wrap items-center gap-4 text-secondary-300">
                {job.companyName && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" aria-hidden="true" />
                    <span>{job.companyName}</span>
                  </span>
                )}
                {job.jobType && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" aria-hidden="true" />
                    <span>{formatExperienceLevel(job.jobType)}</span>
                  </span>
                )}
                {job.experienceLevel && (
                  <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4" aria-hidden="true" />
                    <span>{formatExperienceLevel(job.experienceLevel)}</span>
                  </span>
                )}
                {(job.city || job.location) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <span>{job.city ? `${job.city}${job.state ? ', ' + job.state : ''}` : job.location}</span>
                  </span>
                )}
                {job.isRemote && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4" aria-hidden="true" />
                    <span>{job.remoteType ? formatExperienceLevel(job.remoteType) : 'Remote'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 lg:gap-8">
              {job.viewsCount !== undefined && (
                <div className="text-center">
                  <div className="flex items-center gap-1.5 text-2xl font-bold">
                    <Eye className="w-5 h-5" aria-hidden="true" />
                    <span>{job.viewsCount}</span>
                  </div>
                  <div className="text-sm text-secondary-400">Views</div>
                </div>
              )}
              {job.applicationsCount !== undefined && (
                <div className="text-center">
                  <div className="flex items-center gap-1.5 text-2xl font-bold">
                    <Send className="w-5 h-5" aria-hidden="true" />
                    <span>{job.applicationsCount}</span>
                  </div>
                  <div className="text-sm text-secondary-400">Applications</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-secondary-50 py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Job Description */}
              <section aria-labelledby="description-heading">
                <h2 id="description-heading" className="text-xl font-semibold text-secondary-900 mb-4">Overview</h2>
                <div className="text-secondary-700 leading-8 whitespace-pre-wrap">
                  {job.description}
                </div>
              </section>

              {/* Responsibilities */}
              {job.responsibilities && (
                <section aria-labelledby="responsibilities-heading">
                  <h2 id="responsibilities-heading" className="text-xl font-semibold text-secondary-900 mb-4">What you&apos;ll be doing</h2>
                  <div className="text-secondary-700 leading-8 whitespace-pre-wrap">
                    {job.responsibilities}
                  </div>
                </section>
              )}

              {/* Requirements */}
              {job.requirements && (
                <section aria-labelledby="requirements-heading">
                  <h2 id="requirements-heading" className="text-xl font-semibold text-secondary-900 mb-4">What we&apos;re looking for</h2>
                  <div className="text-secondary-700 leading-8 whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </section>
              )}

              {/* Skills Required */}
              {(job.requiredSkills || job.preferredSkills) && (
                <section aria-labelledby="skills-heading">
                  <h2 id="skills-heading" className="text-xl font-semibold text-secondary-900 mb-4">Skills & Experience</h2>

                  {job.requiredSkills && parseJsonArray(job.requiredSkills).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-secondary-700 text-uppercase tracking-wide mb-3">Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {parseJsonArray(job.requiredSkills).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary-100 text-secondary-800 text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.preferredSkills && parseJsonArray(job.preferredSkills).length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-secondary-700 text-uppercase tracking-wide mb-3">Nice to have</h3>
                      <div className="flex flex-wrap gap-2">
                        {parseJsonArray(job.preferredSkills).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary-50 text-secondary-700 text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Benefits & Perks */}
              {(job.benefits || job.perks) && (
                <section aria-labelledby="benefits-heading">
                  <h2 id="benefits-heading" className="text-xl font-semibold text-secondary-900 mb-4">Benefits</h2>

                  {job.benefits && parseJsonArray(job.benefits).length > 0 && (
                    <div className="mb-6">
                      <ul className="space-y-3">
                        {parseJsonArray(job.benefits).map((benefit: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-secondary-700">
                            <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.perks && parseJsonArray(job.perks).length > 0 && (
                    <div>
                      <ul className="space-y-3">
                        {parseJsonArray(job.perks).map((perk: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-secondary-700">
                            <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {/* Education & Certifications */}
              {(job.educationLevel || (job.certifications && parseJsonArray(job.certifications).length > 0)) && (
                <section aria-labelledby="education-heading">
                  <h2 id="education-heading" className="text-xl font-semibold text-secondary-900 mb-4">Education & Certifications</h2>

                  {job.educationLevel && (
                    <div className="mb-4 pb-4 border-b border-secondary-200">
                      <p className="text-sm text-secondary-600 mb-1">Minimum Education</p>
                      <p className="font-semibold text-secondary-900">{formatExperienceLevel(job.educationLevel)}</p>
                    </div>
                  )}

                  {job.certifications && parseJsonArray(job.certifications).length > 0 && (
                    <div>
                      <p className="text-sm text-secondary-600 mb-3">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {parseJsonArray(job.certifications).map((cert: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-100 text-secondary-800 text-sm font-medium"
                          >
                            <Award className="w-4 h-4" aria-hidden="true" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Application Instructions */}
              {job.applyInstructions && (
                <section aria-labelledby="instructions-heading">
                  <h2 id="instructions-heading" className="text-xl font-semibold text-secondary-900 mb-4">How to Apply</h2>
                  <div className="text-secondary-700 leading-8 whitespace-pre-wrap">
                    {job.applyInstructions}
                  </div>
                </section>
              )}

              {/* Company Info */}
              {job.companyName && (
                <section aria-labelledby="company-heading">
                  <h2 id="company-heading" className="text-xl font-semibold text-secondary-900 mb-4">About the Company</h2>
                  <div className="bg-secondary-50 rounded-lg p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-secondary-900">{job.companyName}</p>
                        {job.categoryName && (
                          <p className="text-sm text-secondary-600 mt-2">{job.categoryName}</p>
                        )}
                      </div>
                      {job.companyId && (
                        <Link
                          href={`/company/${job.companyId}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50 font-medium transition-colors text-sm"
                        >
                          View Profile
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">

              {/* Apply Section */}
              {!user ? (
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-secondary-400" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-secondary-900 mb-2">Sign in to apply for this job</h3>
                  <p className="text-secondary-600 mb-6">You need to be logged in to submit an application.</p>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              ) : isJobOwner ? (
                <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-primary-600" aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-secondary-900 mb-2">You Posted This Job</h3>
                    <p className="text-secondary-600 mb-6 text-sm">Manage your job posting</p>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {/* Edit Button */}
                      <Link
                        href={`/jobs/${jobId}/edit`}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Job Post
                      </Link>

                      {/* Publish Button (only for DRAFT status) */}
                      {job.status === 'DRAFT' && (
                        <button
                          onClick={handlePublish}
                          disabled={isPublishing}
                          className="w-full px-4 py-3 rounded-lg bg-success-600 text-white hover:bg-success-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPublishing ? 'Publishing...' : 'Publish Job'}
                        </button>
                      )}

                      {/* Close Button (only for OPEN status) */}
                      {job.status === 'OPEN' && (
                        <button
                          onClick={handleClose}
                          disabled={isClosing}
                          className="w-full px-4 py-3 rounded-lg bg-warning-600 text-white hover:bg-warning-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isClosing ? 'Closing...' : 'Close Job'}
                        </button>
                      )}

                      {/* View Applications Button */}
                      <Link
                        href={`/jobs/${job.id}/applications`}
                        className="block w-full text-center px-4 py-2 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-50 font-medium transition-colors text-sm"
                      >
                        View Applications ({job.applicationsCount || 0})
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full px-4 py-2 rounded-lg border border-error-300 text-error-700 hover:bg-error-50 font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? 'Deleting...' : 'Delete Job'}
                      </button>
                    </div>

                    {/* Status Info */}
                    <div className="mt-6 pt-6 border-t border-secondary-200">
                      <p className="text-xs text-secondary-600 uppercase tracking-wide font-semibold mb-1">Current Status</p>
                      <p className="text-secondary-900 font-medium capitalize">
                        {job.status?.replace(/_/g, ' ') || 'Unknown'}
                      </p>
                      {job.viewsCount !== undefined && (
                        <p className="text-sm text-secondary-600 mt-2">
                          {job.viewsCount} views
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : user.role === 'COMPANY' ? (
                /* Non-owner company viewing someone else's job */
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-secondary-400" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-secondary-900 mb-2">Company Account</h3>
                  <p className="text-secondary-600 text-sm">Only freelancers can apply for jobs. Switch to a freelancer account to apply.</p>
                </div>
              ) : userApplication ? (
                <div className="bg-white rounded-xl shadow-sm border border-success-200 p-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                        <CheckCheck className="w-6 h-6 text-success-600" aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-secondary-900 mb-2">Application Submitted</h3>
                    <p className="text-secondary-600 mb-4">You have already applied for this job.</p>
                    
                    {/* Application Details */}
                    <div className="bg-success-50 rounded-lg p-4 mt-6 text-left">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-secondary-600 uppercase tracking-wide font-semibold mb-1">Application Status</p>
                          <p className="text-secondary-900 font-medium capitalize">
                            {userApplication.status?.replace(/_/g, ' ') || 'Pending Review'}
                          </p>
                        </div>
                        
                        {userApplication.appliedAt && (
                          <div>
                            <p className="text-xs text-secondary-600 uppercase tracking-wide font-semibold mb-1">Applied On</p>
                            <p className="text-secondary-900 font-medium">
                              {new Date(userApplication.appliedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}

                        {userApplication.status?.toUpperCase() === 'SHORTLISTED' && (
                          <div className="pt-3 border-t border-success-200">
                            <p className="text-success-700 font-semibold text-sm">🎉 Great news! You&apos;ve been shortlisted.</p>
                          </div>
                        )}

                        {userApplication.status?.toUpperCase() === 'ACCEPTED' && (
                          <div className="pt-3 border-t border-success-200">
                            <p className="text-success-700 font-semibold text-sm">✨ Congratulations! Your application was accepted.</p>
                          </div>
                        )}

                        {userApplication.status?.toUpperCase() === 'REJECTED' && (
                          <div className="pt-3 border-t border-error-200 bg-error-50 rounded -m-4 p-4">
                            <p className="text-error-700 font-medium text-sm">This application was not selected. Check out other opportunities!</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="mt-6 pt-6 border-t border-secondary-200 space-y-3">
                      <Link 
                        href="/dashboard/freelancer" 
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        View All Applications
                        <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : job.status !== 'OPEN' ? (
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-secondary-400" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-secondary-900 mb-2">Position Not Available</h3>
                  <p className="text-secondary-600 mb-4">This position is {job.status.toLowerCase()}.</p>
                </div>
              ) : (
                <Link href={`/jobs/${jobId}/apply`} className="block">
                  <button
                    className="w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-primary-600 text-white hover:bg-primary-700"
                  >
                    <Send className="w-5 h-5" aria-hidden="true" />
                    Apply for this Job
                  </button>
                </Link>
              )}

              {/* Job Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Job Overview</h3>
                <dl className="space-y-4">
                  {/* Salary Range */}
                  <div>
                    <dt className="text-sm text-secondary-600 mb-1 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-secondary-400" aria-hidden="true" />
                      Salary Range
                    </dt>
                    <dd className="font-semibold text-secondary-900 text-lg">{formatSalary()}</dd>
                  </div>

                  {job.jobType && (
                    <div>
                      <dt className="text-sm text-secondary-600 mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-secondary-400" aria-hidden="true" />
                        Employment Type
                      </dt>
                      <dd className="font-semibold text-secondary-900">{formatExperienceLevel(job.jobType)}</dd>
                    </div>
                  )}

                  {job.experienceLevel && (
                    <div>
                      <dt className="text-sm text-secondary-600 mb-1 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-secondary-400" aria-hidden="true" />
                        Experience Level
                      </dt>
                      <dd className="font-semibold text-secondary-900">{formatExperienceLevel(job.experienceLevel)}</dd>
                    </div>
                  )}

                  {job.positionsAvailable && job.positionsAvailable > 1 && (
                    <div>
                      <dt className="text-sm text-secondary-600 mb-1 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-secondary-400" aria-hidden="true" />
                        Positions Available
                      </dt>
                      <dd className="font-semibold text-secondary-900">{job.positionsAvailable}</dd>
                    </div>
                  )}

                  {job.startDate && (
                    <div>
                      <dt className="text-sm text-secondary-600 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-secondary-400" aria-hidden="true" />
                        Expected Start Date
                      </dt>
                      <dd className="font-semibold text-secondary-900">
                        {new Date(job.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  )}

                  {job.applicationDeadline && (
                    <div>
                      <dt className="text-sm text-secondary-600 mb-1 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-secondary-400" aria-hidden="true" />
                        Application Deadline
                      </dt>
                      <dd className="font-semibold text-error-600">
                        {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  )}

                  <div className="pt-4 border-t border-secondary-200">
                    <dt className="text-sm text-secondary-600 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-secondary-400" aria-hidden="true" />
                      Posted
                    </dt>
                    <dd className="font-semibold text-secondary-900">
                      {job.publishedAt
                        ? new Date(job.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Recently'
                      }
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Location Details */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  Location
                </h3>
                <div className="space-y-3">
                  {job.city && (
                    <p className="text-secondary-900 font-medium">
                      {job.city}{job.state && `, ${job.state}`}{job.country && `, ${job.country}`}
                    </p>
                  )}
                  {!job.city && job.location && (
                    <p className="text-secondary-900 font-medium">{job.location}</p>
                  )}

                  {job.isRemote && (
                    <div className="flex items-center gap-2 text-success-700 bg-success-50 rounded-lg px-3 py-2">
                      <Globe className="w-5 h-5" aria-hidden="true" />
                      <span className="font-semibold">
                        {job.remoteType ? formatExperienceLevel(job.remoteType) : 'Remote Position'}
                      </span>
                    </div>
                  )}

                  {job.travelRequirement && job.travelRequirement !== 'NONE' && (
                    <div className="flex items-start gap-2 text-warning-700 bg-warning-50 rounded-lg px-3 py-2">
                      <Plane className="w-5 h-5 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-sm">Travel Required</p>
                        <p className="text-sm">{formatExperienceLevel(job.travelRequirement)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Requirements */}
              {(job.securityClearanceRequired || job.visaSponsorship) && (
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                  <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    Additional Requirements
                  </h3>
                  <div className="space-y-3">
                    {job.securityClearanceRequired && (
                      <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-200">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary-600" aria-hidden="true" />
                          <span className="font-medium text-blue-900">Security Clearance Required</span>
                        </div>
                        <CheckCircle className="w-5 h-5 text-primary-600" aria-hidden="true" />
                      </div>
                    )}

                    {job.visaSponsorship !== undefined && (
                      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-secondary-600" aria-hidden="true" />
                          <span className="font-medium text-secondary-900">Visa Sponsorship</span>
                        </div>
                        {job.visaSponsorship ? (
                          <span className="text-success-600 font-semibold">Available</span>
                        ) : (
                          <span className="text-secondary-600">Not Available</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {(job.applicationEmail || job.applicationUrl) && (
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                  <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    Contact
                  </h3>
                  <div className="space-y-3">
                    {job.applicationEmail && (
                      <a
                        href={`mailto:${job.applicationEmail}`}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors group"
                      >
                        <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                        <span className="font-medium break-all">{job.applicationEmail}</span>
                      </a>
                    )}

                    {job.applicationUrl && (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors group"
                      >
                        <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                        <span className="font-medium">Application Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Share & Actions */}
              <div className="bg-secondary-50 rounded-xl border border-secondary-200 p-4">
                <p className="text-xs text-secondary-600 text-center">
                  Job ID: {job.id} • Category: {job.categoryName || 'Uncategorized'}
                </p>
                {job.updatedAt && (
                  <p className="text-xs text-secondary-500 text-center mt-1">
                    Last updated: {new Date(job.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Apply Button */}
          <div className="mt-12 pt-8 border-t border-secondary-200">
            <div className="flex flex-col gap-4">
              {user && user.role === 'FREELANCER' && user.id !== job.companyId && job.status === 'OPEN' && !userApplication && (
                <Link href={`/jobs/${jobId}/apply`} className="block">
                  <button
                    className="w-full md:w-1/3 mx-auto py-4 px-6 rounded-lg font-semibold transition-all bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" aria-hidden="true" />
                    Apply for this Job
                  </button>
                </Link>
              )}
              {!userApplication && (!user || user.role !== 'FREELANCER' || user.id === job.companyId || job.status !== 'OPEN') && (
                <div className="w-full md:w-1/3 mx-auto p-4 bg-secondary-50 rounded-lg text-center border border-secondary-200">
                  <AlertCircle className="w-5 h-5 mx-auto mb-2 text-secondary-500" aria-hidden="true" />
                  {!user ? (
                    <p className="text-sm font-medium text-secondary-600">Sign in to apply for this job</p>
                  ) : user.id === job.companyId ? (
                    <p className="text-sm font-medium text-secondary-600">You cannot apply to your own job posting</p>
                  ) : user.role !== 'FREELANCER' ? (
                    <p className="text-sm font-medium text-secondary-600">Only freelancers can apply for jobs</p>
                  ) : (
                    <p className="text-sm font-medium text-secondary-600">This position is {job.status.toLowerCase()}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
