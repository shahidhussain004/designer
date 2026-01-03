"use client";

import { ErrorMessage } from '@/components/ErrorMessage';
import { JobDetailsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useApplyForJob, useJob } from '@/hooks/useJobs';
import { useUserProfile } from '@/hooks/useUsers';
import { useAuth } from '@/lib/auth';
import { ArrowLeft, Briefcase, Calendar, CheckCircle, DollarSign, MapPin, User, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const { user } = useAuth();

  // Fetch job details
  const { data: job, isLoading: jobLoading, error: jobError, refetch } = useJob(jobId);
  
  // Fetch employer details (dependent query)
  const { data: employer } = useUserProfile(job?.employerId || null);

  // Application mutation
  const applyForJob = useApplyForJob();

  const [applicationOpen, setApplicationOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({ 
    jobId: 0, 
    coverLetter: '', 
    resumeUrl: '' 
  });
  const [fieldErrors, setFieldErrors] = useState<{ coverLetter?: string; resumeUrl?: string }>({});

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== 'FREELANCER') {
      return;
    }

    setFieldErrors({});

    const newFieldErrors: { coverLetter?: string; resumeUrl?: string } = {};

    if (!applicationData.coverLetter || applicationData.coverLetter.trim().length === 0) {
      newFieldErrors.coverLetter = 'Cover letter is required';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      await applyForJob.mutateAsync({
        jobId: job!.id,
        coverLetter: applicationData.coverLetter,
        resumeUrl: applicationData.resumeUrl,
      });
      
      setApplicationOpen(false);
      setApplicationData({ jobId: job!.id, coverLetter: '', resumeUrl: '' });
    } catch (err) {
      // Error is handled by mutation
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

  return (
    <PageLayout>
      {/* Success/Error Alerts */}
      {applyForJob.isSuccess && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="mx-auto max-w-7xl flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            Application submitted successfully! The employer will review your application.
          </div>
        </div>
      )}

      {applyForJob.error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="mx-auto max-w-7xl flex items-center gap-2 text-red-700">
            <XCircle className="w-5 h-5" />
            {applyForJob.error instanceof Error ? applyForJob.error.message : 'Failed to submit application'}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-300">
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> {job.jobType}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {job.location}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.status === 'OPEN' 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-gray-500/20 text-gray-300'
            }`}>
              {job.status}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{job.requirements}</p>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{job.benefits}</p>
                </div>
              )}

              {/* Job Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <p className="text-sm text-gray-500 mb-1">Job Type</p>
                  <p className="font-semibold text-gray-900">{job.jobType}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{job.location}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    job.status === 'OPEN' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <p className="text-sm text-gray-500 mb-1">Posted</p>
                  <p className="font-semibold text-gray-900">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Employer Info */}
              {employer && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Employer</h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{employer.fullName}</p>
                        <p className="text-sm text-gray-500">@{employer.username}</p>
                        {employer.email && (
                          <p className="text-sm text-gray-500">{employer.email}</p>
                        )}
                      </div>
                    </div>
                    <Link 
                      href={`/users/${employer.id}/profile`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salary Card */}
              <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
                <p className="text-sm text-primary-700 mb-1">Salary Range</p>
                <p className="text-3xl font-bold text-primary-900 flex items-center gap-1">
                  <DollarSign className="w-8 h-8" />
                  {job.salary?.toLocaleString()}
                </p>
                
                {user && user.role === 'FREELANCER' && user.id !== job.employerId && (
                  <button 
                    onClick={() => setApplicationOpen(!applicationOpen)}
                    className={`w-full mt-4 py-3 px-4 rounded-lg font-medium transition-colors ${
                      applicationOpen
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {applicationOpen ? 'Cancel' : 'Apply Now'}
                  </button>
                )}
              </div>

              {/* Application Form */}
              {applicationOpen && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <form onSubmit={handleApplicationSubmit}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Application</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cover Letter <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Tell the employer why you're interested in this role"
                          value={applicationData.coverLetter}
                          onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent min-h-[150px]"
                        />
                        {fieldErrors.coverLetter && (
                          <p className="text-sm text-red-600 mt-1">{fieldErrors.coverLetter}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resume URL
                        </label>
                        <input 
                          type="url" 
                          placeholder="https://example.com/resume.pdf" 
                          value={applicationData.resumeUrl} 
                          onChange={(e) => setApplicationData({ ...applicationData, resumeUrl: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={applyForJob.isPending}
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {applyForJob.isPending ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Posted Date */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'recently'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

