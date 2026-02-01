"use client";

import { useCategories } from '@/hooks/useContent';
import { useCreateJob } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const REMOTE_TYPES = [
  'fully_remote',
  'partially_remote',
  'onsite_only',
];

const TRAVEL_REQUIREMENTS = [
  'no_travel',
  'occasional_travel',
  'frequent_travel',
  'relocation_required',
];

const SALARY_PERIODS = [
  'hourly',
  'monthly',
  'yearly',
];

const EDUCATION_LEVELS = [
  'high_school',
  'associate',
  'bachelor',
  'master',
  'phd',
];

export default function CreateJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createJobMutation = useCreateJob();
  const isPending = createJobMutation.status === 'pending';
  const { data: categories = [] } = useCategories();

  const [companyName, setCompanyName] = useState('');

  const [formData, setFormData] = useState({
    // Basic Information
    categoryId: '',
    title: '',
    description: '',

    // Job Details
    jobType: 'fixed',
    experienceLevel: 'intermediate',
    positionsAvailable: '1',
    startDate: '',
    applicationDeadline: '',

    // Location
    location: '',
    city: '',
    state: '',
    country: '',
    isRemote: false,
    remoteType: '',
    travelRequirement: 'no_travel',

    // Compensation
    salaryMinCents: '',
    salaryMaxCents: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'monthly',
    showSalary: false,

    // Requirements & Skills
    requirements: '',
    responsibilities: '',
    requiredSkills: '',
    preferredSkills: '',
    educationLevel: '',
    certifications: '',

    // Benefits & Perks
    benefits: '',
    perks: '',

    // Application Settings
    applicationEmail: '',
    applicationUrl: '',
    applyInstructions: '',
    status: 'DRAFT',
    visaSponsorship: false,
    securityClearanceRequired: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill company name from logged-in user
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/jobs/create');
    } else if (user.role !== 'COMPANY' && user.role !== 'ADMIN') {
      window.alert('Access Denied: Only companies can post jobs');
      router.push('/jobs');
    } else {
      // Set company name from user
      setCompanyName(user.companyName || user.fullName || user.email);
    }
  }, [user, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!String(formData.categoryId).trim()) newErrors.categoryId = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.jobType.trim()) newErrors.jobType = 'Job type is required';
    if (!String(formData.experienceLevel).trim()) newErrors.experienceLevel = 'Experience level is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    // Salary validation
    const minSalary = formData.salaryMinCents ? Number(formData.salaryMinCents) : null;
    const maxSalary = formData.salaryMaxCents ? Number(formData.salaryMaxCents) : null;

    if (minSalary !== null && maxSalary !== null && minSalary > maxSalary) {
      newErrors.salary = 'Minimum salary cannot exceed maximum salary';
    }

    if (Number(formData.positionsAvailable) < 1) {
      newErrors.positionsAvailable = 'Must have at least 1 position available';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.alert('Please fix the validation errors before submitting');
      return;
    }

    try {
      const skillsArray = (str: string) =>
        str
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);

      await createJobMutation.mutateAsync({
        categoryId: Number(formData.categoryId),
        title: formData.title,
        description: formData.description,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        location: formData.location,
        city: formData.city || undefined,
        state: formData.state || undefined,
        country: formData.country || undefined,
        isRemote: formData.isRemote,
        remoteType: formData.isRemote ? formData.remoteType : undefined,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities || undefined,
        requiredSkills: skillsArray(formData.requiredSkills),
        preferredSkills: skillsArray(formData.preferredSkills),
        educationLevel: formData.educationLevel || undefined,
        certifications: skillsArray(formData.certifications),
        salaryMinCents: formData.salaryMinCents ? Math.round(Number(formData.salaryMinCents) * 100) : undefined,
        salaryMaxCents: formData.salaryMaxCents ? Math.round(Number(formData.salaryMaxCents) * 100) : undefined,
        salaryCurrency: formData.salaryCurrency,
        salaryPeriod: formData.salaryPeriod,
        showSalary: formData.showSalary,
        benefits: skillsArray(formData.benefits),
        perks: skillsArray(formData.perks),
        applicationEmail: formData.applicationEmail || undefined,
        applicationUrl: formData.applicationUrl || undefined,
        applyInstructions: formData.applyInstructions || undefined,
        status: formData.status || undefined,
        applicationDeadline: formData.applicationDeadline || undefined,
        startDate: formData.startDate || undefined,
        positionsAvailable: Number(formData.positionsAvailable) || undefined,
        travelRequirement: formData.travelRequirement || undefined,
        visaSponsorship: formData.visaSponsorship,
        securityClearanceRequired: formData.securityClearanceRequired,
      });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to create job');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!user || (user.role !== 'COMPANY' && user.role !== 'ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
              <p className="text-sm text-gray-600 mt-1">Fill out all details to attract the best candidates</p>
            </div>
            <Link href="/jobs" className="text-primary-600 hover:text-primary-700">← Back to Jobs</Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Company Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              disabled
              value={companyName}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div className="space-y-4">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Senior UI/UX Designer"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide a detailed overview of the job, company, and what makes this role exciting..."
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Job Details Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Job Type */}
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                Job Type *
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level *
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Positions Available */}
            <div>
              <label htmlFor="positionsAvailable" className="block text-sm font-medium text-gray-700 mb-1">
                Positions Available
              </label>
              <input
                id="positionsAvailable"
                name="positionsAvailable"
                type="number"
                min="1"
                value={formData.positionsAvailable}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Application Deadline */}
            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                Application Deadline
              </label>
              <input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>

          <div className="space-y-4">
            {/* Remote Option */}
            <div className="flex items-center">
              <input
                id="isRemote"
                name="isRemote"
                type="checkbox"
                checked={formData.isRemote}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isRemote" className="ml-2 text-sm font-medium text-gray-700">
                This is a remote position
              </label>
            </div>

            {/* Remote Type */}
            {formData.isRemote && (
              <div>
                <label htmlFor="remoteType" className="block text-sm font-medium text-gray-700 mb-1">
                  Remote Type
                </label>
                <select
                  id="remoteType"
                  name="remoteType"
                  value={formData.remoteType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select remote type</option>
                  {REMOTE_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Location *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g., New York, USA"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* City, State, Country */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="NY"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="USA"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Travel Requirement */}
            <div>
              <label htmlFor="travelRequirement" className="block text-sm font-medium text-gray-700 mb-1">
                Travel Requirement
              </label>
              <select
                id="travelRequirement"
                name="travelRequirement"
                value={formData.travelRequirement}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {TRAVEL_REQUIREMENTS.map(type => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Compensation Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compensation</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="showSalary"
                name="showSalary"
                type="checkbox"
                checked={formData.showSalary}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="showSalary" className="ml-2 text-sm font-medium text-gray-700">
                Show salary range publicly
              </label>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Minimum Salary */}
              <div>
                <label htmlFor="salaryMinCents" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Salary
                </label>
                <input
                  id="salaryMinCents"
                  name="salaryMinCents"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.salaryMinCents}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Maximum Salary */}
              <div>
                <label htmlFor="salaryMaxCents" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Salary
                </label>
                <input
                  id="salaryMaxCents"
                  name="salaryMaxCents"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.salaryMaxCents}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Currency & Period */}
              <div>
                <label htmlFor="salaryCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency / Period
                </label>
                <div className="flex gap-2">
                  <select
                    name="salaryCurrency"
                    value={formData.salaryCurrency}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                  <select
                    name="salaryPeriod"
                    value={formData.salaryPeriod}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {SALARY_PERIODS.map(period => (
                      <option key={period} value={period}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {errors.salary && <p className="text-red-600 text-sm mt-1">{errors.salary}</p>}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements & Skills</h2>

          <div className="space-y-4">
            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                placeholder="List the key requirements for this position..."
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.requirements && <p className="text-red-600 text-sm mt-1">{errors.requirements}</p>}
            </div>

            {/* Responsibilities */}
            <div>
              <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                Responsibilities
              </label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                placeholder="Describe the main responsibilities for this position..."
                value={formData.responsibilities}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Required Skills */}
            <div>
              <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills
              </label>
              <textarea
                id="requiredSkills"
                name="requiredSkills"
                placeholder="e.g., Figma, Adobe XD, Prototyping (comma-separated)"
                value={formData.requiredSkills}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Enter skills separated by commas</p>
            </div>

            {/* Preferred Skills */}
            <div>
              <label htmlFor="preferredSkills" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Skills
              </label>
              <textarea
                id="preferredSkills"
                name="preferredSkills"
                placeholder="Nice-to-have skills (comma-separated)"
                value={formData.preferredSkills}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Enter skills separated by commas</p>
            </div>

            {/* Education Level */}
            <div>
              <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Education Level
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Not specified</option>
                {EDUCATION_LEVELS.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Certifications */}
            <div>
              <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">
                Required Certifications
              </label>
              <textarea
                id="certifications"
                name="certifications"
                placeholder="e.g., UX Certification, Design Thinking (comma-separated)"
                value={formData.certifications}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Enter certifications separated by commas</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Special Requirements</h2>

          <div className="space-y-4">
            {/* Benefits */}
            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                Benefits
              </label>
              <textarea
                id="benefits"
                name="benefits"
                placeholder="e.g., Health insurance, 401k, Flexible hours (comma-separated)"
                value={formData.benefits}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Enter benefits separated by commas</p>
            </div>

            {/* Perks */}
            <div>
              <label htmlFor="perks" className="block text-sm font-medium text-gray-700 mb-1">
                Perks
              </label>
              <textarea
                id="perks"
                name="perks"
                placeholder="e.g., Free coffee, Team outings, Learning budget (comma-separated)"
                value={formData.perks}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Enter perks separated by commas</p>
            </div>

            {/* Visa Sponsorship */}
            <div className="flex items-center">
              <input
                id="visaSponsorship"
                name="visaSponsorship"
                type="checkbox"
                checked={formData.visaSponsorship}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="visaSponsorship" className="ml-2 text-sm font-medium text-gray-700">
                Visa sponsorship available
              </label>
            </div>

            {/* Security Clearance */}
            <div className="flex items-center">
              <input
                id="securityClearanceRequired"
                name="securityClearanceRequired"
                type="checkbox"
                checked={formData.securityClearanceRequired}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="securityClearanceRequired" className="ml-2 text-sm font-medium text-gray-700">
                Security clearance required
              </label>
            </div>
          </div>
        </div>

        {/* Application Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Settings</h2>

          <div className="space-y-4">
            {/* Application Email */}
            <div>
              <label htmlFor="applicationEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Application Email
              </label>
              <input
                id="applicationEmail"
                name="applicationEmail"
                type="email"
                placeholder="careers@company.com"
                value={formData.applicationEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Application URL */}
            <div>
              <label htmlFor="applicationUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Application URL
              </label>
              <input
                id="applicationUrl"
                name="applicationUrl"
                type="url"
                placeholder="https://company.com/apply"
                value={formData.applicationUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Application Instructions */}
            <div>
              <label htmlFor="applyInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                Application Instructions
              </label>
              <textarea
                id="applyInstructions"
                name="applyInstructions"
                placeholder="Provide any special instructions for applicants..."
                value={formData.applyInstructions}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
                {/* Posting Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Posting Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="DRAFT">Draft (save without publishing)</option>
                    <option value="OPEN">Open (publish now)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Choose Draft to save and publish later, or Open to publish immediately.</p>
                </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Posting...' : 'Post Job'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/jobs')}
            disabled={isPending}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
