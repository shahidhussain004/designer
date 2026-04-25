"use client";

import { useMakeOffer } from '@/hooks/useJobs';
import { X } from 'lucide-react';
import { useState } from 'react';

interface MakeOfferModalProps {
  applicationId: number;
  candidateName: string;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function MakeOfferModal({
  applicationId,
  candidateName,
  jobTitle,
  onClose,
  onSuccess,
}: MakeOfferModalProps) {
  const makeOffer = useMakeOffer();

  const [formData, setFormData] = useState({
    offeredSalaryCents: '',
    offeredSalaryCurrency: 'USD',
    offeredSalaryPeriod: 'YEARLY',
    offeredStartDate: '',
    offerExpirationDate: '',
    contractType: 'FULL_TIME',
    contractDurationMonths: '',
    offerBenefits: '',
    offerAdditionalTerms: '',
    offerDocumentUrl: '',
    companyNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.offeredSalaryCents || parseInt(formData.offeredSalaryCents) <= 0) {
      newErrors.offeredSalaryCents = 'Please enter a valid salary amount';
    }

    if (!formData.offeredStartDate) {
      newErrors.offeredStartDate = 'Start date is required';
    }

    if (!formData.offerExpirationDate) {
      newErrors.offerExpirationDate = 'Offer expiration date is required';
    }

    // Validate dates
    const startDate = new Date(formData.offeredStartDate);
    const expirationDate = new Date(formData.offerExpirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expirationDate <= today) {
      newErrors.offerExpirationDate = 'Expiration date must be in the future';
    }

    if (startDate < today) {
      newErrors.offeredStartDate = 'Start date cannot be in the past';
    }

    if (formData.contractType === 'CONTRACT') {
      if (
        !formData.contractDurationMonths ||
        parseInt(formData.contractDurationMonths) <= 0
      ) {
        newErrors.contractDurationMonths =
          'Contract duration is required for CONTRACT type';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert dollar amount to cents
      const salaryCents = Math.round(parseFloat(formData.offeredSalaryCents) * 100);

      await makeOffer.mutateAsync({
        id: applicationId,
        offeredSalaryCents: salaryCents,
        offeredSalaryCurrency: formData.offeredSalaryCurrency,
        offeredSalaryPeriod: formData.offeredSalaryPeriod,
        offeredStartDate: new Date(formData.offeredStartDate).toISOString(),
        offerExpirationDate: new Date(formData.offerExpirationDate).toISOString(),
        contractType: formData.contractType,
        contractDurationMonths: formData.contractDurationMonths
          ? parseInt(formData.contractDurationMonths)
          : undefined,
        offerBenefits: formData.offerBenefits || undefined,
        offerAdditionalTerms: formData.offerAdditionalTerms || undefined,
        offerDocumentUrl: formData.offerDocumentUrl || undefined,
        companyNotes: formData.companyNotes || undefined,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to make offer:', error);
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : 'Failed to make offer. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Make Job Offer</h2>
            <p className="text-sm text-secondary-600 mt-1">
              Offering <strong>{candidateName}</strong> the position of <strong>{jobTitle}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Compensation Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900 border-b pb-2">
              💰 Compensation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Salary Amount <span className="text-error-600">*</span>
                </label>
                <input
                  type="number"
                  name="offeredSalaryCents"
                  value={formData.offeredSalaryCents}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.offeredSalaryCents
                      ? 'border-error-500'
                      : 'border-secondary-300'
                  }`}
                  placeholder="50000"
                />
                {errors.offeredSalaryCents && (
                  <p className="text-sm text-error-600 mt-1">{errors.offeredSalaryCents}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Currency <span className="text-error-600">*</span>
                </label>
                <select
                  name="offeredSalaryCurrency"
                  value={formData.offeredSalaryCurrency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="SEK">SEK</option>
                  <option value="GBP">GBP</option>
                  <option value="NOK">NOK</option>
                  <option value="DKK">DKK</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Period <span className="text-error-600">*</span>
                </label>
                <select
                  name="offeredSalaryPeriod"
                  value={formData.offeredSalaryPeriod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="YEARLY">Yearly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="HOURLY">Hourly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contract Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900 border-b pb-2">
              📋 Contract Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Contract Type <span className="text-error-600">*</span>
                </label>
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Fixed-term Contract</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </div>

              {formData.contractType === 'CONTRACT' && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Contract Duration (months) <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="contractDurationMonths"
                    value={formData.contractDurationMonths}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.contractDurationMonths
                        ? 'border-error-500'
                        : 'border-secondary-300'
                    }`}
                    placeholder="12"
                  />
                  {errors.contractDurationMonths && (
                    <p className="text-sm text-error-600 mt-1">
                      {errors.contractDurationMonths}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dates Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900 border-b pb-2">
              📅 Important Dates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Proposed Start Date <span className="text-error-600">*</span>
                </label>
                <input
                  type="date"
                  name="offeredStartDate"
                  value={formData.offeredStartDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.offeredStartDate ? 'border-error-500' : 'border-secondary-300'
                  }`}
                />
                {errors.offeredStartDate && (
                  <p className="text-sm text-error-600 mt-1">{errors.offeredStartDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Offer Expiration Date <span className="text-error-600">*</span>
                </label>
                <input
                  type="date"
                  name="offerExpirationDate"
                  value={formData.offerExpirationDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.offerExpirationDate
                      ? 'border-error-500'
                      : 'border-secondary-300'
                  }`}
                />
                {errors.offerExpirationDate && (
                  <p className="text-sm text-error-600 mt-1">
                    {errors.offerExpirationDate}
                  </p>
                )}
                <p className="text-xs text-secondary-500 mt-1">
                  Candidate must respond before this date
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900 border-b pb-2">
              🎁 Benefits & Perks
            </h3>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Benefits
              </label>
              <textarea
                name="offerBenefits"
                value={formData.offerBenefits}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Health insurance, 25 vacation days, dental coverage, gym membership..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Additional Terms
              </label>
              <textarea
                name="offerAdditionalTerms"
                value={formData.offerAdditionalTerms}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Remote work allowed, laptop provided, 3-month probation period..."
              />
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900 border-b pb-2">
              📄 Documents (Optional)
            </h3>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Offer Document URL
              </label>
              <input
                type="url"
                name="offerDocumentUrl"
                value={formData.offerDocumentUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/offer-letter.pdf"
              />
              <p className="text-xs text-secondary-500 mt-1">
                Link to formal offer letter (PDF recommended)
              </p>
            </div>
          </div>

          {/* Internal Notes Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900 border-b pb-2">
              🗒️ Internal Notes (Not visible to candidate)
            </h3>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Company Notes
              </label>
              <textarea
                name="companyNotes"
                value={formData.companyNotes}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Internal notes for tracking..."
              />
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <p className="text-error-800 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Making Offer...
                </>
              ) : (
                '✉️ Send Offer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
