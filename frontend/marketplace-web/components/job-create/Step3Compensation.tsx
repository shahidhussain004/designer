import { AlertCircle, DollarSign } from 'lucide-react';
import { SALARY_PERIODS } from './constants';
import { FormErrors, JobFormData } from './types';

interface Step3Props {
  formData: JobFormData;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function Step3Compensation({ formData, errors, onChange }: Step3Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-secondary-900">Compensation & Benefits</h2>
      </div>

      <div className="space-y-6">
        {/* Salary Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="salaryMinCents" className="block text-sm font-semibold text-secondary-700 mb-2">
              Minimum Salary ($)
            </label>
            <input
              id="salaryMinCents"
              name="salaryMinCents"
              type="number"
              placeholder="50000"
              value={formData.salaryMinCents}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="salaryMaxCents" className="block text-sm font-semibold text-secondary-700 mb-2">
              Maximum Salary ($)
            </label>
            <input
              id="salaryMaxCents"
              name="salaryMaxCents"
              type="number"
              placeholder="80000"
              value={formData.salaryMaxCents}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {errors.salary && (
          <div className="flex items-center gap-2 text-error-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.salary}</span>
          </div>
        )}

        {/* Currency & Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="salaryCurrency" className="block text-sm font-semibold text-secondary-700 mb-2">
              Currency
            </label>
            <select
              id="salaryCurrency"
              name="salaryCurrency"
              value={formData.salaryCurrency}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div>
            <label htmlFor="salaryPeriod" className="block text-sm font-semibold text-secondary-700 mb-2">
              Pay Period
            </label>
            <select
              id="salaryPeriod"
              name="salaryPeriod"
              value={formData.salaryPeriod}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {SALARY_PERIODS.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Show Salary Toggle */}
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="showSalary"
              checked={formData.showSalary}
              onChange={onChange}
              className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
            />
            <div>
              <span className="font-semibold text-secondary-900">Display Salary Range</span>
              <p className="text-sm text-secondary-600">Show salary information to applicants</p>
            </div>
          </label>
        </div>

        {/* Benefits */}
        <div>
          <label htmlFor="benefits" className="block text-sm font-semibold text-secondary-700 mb-2">
            Benefits (comma-separated)
          </label>
          <textarea
            id="benefits"
            name="benefits"
            placeholder="Health Insurance, 401k Matching, Paid Time Off, Professional Development"
            value={formData.benefits}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-secondary-500 mt-1">Separate each benefit with a comma</p>
        </div>

        {/* Perks */}
        <div>
          <label htmlFor="perks" className="block text-sm font-semibold text-secondary-700 mb-2">
            Perks (comma-separated)
          </label>
          <textarea
            id="perks"
            name="perks"
            placeholder="Remote Work, Flexible Hours, Free Lunch, Gym Membership"
            value={formData.perks}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-secondary-500 mt-1">Separate each perk with a comma</p>
        </div>
      </div>
    </div>
  );
}
