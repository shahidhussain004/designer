"use client";

import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useCompletedContracts, useCreateReview, useGivenReviews, useReceivedReviews } from '@/hooks/useUsers';
import { useAuth } from '@/lib/context/AuthContext';
import { Flag, MessageSquare, Star, User } from 'lucide-react';
import { useState } from 'react';

interface Review {
  id: number;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  categoryRatings?: {
    communication?: number;
    quality?: number;
    timeliness?: number;
    professionalism?: number;
  };
  createdAt: string;
  contract: {
    id: number;
    title: string;
  };
  reviewer?: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  reviewee: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

interface Contract {
  id: number;
  title: string;
  status: string;
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const { data: givenReviews = [], isLoading: givenLoading, isError: givenError, error: givenErrorMsg, refetch: refetchGiven } = useGivenReviews(user?.id);
  const { data: receivedReviews = [], isLoading: receivedLoading, isError: receivedError, error: receivedErrorMsg, refetch: refetchReceived } = useReceivedReviews(user?.id);
  const { data: contracts = [] } = useCompletedContracts();
  const createReviewMutation = useCreateReview();

  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contractId: '',
    revieweeId: '',
    rating: 5,
    comment: '',
    isAnonymous: false,
    communication: 5,
    quality: 5,
    timeliness: 5,
    professionalism: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      contract: { id: parseInt(formData.contractId) },
      reviewer: { id: user?.id },
      reviewee: { id: parseInt(formData.revieweeId) },
      rating: formData.rating,
      comment: formData.comment,
      isAnonymous: formData.isAnonymous,
      categoryRatings: {
        communication: formData.communication,
        quality: formData.quality,
        timeliness: formData.timeliness,
        professionalism: formData.professionalism,
      },
    };

    try {
      await createReviewMutation.mutateAsync(payload);
      resetForm();
    } catch (error) {
      console.error('Failed to create review:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      contractId: '',
      revieweeId: '',
      rating: 5,
      comment: '',
      isAnonymous: false,
      communication: 5,
      quality: 5,
      timeliness: 5,
      professionalism: 5,
    });
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const renderRatingInput = (
    label: string,
    value: number,
    onChange: (value: number) => void
  ) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={
                  star <= value
                    ? 'fill-yellow-400 text-yellow-400 hover:scale-110 transition'
                    : 'text-gray-300 hover:text-yellow-200 transition'
                }
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">({value}/5)</span>
        </div>
      </div>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const avgRating =
    receivedReviews.length > 0
      ? (receivedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / receivedReviews.length).toFixed(
          1
        )
      : '0.0';

  const isLoading = givenLoading || receivedLoading;
  const isError = givenError || receivedError;
  const error = givenErrorMsg || receivedErrorMsg;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout>
        <ErrorMessage 
          message={error?.message || 'Failed to load reviews'} 
          retry={() => {
            refetchGiven();
            refetchReceived();
          }}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
            <p className="text-gray-600 mt-2">Manage feedback from your projects</p>
          </div>
          {contracts.length > 0 && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <MessageSquare size={20} />
              Write Review
            </button>
          )}
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Average Rating</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">{avgRating}</p>
              {renderStars(parseFloat(avgRating), 20)}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Reviews Received</p>
              <p className="text-4xl font-bold text-blue-600">{receivedReviews.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Reviews Given</p>
              <p className="text-4xl font-bold text-green-600">{givenReviews.length}</p>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Contract *
                </label>
                <select
                  required
                  value={formData.contractId}
                  onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a completed contract...</option>
                  {contracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reviewee ID * (Client User ID)
                </label>
                <input
                  type="number"
                  required
                  value={formData.revieweeId}
                  onChange={(e) => setFormData({ ...formData, revieweeId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client user ID..."
                />
              </div>

              {renderRatingInput('Overall Rating *', formData.rating, (rating) =>
                setFormData({ ...formData, rating })
              )}

              <div className="grid grid-cols-2 gap-4">
                {renderRatingInput('Communication', formData.communication, (communication) =>
                  setFormData({ ...formData, communication })
                )}
                {renderRatingInput('Work Quality', formData.quality, (quality) =>
                  setFormData({ ...formData, quality })
                )}
                {renderRatingInput('Timeliness', formData.timeliness, (timeliness) =>
                  setFormData({ ...formData, timeliness })
                )}
                {renderRatingInput('Professionalism', formData.professionalism, (professionalism) =>
                  setFormData({ ...formData, professionalism })
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Comment *
                </label>
                <textarea
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share your experience working with this client..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Post anonymously (your name will be hidden)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('received')}
            className={`pb-3 px-4 font-medium transition ${
              activeTab === 'received'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Received Reviews ({receivedReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('given')}
            className={`pb-3 px-4 font-medium transition ${
              activeTab === 'given'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Given Reviews ({givenReviews.length})
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {activeTab === 'received' && receivedReviews.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No reviews received yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete projects to receive reviews from clients
              </p>
            </div>
          )}

          {activeTab === 'given' && givenReviews.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No reviews given yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete a contract and write a review for your client
              </p>
            </div>
          )}

          {(activeTab === 'received' ? receivedReviews : givenReviews).map((review: any) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 rounded-full p-3">
                    <User size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.isAnonymous
                        ? 'Anonymous'
                        : activeTab === 'received'
                        ? review.reviewer?.username || 'Unknown'
                        : review.reviewee?.username || 'Unknown'}
                    </h3>
                    <p className="text-sm text-gray-600">{review.contract.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-600 transition">
                  <Flag size={20} />
                </button>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.rating, 18)}
                  <span className="text-sm font-medium text-gray-700">
                    {review.rating.toFixed(1)}/5.0
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              {review.categoryRatings && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  {Object.entries(review.categoryRatings).map(([category, rating]) => (
                    <div key={category}>
                      <p className="text-xs text-gray-500 mb-1 capitalize">{category}</p>
                      {renderStars(rating as number, 14)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
