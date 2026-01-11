'use client';

import { PageLayout } from '@/components/ui';
import { useCreateJob } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CreateJobRequest {
  title: string;
  description: string;
  companyName: string;
  salary: number;
  jobType: string;
  location: string;
  requirements: string;
  benefits: string;
}

export default function CreateJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createJob = useCreateJob();

  const [formData, setFormData] = useState<CreateJobRequest>({
    title: '',
    description: '',
    companyName: '',
    salary: 0,
    jobType: 'FULL_TIME',
    location: '',
    requirements: '',
    benefits: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && user.role !== 'CLIENT') {
      router.push('/jobs');
    }
  }, [router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.salary || formData.salary <= 0) {
      newErrors.salary = 'Valid salary is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    try {
      const result = await createJob.mutateAsync(formData);
      setTimeout(() => {
        router.push(`/jobs/${result.id}`);
      }, 1500);
    } catch (err) {
      // Error handled by mutation
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="bg-gray-50 min-h-screen py-12">
          <div className="mx-auto max-w-4xl px-4">
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5" />
              Please log in to post a job
            </div>
            <Link href="/jobs" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (user.role !== 'CLIENT') {
    return (
      <PageLayout>
        <div className="bg-gray-50 min-h-screen py-12">
          <div className="mx-auto max-w-4xl px-4">
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5" />
              Only clients can post jobs
            </div>
            <Link href="/jobs" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/jobs" className="text-gray-300 hover:text-white flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold">Post a New Job</h1>
          <p className="text-gray-300 mt-2">Find the perfect candidate for your position</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Alerts */}
          {createJob.isSuccess && (
            <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5" />
              Job posted successfully! Redirecting...
            </div>
          )}

          {createJob.error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2 mb-6">
              <XCircle className="w-5 h-5" />
              {createJob.error instanceof Error ? createJob.error.message : 'Failed to create job'}
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Full Stack Developer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent"
                    />
                    {fieldErrors.title && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your company name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent"
                    />
                    {fieldErrors.companyName && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.companyName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.jobType}
                        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent bg-white"
                      >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="TEMPORARY">Temporary</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Remote, New York, NY"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent"
                      />
                      {fieldErrors.location && (
                        <p className="text-sm text-red-600 mt-1">{fieldErrors.location}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary (Annual) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 100000"
                      value={formData.salary || ''}
                      onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent"
                    />
                    {fieldErrors.salary && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.salary}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Describe the job role, responsibilities, and what you're looking for"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent"
                    />
                    {fieldErrors.description && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="List the key skills and experience required"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent"
                    />
                    {fieldErrors.requirements && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.requirements}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                    <textarea
                      placeholder="Describe benefits, perks, and what makes your company great"
                      value={formData.benefits}
                      onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Link 
                  href="/jobs"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={createJob.isPending}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {createJob.isPending ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">💡 Tips for a Great Job Post</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Title</h3>
                <p className="text-sm text-blue-800">Be clear and specific. Include the level and key technology if relevant. Example: &quot;Senior React Developer&quot; instead of just &quot;Developer&quot;</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Description</h3>
                <p className="text-sm text-blue-800">Explain what the role entails, day-to-day responsibilities, and the impact they&apos;ll have. Help candidates understand the position fully.</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Requirements</h3>
                <p className="text-sm text-blue-800">List essential skills first, then nice-to-have skills separately. Be realistic about the experience level needed for the role.</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Salary & Benefits</h3>
                <p className="text-sm text-blue-800">Provide a salary range to attract qualified candidates. Highlight unique benefits and company culture to stand out.</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Location</h3>
                <p className="text-sm text-blue-800">Be clear about remote work options. If flexible, mention it explicitly. Candidates appreciate transparency about location requirements.</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Be Specific</h3>
                <p className="text-sm text-blue-800">Mention specific technologies, tools, and frameworks you use. This helps qualified candidates self-select and reduces noise.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
