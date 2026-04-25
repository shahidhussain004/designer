"use client";

import { useRespondToOffer } from '@/hooks/useJobs';
import {
    AlertCircle,
    Award,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    Gift,
    MessageSquare,
    XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OfferDetailsViewProps {
  application: {
    id: number;
    jobTitle: string;
    companyName: string;
    status: string;
    offeredSalaryCents?: number;
    offeredSalaryCurrency?: string;
    offeredSalaryPeriod?: string;
    offeredStartDate?: string;
    offerExpirationDate?: string;
    contractType?: string;
    contractDurationMonths?: number;
    offerBenefits?: string;
    offerAdditionalTerms?: string;
    offerDocumentUrl?: string;
    offerMadeAt?: string;
  };
}

export function OfferDetailsView({ application }: OfferDetailsViewProps) {
  const router = useRouter();
  const respondToOffer = useRespondToOffer();

  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Calculate time remaining
  useEffect(() => {
    if (!application.offerExpirationDate) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const expiration = new Date(application.offerExpirationDate!);
      const diff = expiration.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h remaining`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeRemaining(`${minutes}m remaining`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [application.offerExpirationDate]);

  const formatSalary = () => {
    if (!application.offeredSalaryCents) return 'Not specified';

    const amount = application.offeredSalaryCents / 100;
    const currency = application.offeredSalaryCurrency || 'USD';
    const period = application.offeredSalaryPeriod?.toLowerCase().replace('ly', '') || 'year';

    return `${currency} ${amount.toLocaleString()}/${period}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOfferExpired = () => {
    if (!application.offerExpirationDate) return false;
    return new Date(application.offerExpirationDate) <= new Date();
  };

  const handleResponse = async (response: 'ACCEPTED' | 'REJECTED') => {
    if (isOfferExpired()) {
      alert('This offer has expired and can no longer be responded to.');
      return;
    }

    setIsSubmitting(true);

    try {
      await respondToOffer.mutateAsync({
        id: application.id,
        response,
        notes: notes.trim() || undefined,
      });

      // Refresh page to show updated status
      router.refresh();
    } catch (error) {
      console.error('Failed to respond to offer:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to respond to offer. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
      setShowAcceptForm(false);
      setShowRejectForm(false);
      setNotes('');
    }
  };

  const expired = isOfferExpired();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-success-200 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center">
            <Award className="w-8 h-8 text-success-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-secondary-900 mb-2">
          🎉 Job Offer Received!
        </h3>
        <p className="text-secondary-600">
          <strong>{application.companyName}</strong> has made you an offer for{' '}
          <strong>{application.jobTitle}</strong>
        </p>

        {/* Expiration Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-warning-50 border border-warning-200 rounded-full">
          <Clock className={`w-4 h-4 ${expired ? 'text-error-600' : 'text-warning-600'}`} />
          <span
            className={`text-sm font-semibold ${expired ? 'text-error-700' : 'text-warning-700'}`}
          >
            {expired ? '⚠️ Offer Expired' : `⏰ ${timeRemaining}`}
          </span>
        </div>
      </div>

      {/* Offer Details Grid */}
      <div className="space-y-6 mb-6">
        {/* Compensation */}
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">
                Compensation
              </p>
              <p className="text-2xl font-bold text-secondary-900">{formatSalary()}</p>
            </div>
          </div>
        </div>

        {/* Contract Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-5 h-5 text-secondary-600" />
              <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide">
                Contract Type
              </p>
            </div>
            <p className="text-lg font-medium text-secondary-900">
              {application.contractType?.replace('_', ' ')}
              {application.contractType === 'CONTRACT' &&
                application.contractDurationMonths && (
                  <span className="text-sm text-secondary-600">
                    {' '}
                    ({application.contractDurationMonths} months)
                  </span>
                )}
            </p>
          </div>

          <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-secondary-600" />
              <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide">
                Start Date
              </p>
            </div>
            <p className="text-lg font-medium text-secondary-900">
              {formatDate(application.offeredStartDate)}
            </p>
          </div>
        </div>

        {/* Benefits */}
        {application.offerBenefits && (
          <div className="bg-accent-50 rounded-lg p-4 border border-accent-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-accent-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-accent-600 uppercase tracking-wide mb-2">
                  Benefits & Perks
                </p>
                <p className="text-sm text-secondary-700 whitespace-pre-line">
                  {application.offerBenefits}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Terms */}
        {application.offerAdditionalTerms && (
          <div className="bg-info-50 rounded-lg p-4 border border-info-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-info-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-info-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-info-600 uppercase tracking-wide mb-2">
                  Additional Terms
                </p>
                <p className="text-sm text-secondary-700 whitespace-pre-line">
                  {application.offerAdditionalTerms}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Offer Document */}
        {application.offerDocumentUrl && (
          <div className="flex items-center gap-3 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <FileText className="w-5 h-5 text-secondary-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-900">Formal Offer Letter</p>
              <a
                href={application.offerDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                Download PDF
              </a>
            </div>
          </div>
        )}

        {/* Expiration Info */}
        <div
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            expired
              ? 'bg-error-50 border-error-200'
              : 'bg-warning-50 border-warning-200'
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 ${expired ? 'text-error-600' : 'text-warning-600'}`}
          />
          <div>
            <p
              className={`text-sm font-medium ${expired ? 'text-error-900' : 'text-warning-900'}`}
            >
              {expired ? 'This offer has expired' : 'Offer expires on'}
            </p>
            <p className={`text-sm ${expired ? 'text-error-700' : 'text-warning-700'}`}>
              {formatDate(application.offerExpirationDate)}
              {!expired && ' - Please respond before this date'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!expired && !showAcceptForm && !showRejectForm && (
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-secondary-200">
          <button
            onClick={() => setShowRejectForm(true)}
            className="px-6 py-3 border-2 border-error-500 text-error-600 rounded-lg hover:bg-error-50 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Decline Offer
          </button>
          <button
            onClick={() => setShowAcceptForm(true)}
            className="px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Accept Offer
          </button>
        </div>
      )}

      {/* Accept Form */}
      {showAcceptForm && (
        <div className="pt-6 border-t border-secondary-200 space-y-4">
          <h4 className="font-semibold text-secondary-900">Accept This Offer</h4>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Message to Company (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-success-500"
              placeholder="Thank you for the offer! I'm excited to join the team..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAcceptForm(false);
                setNotes('');
              }}
              className="flex-1 px-6 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleResponse('ACCEPTED')}
              disabled={isSubmitting}
              className="flex-1 px-6 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Accept
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Reject Form */}
      {showRejectForm && (
        <div className="pt-6 border-t border-secondary-200 space-y-4">
          <h4 className="font-semibold text-secondary-900">Decline This Offer</h4>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Reason (Optional but appreciated)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-error-500"
              placeholder="I've accepted another position..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowRejectForm(false);
                setNotes('');
              }}
              className="flex-1 px-6 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleResponse('REJECTED')}
              disabled={isSubmitting}
              className="flex-1 px-6 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Declining...
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  Confirm Decline
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {expired && (
        <div className="pt-6 border-t border-error-200 text-center">
          <p className="text-error-600 text-sm">
            This offer has expired. Please contact the company if you still wish to discuss this
            position.
          </p>
        </div>
      )}
    </div>
  );
}
