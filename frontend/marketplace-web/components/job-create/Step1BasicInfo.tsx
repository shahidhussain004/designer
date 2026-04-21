import { AlertCircle, Building2, Calendar, FileText } from 'lucide-react';
import { EXPERIENCE_LEVELS, JOB_TYPES } from './constants';
import { FormErrors, JobFormData } from './types';

interface Step1Props {
  formData: JobFormData;
  errors: FormErrors;
  companyName: string;
  companyDescription: string;
  categories: Array<{ id: number; name: string }>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function Step1BasicInfo({ formData, errors, companyName, companyDescription, categories, onChange }: Step1Props) {
  return (
    <div className="space-y-8">
      {/* Company Info */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-secondary-900">Company Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">Company Name</label>
            <input
              type="text"
              value={companyName}
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-600"
              disabled
            />
            <p className="text-xs text-secondary-500 mt-2">From your account (managed in profile settings)</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">About the Company</label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription || companyDescription}
              onChange={onChange}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-secondary-300 rounded-lg text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Tell candidates about your company, culture, and values"
            />
            <p className="text-xs text-secondary-500 mt-2">Add or update the company description for this job listing</p>
          </div>
        </div>
      </div>

      {/* Basic Job Details */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-secondary-900">Job Details</h2>
        </div>

        <div className="space-y-6">
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-secondary-700 mb-2">
              Job Title <span className="text-error-600">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Senior Full Stack Developer"
              value={formData.title}
              onChange={onChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.title ? 'border-error-300 bg-error-50' : 'border-secondary-300'
              }`}
            />
            {errors.title && (
              <div className="flex items-center gap-2 mt-2 text-error-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Category & Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-semibold text-secondary-700 mb-2">
                Category <span className="text-error-600">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={onChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.categoryId ? 'border-error-300 bg-error-50' : 'border-secondary-300'
                }`}
              >
                <option value="">Select a category</option>
                {(categories as Array<{ id: number; name: string }>)?.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && (
                <div className="flex items-center gap-2 mt-2 text-error-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.categoryId}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="jobType" className="block text-sm font-semibold text-secondary-700 mb-2">
                Job Type <span className="text-error-600">*</span>
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={onChange}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {JOB_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience Level & Positions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-semibold text-secondary-700 mb-2">
                Experience Level <span className="text-error-600">*</span>
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={onChange}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="positionsAvailable" className="block text-sm font-semibold text-secondary-700 mb-2">
                Positions Available
              </label>
              <input
                id="positionsAvailable"
                name="positionsAvailable"
                type="number"
                min="1"
                value={formData.positionsAvailable}
                onChange={onChange}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-secondary-700 mb-2">
              About the role/Job Description <span className="text-error-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide a comprehensive overview of the role, company culture, and what makes this opportunity unique..."
              value={formData.description}
              onChange={onChange}
              rows={8}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.description ? 'border-error-300 bg-error-50' : 'border-secondary-300'
              }`}
            />
            {errors.description && (
              <div className="flex items-center gap-2 mt-2 text-error-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          {/* Responsibilities */}
          <div>
            <label htmlFor="responsibilities" className="block text-sm font-semibold text-secondary-700 mb-2">
              Key Responsibilities
            </label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              placeholder="• Lead development of new features&#10;• Collaborate with cross-functional teams&#10;• Mentor junior developers"
              value={formData.responsibilities}
              onChange={onChange}
              rows={6}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-semibold text-secondary-700 mb-2">
              Requirements <span className="text-error-600">*</span>
            </label>
            <textarea
              id="requirements"
              name="requirements"
              placeholder="• 5+ years of experience in full stack development&#10;• Strong knowledge of React and Node.js&#10;• Excellent communication skills"
              value={formData.requirements}
              onChange={onChange}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.requirements ? 'border-error-300 bg-error-50' : 'border-secondary-300'
              }`}
            />
            {errors.requirements && (
              <div className="flex items-center gap-2 mt-2 text-error-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.requirements}</span>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-secondary-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Preferred Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={onChange}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-semibold text-secondary-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Application Deadline
              </label>
              <input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={onChange}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
