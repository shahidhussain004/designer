"use client";

import { EDUCATION_LEVELS, EXPERIENCE_LEVELS, JOB_TYPES, REMOTE_TYPES, SALARY_PERIODS } from '@/components/job-create/constants';
import { PageLayout } from '@/components/ui';
import { useCategories } from '@/hooks/useContent';
import { useJob, useMyCompany, useUpdateJob } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import { AlertCircle, ArrowLeft, Briefcase, CheckCircle, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const parseJsonArrayToString = (data: unknown): string => {
  if (!data) return '';
  if (Array.isArray(data)) {
    // Handle array of objects - extract "skill" or "name" property, or convert to string
    return data
      .map((item: unknown) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          // Try to extract skill name from various possible property names
          return (obj.skill || obj.name || obj.text || String(item)).toString();
        }
        return String(item);
      })
      .join(', ');
  }
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item: unknown) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
              const obj = item as Record<string, unknown>;
              return (obj.skill || obj.name || obj.text || String(item)).toString();
            }
            return String(item);
          })
          .join(', ');
      }
      return data;
    } catch {
      return data;
    }
  }
  return '';
};

const centsToDisplay = (cents?: number | null): string => {
  if (!cents) return '';
  return (cents / 100).toString();
};

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobId = params.id as string;

  const { data: job, isLoading: jobLoading } = useJob(jobId);
  const { data: myCompany, isLoading: companyLoading } = useMyCompany(user?.role === 'COMPANY');
  const { data: categories = [] } = useCategories();
  const updateJobMutation = useUpdateJob();

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    categoryId: '',
    jobType: 'FULL_TIME',
    experienceLevel: '',
    location: '',
    city: '',
    state: '',
    country: '',
    isRemote: false,
    remoteType: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'ANNUAL',
    showSalary: true,
    requiredSkills: '',
    preferredSkills: '',
    educationLevel: '',
    benefits: '',
    perks: '',
    applicationEmail: '',
    applicationUrl: '',
    applyInstructions: '',
    applicationDeadline: '',
    positionsAvailable: '1',
    visaSponsorship: false,
    securityClearanceRequired: false,
    status: 'DRAFT',
  });

  // Populate form when job data loads
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        responsibilities: ((job as unknown as Record<string, unknown>).responsibilities as string | undefined) || '',
        requirements: ((job as unknown as Record<string, unknown>).requirements as string | undefined) || '',
        categoryId: String((job as unknown as Record<string, unknown>).categoryId || ''),
        jobType: job.jobType || 'FULL_TIME',
        experienceLevel: typeof job.experienceLevel === 'string' ? job.experienceLevel : '',
        location: ((job as unknown as Record<string, unknown>).location as string | undefined) || '',
        city: ((job as unknown as Record<string, unknown>).city as string | undefined) || '',
        state: ((job as unknown as Record<string, unknown>).state as string | undefined) || '',
        country: ((job as unknown as Record<string, unknown>).country as string | undefined) || '',
        isRemote: ((job as unknown as Record<string, unknown>).isRemote as boolean | undefined) || false,
        remoteType: ((job as unknown as Record<string, unknown>).remoteType as string | undefined) || '',
        salaryMin: centsToDisplay((job as unknown as Record<string, unknown>).salaryMinCents as number | null),
        salaryMax: centsToDisplay((job as unknown as Record<string, unknown>).salaryMaxCents as number | null),
        salaryCurrency: ((job as unknown as Record<string, unknown>).salaryCurrency as string | undefined) || 'USD',
        salaryPeriod: ((job as unknown as Record<string, unknown>).salaryPeriod as string | undefined) || 'ANNUAL',
        showSalary: (job as unknown as Record<string, unknown>).showSalary !== false,
        requiredSkills: parseJsonArrayToString((job as unknown as Record<string, unknown>).requiredSkills),
        preferredSkills: parseJsonArrayToString((job as unknown as Record<string, unknown>).preferredSkills),
        educationLevel: ((job as unknown as Record<string, unknown>).educationLevel as string | undefined) || '',
        benefits: parseJsonArrayToString((job as unknown as Record<string, unknown>).benefits),
        perks: parseJsonArrayToString((job as unknown as Record<string, unknown>).perks),
        applicationEmail: ((job as unknown as Record<string, unknown>).applicationEmail as string | undefined) || '',
        applicationUrl: ((job as unknown as Record<string, unknown>).applicationUrl as string | undefined) || '',
        applyInstructions: ((job as unknown as Record<string, unknown>).applyInstructions as string | undefined) || '',
        applicationDeadline: (job as unknown as Record<string, unknown>).applicationDeadline
          ? new Date((job as unknown as Record<string, unknown>).applicationDeadline as string).toISOString().split('T')[0]
          : '',
        positionsAvailable: String((job as unknown as Record<string, unknown>).positionsAvailable || 1),
        visaSponsorship: ((job as unknown as Record<string, unknown>).visaSponsorship as boolean | undefined) || false,
        securityClearanceRequired: ((job as unknown as Record<string, unknown>).securityClearanceRequired as boolean | undefined) || false,
        status: job.status || 'DRAFT',
      });
    }
  }, [job]);

  const isLoading = jobLoading || companyLoading;

  // Determine ownership using both API flag and company ID comparison
  const isOwner = user?.role === 'COMPANY' && (
    (job as unknown as Record<string, unknown>)?.isOwner === true ||
    (myCompany?.id != null && (job as unknown as Record<string, unknown>)?.companyId != null && myCompany.id === (job as unknown as Record<string, unknown>).companyId)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, publishAfterSave?: boolean) => {
    e.preventDefault();

    const skillsArray = (str: string) =>
      str.split(',').map(s => s.trim()).filter(Boolean);

    const updateData: Record<string, unknown> = {
      title: formData.title,
      description: formData.description,
      responsibilities: formData.responsibilities || undefined,
      requirements: formData.requirements,
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel || undefined,
      location: formData.location,
      city: formData.city || undefined,
      state: formData.state || undefined,
      country: formData.country || undefined,
      isRemote: formData.isRemote,
      remoteType: formData.isRemote && formData.remoteType ? formData.remoteType : undefined,
      salaryMinCents: formData.salaryMin ? Math.round(Number(formData.salaryMin) * 100) : undefined,
      salaryMaxCents: formData.salaryMax ? Math.round(Number(formData.salaryMax) * 100) : undefined,
      salaryCurrency: formData.salaryCurrency,
      salaryPeriod: formData.salaryPeriod,
      showSalary: formData.showSalary,
      requiredSkills: skillsArray(formData.requiredSkills),
      preferredSkills: skillsArray(formData.preferredSkills),
      educationLevel: formData.educationLevel || undefined,
      benefits: skillsArray(formData.benefits),
      perks: skillsArray(formData.perks),
      applicationEmail: formData.applicationEmail || undefined,
      applicationUrl: formData.applicationUrl || undefined,
      applyInstructions: formData.applyInstructions || undefined,
      applicationDeadline: formData.applicationDeadline
        ? `${formData.applicationDeadline}T23:59:59`
        : undefined,
      positionsAvailable: Number(formData.positionsAvailable) || 1,
      visaSponsorship: formData.visaSponsorship,
      securityClearanceRequired: formData.securityClearanceRequired,
      status: publishAfterSave ? 'OPEN' : formData.status,
    };

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateJobMutation.mutateAsync({ id: jobId, input: updateData as Record<string, unknown> });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (publishAfterSave) {
        router.push(`/jobs/${jobId}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </PageLayout>
    );
  }

  if (!job) {
    return (
      <PageLayout>
        <div className="bg-secondary-50 min-h-screen py-12">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <p className="text-error-600 mb-4">Job not found</p>
            <Link href="/jobs" className="text-primary-600 hover:underline">Back to Jobs</Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!isOwner) {
    return (
      <PageLayout>
        <div className="bg-secondary-50 min-h-screen py-12">
          <div className="mx-auto max-w-2xl px-4">
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error-500" />
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">Access Denied</h1>
              <p className="text-secondary-600 mb-6">You don&apos;t have permission to edit this job posting.</p>
              <Link href={`/jobs/${jobId}`} className="text-primary-600 hover:underline">Back to Job</Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/jobs/${jobId}`}
            className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Job
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Job Posting</h1>
              <p className="text-primary-100 text-sm mt-0.5">{job.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-secondary-50 py-8 lg:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── Section 1: Basic Information ── */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-5">Basic Information</h2>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Job Title <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text" name="title" value={formData.title} onChange={handleChange}
                    required placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Category</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">Select category</option>
                      {(categories as Record<string, unknown>[]).map((cat) => (
                        <option key={cat.id as string} value={cat.id as string}>{cat.name as string}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Employment Type</label>
                    <select name="jobType" value={formData.jobType} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Experience Level</label>
                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">Select level</option>
                      {EXPERIENCE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Positions Available</label>
                    <input type="number" name="positionsAvailable" value={formData.positionsAvailable}
                      onChange={handleChange} min="1"
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Job Description <span className="text-error-500">*</span>
                  </label>
                  <textarea name="description" value={formData.description} onChange={handleChange}
                    required rows={6} placeholder="Describe the role, company culture, and what makes this opportunity great..."
                    className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">Responsibilities</label>
                  <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange}
                    rows={4} placeholder="List the main responsibilities..."
                    className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Requirements <span className="text-error-500">*</span>
                  </label>
                  <textarea name="requirements" value={formData.requirements} onChange={handleChange}
                    required rows={4} placeholder="List required qualifications, skills, and experience..."
                    className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                  />
                </div>
              </div>
            </div>

            {/* ── Section 2: Location ── */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-5">Location</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange}
                      placeholder="e.g. Stockholm, Sweden"
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">State / Region</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="isRemote" name="isRemote" checked={formData.isRemote}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 rounded border-secondary-300"
                  />
                  <span className="text-sm font-medium text-secondary-700">Remote work available</span>
                </label>
                {formData.isRemote && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Remote Type</label>
                    <select name="remoteType" value={formData.remoteType} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">Select remote type</option>
                      {REMOTE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* ── Section 3: Compensation ── */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-5">Compensation</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="showSalary" checked={formData.showSalary} onChange={handleChange}
                    className="w-4 h-4 text-primary-600 rounded border-secondary-300"
                  />
                  <span className="text-sm font-medium text-secondary-700">Show salary range publicly</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Minimum Salary</label>
                    <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange}
                      placeholder="e.g. 50000" min="0"
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Maximum Salary</label>
                    <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange}
                      placeholder="e.g. 80000" min="0"
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Currency</label>
                    <select name="salaryCurrency" value={formData.salaryCurrency} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      {['USD','EUR','GBP','SEK','NOK','DKK'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Pay Period</label>
                    <select name="salaryPeriod" value={formData.salaryPeriod} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      {SALARY_PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 4: Skills & Education ── */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-5">Skills & Education</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Required Skills <span className="text-secondary-500 font-normal">(comma-separated)</span>
                  </label>
                  <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange}
                    placeholder="e.g. React, TypeScript, Node.js"
                    className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Preferred Skills <span className="text-secondary-500 font-normal">(comma-separated)</span>
                  </label>
                  <input type="text" name="preferredSkills" value={formData.preferredSkills} onChange={handleChange}
                    placeholder="e.g. Docker, AWS, GraphQL"
                    className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">Education Level</label>
                  <select name="educationLevel" value={formData.educationLevel} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Not required</option>
                    {EDUCATION_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* ── Section 5: Benefits & Application ── */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-5">Benefits & Application</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Benefits <span className="text-secondary-500 font-normal">(comma-separated)</span>
                  </label>
                  <input type="text" name="benefits" value={formData.benefits} onChange={handleChange}
                    placeholder="e.g. Health insurance, 401k, Flexible hours"
                    className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Perks <span className="text-secondary-500 font-normal">(comma-separated)</span>
                  </label>
                  <input type="text" name="perks" value={formData.perks} onChange={handleChange}
                    placeholder="e.g. Home office stipend, Team events"
                    className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="pt-2 border-t border-secondary-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Application Deadline</label>
                    <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Application Email</label>
                    <input type="email" name="applicationEmail" value={formData.applicationEmail} onChange={handleChange}
                      placeholder="hr@company.com"
                      className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">Application Instructions</label>
                  <textarea name="applyInstructions" value={formData.applyInstructions} onChange={handleChange}
                    rows={3} placeholder="Describe any specific application process..."
                    className="w-full px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                  />
                </div>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="visaSponsorship" checked={formData.visaSponsorship} onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded border-secondary-300"
                    />
                    <span className="text-sm text-secondary-700">Visa sponsorship available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="securityClearanceRequired" checked={formData.securityClearanceRequired}
                      onChange={handleChange} className="w-4 h-4 text-primary-600 rounded border-secondary-300"
                    />
                    <span className="text-sm text-secondary-700">Security clearance required</span>
                  </label>
                </div>
                <div className="pt-2 border-t border-secondary-100">
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">Publication Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}
                    className="w-full sm:w-56 px-3 py-2.5 rounded-lg border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="DRAFT">Draft (not visible publicly)</option>
                    <option value="OPEN">Published (visible to all)</option>
                    <option value="CLOSED">Closed (no new applications)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-5">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <Link href={`/jobs/${jobId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-50 font-medium transition-colors text-sm">
                  <ArrowLeft className="w-4 h-4" /> Cancel
                </Link>
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  {saveSuccess && (
                    <span className="flex items-center gap-1.5 text-success-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" /> Saved!
                    </span>
                  )}
                  <button type="submit" disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors text-sm disabled:opacity-50">
                    {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
                  </button>
                  {formData.status === 'DRAFT' && (
                    <button type="button" disabled={isSaving}
                      onClick={(e) => handleSubmit(e as React.MouseEvent<HTMLButtonElement>, true)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-success-600 text-white hover:bg-success-700 font-semibold transition-colors text-sm disabled:opacity-50">
                      Save &amp; Publish
                    </button>
                  )}
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </PageLayout>
  );
}

