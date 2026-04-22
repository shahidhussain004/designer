"use client";

import { PageLayout } from '@/components/ui';
import { useApplyForJob, useJob, useMyApplications } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Send,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function JobApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;
  const { user } = useAuth();

  // Fetch job details
  const { data: job, isLoading: jobLoading, error: jobError } = useJob(jobId);

  // Application mutation
  const applyForJob = useApplyForJob();

  // Check if user has already applied (for FREELANCER users)
  const { data: myApplications = [] } = useMyApplications();
  const alreadyApplied = Array.isArray(myApplications) &&
    myApplications.some((app: any) => String(app.jobId) === String(jobId));
  const existingApplication = Array.isArray(myApplications)
    ? myApplications.find((app: any) => String(app.jobId) === String(jobId))
    : null;

  // Form state
  const [formData, setFormData] = useState({
    resume: null as File | null,
    fullName: '',
    workEmail: '',
    phone: '',
    currentLocation: '',
    currentCompany: '',
    linkedInUrl: '',
    githubUrl: '',
    surveyLocation: '',
    jobSource: '',
    applyReasons: [] as string[],
    gender: '',
    age: '',
    messageConsent: true,
    privacyConsent: false
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const jobSources = [
    'SEB Internal job page (only for SEB employees)',
    'SEB web career page',
    'Recommendation from friend/network at SEB',
    'Facebook ad',
    'LinkedIn ad',
    'Instagram ad',
    'Recommendation from friend/network outside SEB',
    'Snapchat',
    'Glassdoor',
    'Indeed',
    'CareerEye',
    'Uptrail',
    'CareerBuilder',
    'Other'
  ];

  const applyReasonsList = [
    'Good fit for your skills',
    'Clear path for advancements within SEB',
    'Looking for a new challenge',
    'Quality of salary and benefits',
    "SEB's professional and client network",
    "SEB's culture",
    "SEB's reputation for innovation and entrepreneurship",
    "SEB's sustainability and societal impact"
  ];

  const genderOptions = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];
  const ageRanges = ['18-24', '25-30', '31-40', '41-50', '51-60', '61 or older'];
  const locations = ['Sweden', 'Norway', 'Denmark', 'Finland', 'Germany', 'United Kingdom', 'Other'];

  const handleReasonToggle = (reason: string) => {
    setFormData(prev => ({
      ...prev,
      applyReasons: prev.applyReasons.includes(reason)
        ? prev.applyReasons.filter(r => r !== reason)
        : [...prev.applyReasons, reason]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // Validate required fields
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.workEmail.trim()) errors.workEmail = 'Work email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.privacyConsent) errors.privacyConsent = 'You must accept the privacy policy';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      // Prepare survey answers as JSON object
      const answers = {
        surveyLocation: formData.surveyLocation,
        jobSource: formData.jobSource,
        applyReasons: formData.applyReasons,
        gender: formData.gender,
        age: formData.age,
        currentLocation: formData.currentLocation,
        currentCompany: formData.currentCompany,
      };

      // Submit application with all collected data
      const response = await applyForJob.mutateAsync({
        jobId: job!.id,
        fullName: formData.fullName,
        email: formData.workEmail,
        phone: formData.phone,
        coverLetter: `Applying for ${job!.title}`,
        resumeUrl: formData.linkedInUrl || formData.githubUrl || '',
        linkedinUrl: formData.linkedInUrl,
        portfolioUrl: formData.githubUrl,
        answers: answers,
      });

      // Redirect to success page with application ID
      const applicationId = response?.id || 'unknown';
      router.push(`/jobs/${jobId}/apply/success?applicationId=${applicationId}`);
    } catch (error: unknown) {
      console.error('Application submission failed:', error);
      
      // Extract error message
      let errorMessage = 'Failed to submit application';
      if (error instanceof Error) {
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
          const response = error.response as Record<string, unknown>;
          if (response.data && typeof response.data === 'object' && 'message' in response.data) {
            const data = response.data as { message: unknown };
            if (typeof data.message === 'string') {
              errorMessage = data.message;
            }
          }
        } else {
          errorMessage = error.message;
        }
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: unknown }).message);
      }
      
      setSubmissionError(errorMessage);
    }
  };

  if (jobLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-secondary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (jobError || !job) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-secondary-400" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Job Not Found</h1>
          <p className="text-secondary-600 mb-6">The job posting you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Browse Jobs
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Check eligibility
  if (!user || user.role !== 'FREELANCER' || user.id === job.companyId || job.status !== 'OPEN') {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-secondary-400" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">Cannot Apply</h1>
            <p className="text-secondary-600 mb-6">
              {!user
                ? 'You need to be signed in to apply.'
                : user.role !== 'FREELANCER'
                ? 'Only freelancers can apply for jobs.'
                : user.id === job.companyId
                ? 'You cannot apply to your own job posting.'
                : 'This position is no longer available.'}
            </p>
            <Link
              href={`/jobs/${jobId}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Job
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show "already applied" screen
  if (alreadyApplied && existingApplication) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">Already Applied</h1>
            <p className="text-secondary-600 mb-2">
              You have already submitted an application for <strong>{job.title}</strong>.
            </p>
            <p className="text-secondary-500 text-sm mb-6">
              Status: <span className="font-semibold capitalize">{existingApplication.status?.toLowerCase().replace('_', ' ')}</span>
              {existingApplication.appliedAt && (
                <> &middot; Applied {new Date(existingApplication.appliedAt).toLocaleDateString()}</>
              )}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={`/jobs/${jobId}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-50 font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Job
              </Link>
              <Link
                href="/dashboard/freelancer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors"
              >
                My Applications
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto py-8">
        {/* Job Header */}
        <div className="mb-8">
          <Link
            href={`/jobs/${jobId}`}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Job
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-secondary-600">
              {job.jobType && <span>{job.jobType}</span>}
              {job.location && <span>–</span>}
              {job.location && <span>{job.location}</span>}
              {job.categoryName && (
                <>
                  <span>–</span>
                  <span>{job.categoryName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {submissionError && (
            <div className="bg-error-50 rounded-xl border border-error-200 p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-error-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold text-error-900 mb-1">Application Failed</h3>
                  <p className="text-error-700">{submissionError}</p>
                  <p className="text-sm text-error-600 mt-2">
                    Please check your information and try again. If the problem persists, please try again later.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Instructions */}
          <div className="bg-primary-50 rounded-xl border border-primary-200 p-6">
            <h2 className="text-lg font-bold text-blue-900 mb-2">Submit your application</h2>
            <p className="text-blue-800">Complete the following information to apply for this position</p>
          </div>

          {/* Candidate Information */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Candidate Information</h2>

            <div className="space-y-6">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Resume/CV
                </label>
                <div className="relative border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-secondary-400" aria-hidden="true" />
                  <p className="text-sm text-secondary-600">
                    {formData.resume ? formData.resume.name : 'Attach Resume'}
                  </p>
                  {!formData.resume && (
                    <p className="text-xs text-secondary-500 mt-1">No file chosen</p>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Full name <span className="text-error-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, fullName: e.target.value }));
                    if (fieldErrors.fullName) {
                      setFieldErrors(prev => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { fullName, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  aria-invalid={!!fieldErrors.fullName}
                />
                {fieldErrors.fullName && (
                  <p className="text-sm text-error-600 mt-1">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* Work Email */}
              <div>
                <label htmlFor="workEmail" className="block text-sm font-medium text-secondary-700 mb-2">
                  Work email <span className="text-error-500">*</span>
                </label>
                <input
                  id="workEmail"
                  type="email"
                  value={formData.workEmail}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, workEmail: e.target.value }));
                    if (fieldErrors.workEmail) {
                      setFieldErrors(prev => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { workEmail, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  aria-invalid={!!fieldErrors.workEmail}
                />
                {fieldErrors.workEmail && (
                  <p className="text-sm text-error-600 mt-1">{fieldErrors.workEmail}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                  Phone <span className="text-error-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                    if (fieldErrors.phone) {
                      setFieldErrors(prev => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { phone, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  aria-invalid={!!fieldErrors.phone}
                />
                {fieldErrors.phone && (
                  <p className="text-sm text-error-600 mt-1">{fieldErrors.phone}</p>
                )}
              </div>

              {/* Current Location */}
              <div>
                <label htmlFor="currentLocation" className="block text-sm font-medium text-secondary-700 mb-2">
                  Current Location
                </label>
                <input
                  id="currentLocation"
                  type="text"
                  value={formData.currentLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentLocation: e.target.value }))}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Current Company */}
              <div>
                <label htmlFor="currentCompany" className="block text-sm font-medium text-secondary-700 mb-2">
                  Current Company
                </label>
                <input
                  id="currentCompany"
                  type="text"
                  value={formData.currentCompany}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentCompany: e.target.value }))}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Links</h2>

            <div className="space-y-6">
              {/* LinkedIn URL */}
              <div>
                <label htmlFor="linkedInUrl" className="block text-sm font-medium text-secondary-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  id="linkedInUrl"
                  type="url"
                  value={formData.linkedInUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedInUrl: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-secondary-700 mb-2">
                  GitHub URL
                </label>
                <input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/yourprofile"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Demographic Survey */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="space-y-8">
              {/* Location Selection */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  What is your location?
                </label>
                <div className="space-y-2">
                  {locations.map(location => (
                    <label key={location} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="surveyLocation"
                        value={location}
                        checked={formData.surveyLocation === location}
                        onChange={(e) => setFormData(prev => ({ ...prev, surveyLocation: e.target.value }))}
                        className="w-4 h-4"
                      />
                      <span className="text-secondary-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Show rest of survey only if location is selected */}
              {formData.surveyLocation && (
                <>
                  <div className="pt-6 border-t border-secondary-200">
                    <h2 className="text-xl font-bold text-secondary-900 mb-2">Demographic Survey</h2>
                    <p className="text-sm text-secondary-600 mb-6">
                      As part of our commitment to inclusion and diversity, we invite you to participate in a survey. Your feedback will help us enhance our job ads and improve our inclusion & diversity efforts. Rest assured that your responses will be kept secure, confidential, and completely separate from your name or job application.
                    </p>
                  </div>

                  {/* Where did you find the job */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-3">
                      From where did you first get information about this job?
                    </label>
                    <div className="space-y-2">
                      {jobSources.map(source => (
                        <label key={source} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="jobSource"
                            value={source}
                            checked={formData.jobSource === source}
                            onChange={(e) => setFormData(prev => ({ ...prev, jobSource: e.target.value }))}
                            className="w-4 h-4"
                          />
                          <span className="text-secondary-700">{source}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Reasons for applying */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-3">
                      What were the biggest reasons for applying to this position?
                    </label>
                    <p className="text-xs text-secondary-600 mb-3">Select all that apply</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {applyReasonsList.map(reason => (
                        <label key={reason} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.applyReasons.includes(reason)}
                            onChange={() => handleReasonToggle(reason)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-secondary-700">{reason}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-3">
                      What gender do you identify as?
                    </label>
                    <div className="space-y-2">
                      {genderOptions.map(option => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={option}
                            checked={formData.gender === option}
                            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                            className="w-4 h-4"
                          />
                          <span className="text-secondary-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-3">
                      What is your age?
                    </label>
                    <div className="space-y-2">
                      {ageRanges.map(range => (
                        <label key={range} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="age"
                            value={range}
                            checked={formData.age === range}
                            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                            className="w-4 h-4"
                          />
                          <span className="text-secondary-700">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Privacy & Consent */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.messageConsent}
                  onChange={(e) => setFormData(prev => ({ ...prev, messageConsent: e.target.checked }))}
                  className="w-4 h-4 mt-1"
                />
                <span className="text-sm text-secondary-700">
                  I agree to receive messages about my application and job opportunities from the company
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={(e) => setFormData(prev => ({ ...prev, privacyConsent: e.target.checked }))}
                  className="w-4 h-4 mt-1"
                  aria-invalid={!!fieldErrors.privacyConsent}
                />
                <span className="text-sm text-secondary-700">
                  I have read and accept the privacy policy and terms & conditions <span className="text-error-500">*</span>
                </span>
              </label>
              {fieldErrors.privacyConsent && (
                <p className="text-sm text-error-600">{fieldErrors.privacyConsent}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={applyForJob.isPending}
              className="w-full md:w-1/2 py-4 px-6 rounded-lg font-semibold transition-all bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {applyForJob.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" aria-hidden="true" />
                  Submit application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
