import { AlertCircle, MapPin } from 'lucide-react';
import { REMOTE_TYPES, TRAVEL_REQUIREMENTS } from './constants';
import { FormErrors, JobFormData } from './types';

interface Step2Props {
  formData: JobFormData;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function Step2Location({ formData, errors, onChange }: Step2Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-secondary-900">Location & Work Environment</h2>
      </div>

      <div className="space-y-6">
        {/* Remote Toggle */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isRemote"
              checked={formData.isRemote}
              onChange={onChange}
              className="w-5 h-5 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
            />
            <div>
              <span className="text-lg font-semibold text-secondary-900">Remote Position</span>
              <p className="text-sm text-secondary-600 mt-1">This job can be done remotely</p>
            </div>
          </label>
        </div>

        {/* Remote Type */}
        {formData.isRemote && (
          <div>
            <label htmlFor="remoteType" className="block text-sm font-semibold text-secondary-700 mb-2">
              Remote Type <span className="text-error-600">*</span>
            </label>
            <select
              id="remoteType"
              name="remoteType"
              value={formData.remoteType}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select remote type</option>
              {REMOTE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-secondary-700 mb-2">
            Primary Location <span className="text-error-600">*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g., New York, NY"
            value={formData.location}
            onChange={onChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.location ? 'border-error-300 bg-error-50' : 'border-secondary-300'
            }`}
          />
          {errors.location && (
            <div className="flex items-center gap-2 mt-2 text-error-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.location}</span>
            </div>
          )}
        </div>

        {/* City, State, Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-secondary-700 mb-2">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="New York"
              value={formData.city}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-semibold text-secondary-700 mb-2">
              State / Province
            </label>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="NY"
              value={formData.state}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-semibold text-secondary-700 mb-2">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              placeholder="United States"
              value={formData.country}
              onChange={onChange}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Travel Requirement */}
        <div>
          <label htmlFor="travelRequirement" className="block text-sm font-semibold text-secondary-700 mb-2">
            Travel Requirement
          </label>
          <select
            id="travelRequirement"
            name="travelRequirement"
            value={formData.travelRequirement}
            onChange={onChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {TRAVEL_REQUIREMENTS.map(req => (
              <option key={req.value} value={req.value}>{req.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
