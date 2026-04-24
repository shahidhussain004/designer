import { AlertCircle, Briefcase, CheckCircle, Star } from 'lucide-react';
import { JobFormData } from './types';

interface Step5Props {
  formData: JobFormData;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function Step5Application({ formData, onChange }: Step5Props) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-secondary-900">Application Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Application Email */}
          <div>
            <label htmlFor="applicationEmail" className="block text-sm font-semibold text-secondary-700 mb-2">
              Application Email
            </label>
            <input
              id="applicationEmail"
              name="applicationEmail"
              type="email"
              placeholder="careers@company.com"
              value={formData.applicationEmail}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Application URL */}
          <div>
            <label htmlFor="applicationUrl" className="block text-sm font-semibold text-secondary-700 mb-2">
              Application URL
            </label>
            <input
              id="applicationUrl"
              name="applicationUrl"
              type="url"
              placeholder="https://company.com/careers"
              value={formData.applicationUrl}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Apply Instructions */}
          <div>
            <label htmlFor="applyInstructions" className="block text-sm font-semibold text-secondary-700 mb-2">
              Application Instructions
            </label>
            <textarea
              id="applyInstructions"
              name="applyInstructions"
              placeholder="Please submit your resume and cover letter. Include links to your portfolio or GitHub profile if available."
              value={formData.applyInstructions}
              onChange={onChange}
              rows={4}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-secondary-700 mb-2">
              Job Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="DRAFT">Draft (not visible to candidates)</option>
              <option value="OPEN">Open (accepting applications)</option>
            </select>
            <p className="text-xs text-secondary-500 mt-1">You can publish later from your dashboard</p>
          </div>

          {/* Featured & Urgent */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={onChange}
                className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-warning-600" />
                <div>
                  <span className="font-semibold text-secondary-900">Featured Job</span>
                  <p className="text-sm text-secondary-600">Highlight this job in search results</p>
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
              <input
                type="checkbox"
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={onChange}
                className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-error-600" />
                <div>
                  <span className="font-semibold text-secondary-900">Urgent Hire</span>
                  <p className="text-sm text-secondary-600">Mark as urgent hiring need</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Preview Note */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Ready to Publish?</h3>
            <p className="text-secondary-700">
              Review all the information above before submitting. You can edit the job posting anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
