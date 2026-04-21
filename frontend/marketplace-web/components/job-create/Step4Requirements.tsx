import { Shield, Target } from 'lucide-react';
import { EDUCATION_LEVELS } from './constants';
import { JobFormData } from './types';

interface Step4Props {
  formData: JobFormData;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function Step4Requirements({ formData, onChange }: Step4Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-secondary-900">Skills & Qualifications</h2>
      </div>

      <div className="space-y-6">
        {/* Required Skills */}
        <div>
          <label htmlFor="requiredSkills" className="block text-sm font-semibold text-secondary-700 mb-2">
            Required Skills (comma-separated)
          </label>
          <textarea
            id="requiredSkills"
            name="requiredSkills"
            placeholder="React, Node.js, TypeScript, PostgreSQL, AWS"
            value={formData.requiredSkills}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-secondary-500 mt-1">Separate each skill with a comma</p>
        </div>

        {/* Preferred Skills */}
        <div>
          <label htmlFor="preferredSkills" className="block text-sm font-semibold text-secondary-700 mb-2">
            Preferred Skills (comma-separated)
          </label>
          <textarea
            id="preferredSkills"
            name="preferredSkills"
            placeholder="Docker, Kubernetes, GraphQL, CI/CD"
            value={formData.preferredSkills}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-secondary-500 mt-1">Nice to have but not mandatory</p>
        </div>

        {/* Education Level */}
        <div>
          <label htmlFor="educationLevel" className="block text-sm font-semibold text-secondary-700 mb-2">
            Minimum Education Level
          </label>
          <select
            id="educationLevel"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={onChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">No specific requirement</option>
            {EDUCATION_LEVELS.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

        {/* Certifications */}
        <div>
          <label htmlFor="certifications" className="block text-sm font-semibold text-secondary-700 mb-2">
            Required Certifications (comma-separated)
          </label>
          <textarea
            id="certifications"
            name="certifications"
            placeholder="AWS Certified Solutions Architect, PMP, Scrum Master"
            value={formData.certifications}
            onChange={onChange}
            rows={2}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-secondary-500 mt-1">Professional certifications if required</p>
        </div>

        {/* Special Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary-600" />
            Special Requirements
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
              <input
                type="checkbox"
                name="visaSponsorship"
                checked={formData.visaSponsorship}
                onChange={onChange}
                className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <div>
                <span className="font-semibold text-secondary-900">Visa Sponsorship Available</span>
                <p className="text-sm text-secondary-600">Company can sponsor work visas</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
              <input
                type="checkbox"
                name="securityClearanceRequired"
                checked={formData.securityClearanceRequired}
                onChange={onChange}
                className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <div>
                <span className="font-semibold text-secondary-900">Security Clearance Required</span>
                <p className="text-sm text-secondary-600">Position requires security clearance</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
