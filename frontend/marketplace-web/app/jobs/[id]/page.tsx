"use client";

import { ErrorMessage } from '@/components/ErrorMessage';
import { JobDetailsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useJob } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import {
    AlertCircle,
    ArrowLeft,
    Award,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
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
    Users,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const { user } = useAuth();

  // Fetch job details
  const { data: job, isLoading: jobLoading, error: jobError, refetch } = useJob(jobId);

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
        <div className="bg-gray-50 min-h-screen py-12">
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
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors group"
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
                    ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                    : job.status === 'FILLED'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : job.status === 'PAUSED'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                }`}>
                  {job.status === 'OPEN' && <CheckCircle className="w-3.5 h-3.5" />}
                  {job.status}
                </span>

                {/* Featured Badge */}
                {job.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    Featured
                  </span>
                )}

                {/* Urgent Badge */}
                {job.isUrgent && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/20 text-red-300 border border-red-400/30">
                    <Zap className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    Urgent
                  </span>
                )}
              </div>

              {/* Key Details */}
              <div className="flex flex-wrap items-center gap-4 text-gray-300">
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
                  <div className="text-sm text-gray-400">Views</div>
                </div>
              )}
              {job.applicationsCount !== undefined && (
                <div className="text-center">
                  <div className="flex items-center gap-1.5 text-2xl font-bold">
                    <Send className="w-5 h-5" aria-hidden="true" />
                    <span>{job.applicationsCount}</span>
                  </div>
                  <div className="text-sm text-gray-400">Applications</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Job Description */}
              <section aria-labelledby="description-heading">
                <h2 id="description-heading" className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
                <div className="text-gray-700 leading-8 whitespace-pre-wrap">
                  {job.description}
                </div>
              </section>

              {/* Responsibilities */}
              {job.responsibilities && (
                <section aria-labelledby="responsibilities-heading">
                  <h2 id="responsibilities-heading" className="text-xl font-semibold text-gray-900 mb-4">What you&apos;ll be doing</h2>
                  <div className="text-gray-700 leading-8 whitespace-pre-wrap">
                    {job.responsibilities}
                  </div>
                </section>
              )}

              {/* Requirements */}
              {job.requirements && (
                <section aria-labelledby="requirements-heading">
                  <h2 id="requirements-heading" className="text-xl font-semibold text-gray-900 mb-4">What we&apos;re looking for</h2>
                  <div className="text-gray-700 leading-8 whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </section>
              )}

              {/* Skills Required */}
              {(job.requiredSkills || job.preferredSkills) && (
                <section aria-labelledby="skills-heading">
                  <h2 id="skills-heading" className="text-xl font-semibold text-gray-900 mb-4">Skills & Experience</h2>

                  {job.requiredSkills && parseJsonArray(job.requiredSkills).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 text-uppercase tracking-wide mb-3">Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {parseJsonArray(job.requiredSkills).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.preferredSkills && parseJsonArray(job.preferredSkills).length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 text-uppercase tracking-wide mb-3">Nice to have</h3>
                      <div className="flex flex-wrap gap-2">
                        {parseJsonArray(job.preferredSkills).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-50 text-gray-700 text-sm"
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
                  <h2 id="benefits-heading" className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>

                  {job.benefits && parseJsonArray(job.benefits).length > 0 && (
                    <div className="mb-6">
                      <ul className="space-y-3">
                        {parseJsonArray(job.benefits).map((benefit: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-700">
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
                          <li key={idx} className="flex items-start gap-3 text-gray-700">
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
                  <h2 id="education-heading" className="text-xl font-semibold text-gray-900 mb-4">Education & Certifications</h2>

                  {job.educationLevel && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Minimum Education</p>
                      <p className="font-semibold text-gray-900">{formatExperienceLevel(job.educationLevel)}</p>
                    </div>
                  )}

                  {job.certifications && parseJsonArray(job.certifications).length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-3">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {parseJsonArray(job.certifications).map((cert: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm font-medium"
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
                  <h2 id="instructions-heading" className="text-xl font-semibold text-gray-900 mb-4">How to Apply</h2>
                  <div className="text-gray-700 leading-8 whitespace-pre-wrap">
                    {job.applyInstructions}
                  </div>
                </section>
              )}

              {/* Company Info */}
              {job.companyName && (
                <section aria-labelledby="company-heading">
                  <h2 id="company-heading" className="text-xl font-semibold text-gray-900 mb-4">About the Company</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">{job.companyName}</p>
                        {job.categoryName && (
                          <p className="text-sm text-gray-600 mt-2">{job.categoryName}</p>
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Sign in to apply for this job</h3>
                  <p className="text-gray-600 mb-6">You need to be logged in to submit an application.</p>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              ) : user.role !== 'FREELANCER' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Cannot Apply</h3>
                  <p className="text-gray-600">Only freelancers can apply for jobs. Please create a freelancer profile to proceed.</p>
                </div>
              ) : user.id === job.companyId ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">You Posted This Job</h3>
                  <p className="text-gray-600">You cannot apply to your own job posting.</p>
                </div>
              ) : job.status !== 'OPEN' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Position Not Available</h3>
                  <p className="text-gray-600 mb-4">This position is {job.status.toLowerCase()}.</p>
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Job Overview</h3>
                <dl className="space-y-4">
                  {/* Salary Range */}
                  <div>
                    <dt className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      Salary Range
                    </dt>
                    <dd className="font-semibold text-gray-900 text-lg">{formatSalary()}</dd>
                  </div>

                  {job.jobType && (
                    <div>
                      <dt className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        Employment Type
                      </dt>
                      <dd className="font-semibold text-gray-900">{formatExperienceLevel(job.jobType)}</dd>
                    </div>
                  )}

                  {job.experienceLevel && (
                    <div>
                      <dt className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        Experience Level
                      </dt>
                      <dd className="font-semibold text-gray-900">{formatExperienceLevel(job.experienceLevel)}</dd>
                    </div>
                  )}

                  {job.positionsAvailable && job.positionsAvailable > 1 && (
                    <div>
                      <dt className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        Positions Available
                      </dt>
                      <dd className="font-semibold text-gray-900">{job.positionsAvailable}</dd>
                    </div>
                  )}

                  {job.startDate && (
                    <div>
                      <dt className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        Expected Start Date
                      </dt>
                      <dd className="font-semibold text-gray-900">
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
                      <dt className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        Application Deadline
                      </dt>
                      <dd className="font-semibold text-red-600">
                        {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <dt className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      Posted
                    </dt>
                    <dd className="font-semibold text-gray-900">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  Location
                </h3>
                <div className="space-y-3">
                  {job.city && (
                    <p className="text-gray-900 font-medium">
                      {job.city}{job.state && `, ${job.state}`}{job.country && `, ${job.country}`}
                    </p>
                  )}
                  {!job.city && job.location && (
                    <p className="text-gray-900 font-medium">{job.location}</p>
                  )}

                  {job.isRemote && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg px-3 py-2">
                      <Globe className="w-5 h-5" aria-hidden="true" />
                      <span className="font-semibold">
                        {job.remoteType ? formatExperienceLevel(job.remoteType) : 'Remote Position'}
                      </span>
                    </div>
                  )}

                  {job.travelRequirement && job.travelRequirement !== 'NONE' && (
                    <div className="flex items-start gap-2 text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
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
              {(job.securityClearanceRequired || job.visaSponsorship !== undefined) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    Additional Requirements
                  </h3>
                  <div className="space-y-3">
                    {job.securityClearanceRequired && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-blue-600" aria-hidden="true" />
                          <span className="font-medium text-blue-900">Security Clearance Required</span>
                        </div>
                        <CheckCircle className="w-5 h-5 text-blue-600" aria-hidden="true" />
                      </div>
                    )}

                    {job.visaSponsorship !== undefined && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-gray-600" aria-hidden="true" />
                          <span className="font-medium text-gray-900">Visa Sponsorship</span>
                        </div>
                        {job.visaSponsorship ? (
                          <span className="text-green-600 font-semibold">Available</span>
                        ) : (
                          <span className="text-gray-600">Not Available</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {(job.applicationEmail || job.applicationUrl) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
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
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-600 text-center">
                  Job ID: {job.id} • Category: {job.categoryName || 'Uncategorized'}
                </p>
                {job.updatedAt && (
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Last updated: {new Date(job.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Apply Button */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {user && user.role === 'FREELANCER' && user.id !== job.companyId && job.status === 'OPEN' && (
                <Link href={`/jobs/${jobId}/apply`} className="block">
                  <button
                    className="w-full md:w-1/3 mx-auto py-4 px-6 rounded-lg font-semibold transition-all bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" aria-hidden="true" />
                    Apply for this Job
                  </button>
                </Link>
              )}
              {(!user || user.role !== 'FREELANCER' || user.id === job.companyId || job.status !== 'OPEN') && (
                <div className="w-full md:w-1/3 mx-auto p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                  <AlertCircle className="w-5 h-5 mx-auto mb-2 text-gray-500" aria-hidden="true" />
                  {!user ? (
                    <p className="text-sm font-medium text-gray-600">Sign in to apply for this job</p>
                  ) : user.id === job.companyId ? (
                    <p className="text-sm font-medium text-gray-600">You cannot apply to your own job posting</p>
                  ) : user.role !== 'FREELANCER' ? (
                    <p className="text-sm font-medium text-gray-600">Only freelancers can apply for jobs</p>
                  ) : (
                    <p className="text-sm font-medium text-gray-600">This position is {job.status.toLowerCase()}</p>
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
